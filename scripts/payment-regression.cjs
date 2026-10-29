const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');

// Public test vector from https://developer.2c2p.com/docs/json-web-tokens-jwt.
// This is 2C2P's documentation example, never a live merchant credential.
const exampleKey = '1F4EDB965BBB3094F791A83750FBDCDA3852131CB5218E21E4F42929A1975E60';
const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElEIjoiSlQwMSIsImludm9pY2VObyI6IjE1MjM5NTM2NjEiLCJkZXNjcmlwdGlvbiI6Iml0ZW0gMSIsImFtb3VudCI6MTAwMCwiY3VycmVuY3lDb2RlIjoiU0dEIn0.ElmhOULUdK63FnriSs2XyhH1LxULoTVIopTUuQ77DvA';
const examplePayload = { merchantID: 'JT01', invoiceNo: '1523953661', description: 'item 1', amount: 1000, currencyCode: 'SGD' };
function sign(payload, key = exampleKey, alg = 'HS256') {
  const body = [ { alg, typ: 'JWT' }, payload ].map(v => Buffer.from(JSON.stringify(v)).toString('base64url')).join('.');
  return `${body}.${crypto.createHmac('sha256', key).update(body).digest('base64url')}`;
}
function load(response, extraEnv = {}) {
  const module = { exports: {} }, calls = [];
  const source = fs.readFileSync('src/lib/2c2p.ts', 'utf8') + '\nexport { generateJWT };';
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    module, exports: module.exports, require, Buffer, AbortSignal,
    console: { log() {}, error() {} },
    process: { env: { TWOC2P_MERCHANT_ID: 'JT01', TWOC2P_SECRET_KEY: exampleKey, ...extraEnv } },
    fetch: async (url, options) => { calls.push({ url, options }); return { json: async () => response }; },
  });
  return { ...module.exports, calls };
}
const request = { invoiceNo: 'TEST123', amount: 2100, description: 'Spa reservation' };

test('JWT signing exactly matches the official 2C2P test vector', () => {
  const h = load({});
  assert.equal(h.generateJWT(examplePayload), exampleToken);
  assert.equal(h.parseCallbackPayload(exampleToken).invoiceNo, '1523953661');
});

test('configuration whitespace cannot change signatures or sandbox selection', async () => {
  const h = load({ respCode: '9042' }, { TWOC2P_SECRET_KEY: ` ${exampleKey}\r\n`, TWOC2P_MERCHANT_ID: ' JT01\n', TWOC2P_SANDBOX: 'true\n' });
  assert.equal(h.generateJWT(examplePayload), exampleToken);
  await h.requestPaymentToken(request);
  assert.match(h.calls[0].url, /^https:\/\/sandbox-pgw\.2c2p\.com/);
  const jwt = JSON.parse(h.calls[0].options.body).payload;
  assert.equal(JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url')).merchantID, 'JT01');
});

test('9042 produces an actionable operator error and cannot appear successful', async () => {
  const h = load({ respCode: '9042', respDesc: 'Invalid Request (9042)' });
  for (const result of [await h.requestPaymentToken(request), await h.inquirePayment('TEST123')]) {
    assert.equal(result.success, false);
    assert.equal(result.respCode, '9042');
    assert.match(result.error, /merchant SHA secret/);
    assert.ok(!result.error.includes(exampleKey));
  }
});

test('token and inquiry responses require a valid HS256 signature', async () => {
  const payload = { respCode: '0000', webPaymentUrl: 'https://pgw-ui.2c2p.com/payment/test', paymentToken: 'test-token' };
  for (const token of [sign(payload, 'wrong-key'), sign(payload, exampleKey, 'none'), 'malformed.token', sign(payload).replace(/.$/, '!')]) {
    const h = load({ payload: token });
    assert.equal((await h.requestPaymentToken(request)).success, false);
    assert.equal((await h.inquirePayment('TEST123')).success, false);
    assert.equal(h.parseCallbackPayload(token), null);
  }
  const h = load({ payload: sign(payload) });
  assert.equal((await h.requestPaymentToken(request)).webPaymentUrl, payload.webPaymentUrl);
  assert.equal((await h.inquirePayment('TEST123')).success, true);
});

test('a signed but incomplete payment response cannot redirect a guest', async () => {
  for (const payload of [{ respCode: '0000' }, { respCode: '0000', webPaymentUrl: 'javascript:alert(1)', paymentToken: 'test' }]) {
    assert.equal((await load({ payload: sign(payload) }).requestPaymentToken(request)).success, false);
  }
});

test('unconfigured credentials cannot accept callbacks or call the gateway', async () => {
  const h = load({}, { TWOC2P_SECRET_KEY: '' });
  assert.equal(h.parseCallbackPayload(sign({ respCode: '0000' }, '')), null);
  assert.equal((await h.requestPaymentToken(request)).success, false);
  assert.equal(h.calls.length, 0);
});

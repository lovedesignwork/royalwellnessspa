const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const moduleMock = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/analytics.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { module: moduleMock, exports: moduleMock.exports, URL, Set });
const { createSpaTracker, safeReferrer, isPublicSpaPath } = moduleMock.exports;
function setup(host = 'www.royalwellnessspaphuket.com', id = 'G-TEST123') {
  const scripts = [];
  const win = { location: { hostname: host, origin: `https://${host}` } };
  const doc = { referrer: 'https://search.example.test/search?q=private', createElement: () => ({}), head: { appendChild: script => scripts.push(script) } };
  const tracker = createSpaTracker(win, doc, id);
  return { ...tracker, win, scripts, commands: () => (win.dataLayer || []).map(args => Array.from(args)) };
}
test('no Google script or events load before consent or after decline', () => {
  const h = setup(); h.track('/en', false);
  assert.equal(h.scripts.length, 0); assert.equal(h.commands().length, 0);
  h.track('/en', true); h.disable();
  assert.equal(h.win['ga-disable-G-TEST123'], true);
  h.track('/en/contact', false);
  assert.equal(h.commands().filter(c => c[0] === 'event').length, 1);
});
test('one page view per route; StrictMode replays and query data cannot duplicate views', () => {
  const h = setup(); h.track('/en', true); h.disable(); h.track('/en', true);
  h.track('/en/treatments', true); h.track('/en/treatments', true);
  assert.equal(h.scripts.length, 1);
  const events = h.commands().filter(c => c[0] === 'event');
  assert.equal(events.length, 2);
  assert.equal(events[0][2].page_referrer, 'https://search.example.test/');
  assert.equal(events[1][2].page_location, 'https://www.royalwellnessspaphuket.com/en/treatments');
  assert.equal(events[1][2].page_referrer, 'https://www.royalwellnessspaphuket.com/en');
  assert.equal(h.commands().find(c => c[0] === 'config')[2].send_page_view, false);
  assert.ok(!JSON.stringify(h.commands()).includes('private'));
});
test('admin, payment, unrecognized paths, preview and localhost never collect', () => {
  for (const path of ['/xadmin', '/en/payment/result', '/th/payment/success', '/api/payment', '/en/book/123456', '/en/contact/private', '/en/contact?email=private', '/en#private', '/en/unknown']) {
    const h = setup(); h.track(path, true); assert.equal(h.scripts.length, 0, path);
  }
  for (const host of ['localhost', 'preview.vercel.app', 'royalwellnessspaphuket.com.evil.test']) {
    const h = setup(host); h.track('/en', true); assert.equal(h.scripts.length, 0, host);
  }
  const invalid = setup(undefined, 'INVALID'); invalid.track('/en', true); assert.equal(invalid.scripts.length, 0);
  assert.equal(isPublicSpaPath('/th/book'), true);
  for (const path of ['/', '/book', '/treatments/20', '/blog/choosing-massage-phuket-town', '/th', '/th/contact']) assert.equal(isPublicSpaPath(path), true, path);
  const h = setup(); h.track('/en', true); h.track('/en/payment/result', true);
  assert.equal(h.win['ga-disable-G-TEST123'], true);
});
test('advertising remains denied; reporting has no guest form values or raw referrer queries', () => {
  const h = setup(); h.track('/th/book', true);
  for (const command of h.commands().filter(c => c[0] === 'consent')) {
    assert.equal(command[2].ad_storage, 'denied'); assert.equal(command[2].ad_user_data, 'denied'); assert.equal(command[2].ad_personalization, 'denied');
  }
  assert.equal(safeReferrer('https://www.royalwellnessspaphuket.com/en/payment/result?id=private'), 'https://www.royalwellnessspaphuket.com/');
  assert.equal(safeReferrer('https://www.royalwellnessspaphuket.com/en/contact?q=private#name'), 'https://www.royalwellnessspaphuket.com/en/contact');
  assert.equal(safeReferrer('javascript:alert(1)'), '');
});

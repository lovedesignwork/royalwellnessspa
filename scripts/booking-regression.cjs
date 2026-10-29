const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
function compile(source, context = {}) {
  const module = {exports:{}};
  vm.runInNewContext(ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText, {module,exports:module.exports,require,...context});
  return module.exports;
}
const identity = compile(fs.readFileSync('src/lib/booking-attempt.ts','utf8'));
const payload = {amount:2100,treatments:[{guestName:'Guest 1',treatmentName:'Test massage',price:2100}],date:'2026-11-12',time:'16:00',customer:{firstName:'Test',lastName:'Guest',email:'test@example.test',phone:'+66800000000'},notes:''};
const key = 'da11b66e-2927-40ca-9fd8-4a0ec7d6de38';
function harness() {
  const rows=new Map(), invoices=[];
  const db = { from: () => ({
    insert: row => ({ select: () => ({ single: async () => {
      if (rows.has(row.id)) return {data:null,error:{code:'23505'}};
      rows.set(row.id,row);
      return {data:{...row},error:null};
    } }) }),
    select: () => ({ eq: (_field,id) => ({ single: async () => ({data:{...rows.get(id)},error:null}) }) }),
  }) };
  const {POST}=compile(fs.readFileSync('src/app/api/payment/create/route.ts','utf8'),{process:{env:{TWOC2P_MERCHANT_ID:'test'}},console:{error(){}},require(name){
    if(name==='next/server')return {NextResponse:{json:(body,init)=>({status:init?.status||200,body})}};
    if(name==='@/lib/supabase-rpch')return {getRPCHSupabaseClient:()=>db};
    if(name==='@/lib/booking-attempt')return identity;
    if(name==='@/lib/2c2p')return {requestPaymentToken:async request=>{invoices.push(request.invoiceNo);return {success:false,error:'9042'};}};
    throw Error(name);
  }});
  return {rows,invoices,run:(body=payload,attempt=key)=>POST({headers:new Headers(attempt?{'Idempotency-Key':attempt}:{}),json:async()=>body})};
}
test('payment initialization failure and retry reuse one booking, invoice and notification source',async()=>{
  const h=harness(); const first=await h.run(); const second=await h.run();
  assert.equal(first.status,500); assert.equal(second.status,500);
  assert.equal(h.rows.size,1); assert.equal(first.body.bookingRef,second.body.bookingRef);
  assert.equal(new Set(h.invoices).size,1); assert.match(second.body.error,/has been received/);
});
test('simultaneous retries cannot insert two reservation rows',async()=>{
  const h=harness(); const results=await Promise.all([h.run(),h.run(),h.run()]);
  assert.equal(h.rows.size,1); assert.equal(new Set(results.map(r=>r.body.bookingRef)).size,1);
});
test('different attempts or edited bookings do not reuse an old payment amount',async()=>{
  const h=harness(); await h.run(); await h.run({...payload,amount:1890}); await h.run(payload,crypto.randomUUID());
  assert.equal(h.rows.size,3);
});
test('paid bookings cannot request payment again; missing attempt keys cannot insert',async()=>{
  const h=harness(); await h.run(); [...h.rows.values()][0].payment_status='paid';
  assert.equal((await h.run()).status,409); assert.equal(h.invoices.length,1);
  assert.equal((await h.run(payload,null)).status,400); assert.equal(h.rows.size,1);
});
test('the real submit handler blocks double clicks and preserves the key after errors',async()=>{
  const page=fs.readFileSync('src/app/[locale]/book/page.tsx','utf8');
  const handler=page.slice(page.indexOf('  const handlePayment ='),page.indexOf('  const getStepIndex ='));
  const calls=[],storage=new Map(); let finish;
  const paymentInFlight={current:false},bookingAttempt={current:null};
  const context={crypto:crypto.webcrypto,TextEncoder,Uint8Array,console:{error(){}},paymentInFlight,bookingAttempt,
    bookingData:{...payload.customer,date:payload.date,time:payload.time,notes:'',isHotelGuest:false,guests:[{guestName:'Guest 1',treatment:{name:'Test massage'},selectedDuration:'60 min',selectedPrice:2100}]},
    calculateTotal:()=>2100,calculateDiscount:()=>0,setIsProcessing(){},setPaymentError(){},setCurrentStep(){},setPaymentForm(){},
    sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
    fetch:async(_url,options)=>{calls.push(options);await new Promise(resolve=>{finish=resolve;});return {json:async()=>({success:false,error:'Payment unavailable'})};}};
  const {submit}=compile(`${handler}\nexport const submit=handlePayment;`,context);
  const event={preventDefault(){}};
  const first=submit(event); await submit(event);
  while(!finish)await new Promise(resolve=>setImmediate(resolve)); finish(); await first;
  assert.equal(calls.length,1);
  const next=submit(event); while(calls.length<2)await new Promise(resolve=>setImmediate(resolve)); finish(); await next;
  assert.equal(calls[0].headers['Idempotency-Key'],calls[1].headers['Idempotency-Key']);
  assert.ok(![...storage.values()].join('').includes('example.test'));
});

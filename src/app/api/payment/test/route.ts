import {NextRequest,NextResponse} from 'next/server';
import {paymentDatabase} from '@/lib/payment-booking';
import {generatePaymentFormData,paymentCookieName,paymentCookieValue} from '@/lib/paysolutions';
import {isTestBooking,validTestLink} from '@/lib/payment-test';
const escapeHtml=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export async function GET(request:NextRequest) {
 const ref=request.nextUrl.searchParams.get('ref')||'';const expires=request.nextUrl.searchParams.get('expires')||'';const token=request.nextUrl.searchParams.get('token')||'';
 try{
 if(process.env.PAYSOLUTIONS_ENABLED!=='true'||!validTestLink(ref,expires,token))return new NextResponse('This private test link is invalid or expired.',{status:404});
 const {data:booking,error}=await paymentDatabase().from('spa_reservations').select('service,amount,payment_status,email').eq('payment_ref',ref).single();
 if(error||!booking||!isTestBooking(booking))return new NextResponse('Test payment not found.',{status:404});
 let response:NextResponse;
 if(booking.payment_status==='paid')response=NextResponse.redirect(new URL(`/payment/result?gateway=paysolutions&refno=${ref}`,request.url),303);
 else{
 const checkout=generatePaymentFormData({refNo:ref,amount:10,description:booking.service,customerEmail:booking.email});
 const fields=Object.entries(checkout.formData).map(([key,value])=>`<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(value)}">`).join('');
 response=new NextResponse(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Royal Wellness — ฿10 Payment Test</title><style>body{font:18px/1.6 system-ui;background:#faf8f3;color:#25251f;margin:0;padding:40px 24px}main{max-width:560px;margin:6vh auto;background:white;padding:32px;border-radius:20px}h1{font:36px Georgia,serif}button{font:inherit;background:#a58642;color:white;padding:14px 24px;border:0;border-radius:30px;cursor:pointer}.small{font-size:14px;overflow-wrap:anywhere}</style><main><p>ROYAL WELLNESS SPA</p><h1>฿10 real payment test</h1><p>This is a real charge to Royal Wellness Spa. No spa treatment or appointment is included. A refund is not automatic.</p><p>Guest confirmation: <strong>${escapeHtml(booking.email)}</strong></p><p>Choose <strong>PromptPay</strong> on the secure Pay Solutions page. A successful payment will trigger the usual guest and team booking emails, clearly identified as a test.</p><form method="post" action="${checkout.paymentUrl}">${fields}<button type="submit">Continue to Pay Solutions — ฿10</button></form><p class="small">Payment reference: ${ref}<br>Link expires in one hour. Complete checkout and return in this browser.</p></main></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action https://payments.paysolutions.asia; frame-ancestors 'none'; base-uri 'none'"}});
 }
 response.cookies.set(paymentCookieName(ref),paymentCookieValue(ref),{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:86400});
 response.headers.set('Cache-Control','no-store');response.headers.set('X-Robots-Tag','noindex, nofollow');response.headers.set('Referrer-Policy','no-referrer');return response;
 }catch{return new NextResponse('Unable to open test checkout. Please try again.',{status:503});}
}

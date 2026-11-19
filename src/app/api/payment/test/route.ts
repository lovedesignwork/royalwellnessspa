import {NextRequest,NextResponse} from 'next/server';
import {getResend,ADMIN_RECIPIENTS,BOOKING_ADMIN_RECIPIENTS,sendBookingTeamNotification} from '@/lib/email';
import {paymentDatabase} from '@/lib/payment-booking';
import {paymentCookieName,paymentCookieValue} from '@/lib/paysolutions';
import {createHostedPayment} from '@/lib/paysolutions-hosted';
import {isTestBooking,validTestLink} from '@/lib/payment-test';
const escapeHtml=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export async function GET(request:NextRequest) {
 const ref=request.nextUrl.searchParams.get('ref')||'';const expires=request.nextUrl.searchParams.get('expires')||'';const token=request.nextUrl.searchParams.get('token')||'';
 try{
 if(process.env.PAYSOLUTIONS_ENABLED!=='true'||!validTestLink(ref,expires,token))return new NextResponse('This private test link is invalid or expired.',{status:404});
 const {data:booking,error}=await paymentDatabase().from('spa_reservations').select('reference,service,amount,payment_status,email').eq('payment_ref',ref).single();
 if(error||!booking||!isTestBooking(booking))return new NextResponse('Test payment not found.',{status:404});
 let response:NextResponse;
 const emailId=request.nextUrl.searchParams.get('emailId');
 const suppressionEmail=request.nextUrl.searchParams.get('suppression');
 if(suppressionEmail){
  if(!ADMIN_RECIPIENTS.some(email=>email===suppressionEmail))return NextResponse.json({error:'Recipient not found.'},{status:404});
  const lookup=await fetch(`https://api.resend.com/suppressions/${encodeURIComponent(suppressionEmail)}`,{headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`},cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(lookup.status===404)response=NextResponse.json({email:suppressionEmail,suppressed:false});
  else if(lookup.ok){const entry=await lookup.json();response=NextResponse.json({email:suppressionEmail,suppressed:true,origin:entry.origin,source_id:entry.source_id,created_at:entry.created_at});}
  else return NextResponse.json({error:'Suppression lookup unavailable.',status:lookup.status},{status:503});
 }
 else if(emailId){
  if(!/^[a-f0-9-]{36}$/i.test(emailId))return NextResponse.json({error:'Email not found.'},{status:404});
  const resend=getResend();if(!resend)return NextResponse.json({error:'Email delivery lookup is not configured.'},{status:503});
  const result=await resend.emails.get(emailId);
  if(result.error){console.warn('spa-test-email-inspection-unavailable',{code:result.error.name});return NextResponse.json({error:'Email delivery lookup unavailable.',code:result.error.name},{status:503});}
  if(!result.data?.subject.includes(booking.reference))return NextResponse.json({error:'Email not found.'},{status:404});
  response=NextResponse.json({id:result.data.id,to:result.data.to,subject:result.data.subject,status:result.data.last_event,created_at:result.data.created_at});
 }
 else if(booking.payment_status==='paid')response=NextResponse.redirect(new URL(`/payment/result?gateway=paysolutions&refno=${ref}`,request.url),303);
 else{
 const checkout=await createHostedPayment({refNo:ref,amount:10,description:booking.service,customerEmail:booking.email});
 response=new NextResponse(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Royal Wellness — ฿10 Payment Test</title><style>body{font:18px/1.6 system-ui;background:#faf8f3;color:#25251f;margin:0;padding:40px 24px}main{max-width:560px;margin:6vh auto;background:white;padding:32px;border-radius:20px}h1{font:36px Georgia,serif}a{display:inline-block;text-decoration:none;font:inherit;background:#a58642;color:white;padding:14px 24px;border:0;border-radius:30px;cursor:pointer}.small{font-size:14px;overflow-wrap:anywhere}</style><main><p>ROYAL WELLNESS SPA</p><h1>฿10 real payment test</h1><p>This is a real charge to Royal Wellness Spa. No spa treatment or appointment is included. A refund is not automatic.</p><p>Guest confirmation: <strong>${escapeHtml(booking.email)}</strong></p><p>Choose <strong>PromptPay</strong> on the secure Pay Solutions page. A successful payment will trigger the usual guest and team booking emails, clearly identified as a test.</p><a href="${escapeHtml(checkout.paymentUrl)}">Continue to Pay Solutions — ฿10</a><p class="small">Payment reference: ${ref}<br>Link expires in one hour. Complete checkout and return in this browser.</p></main></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'"}});
 }
 response.cookies.set(paymentCookieName(ref),paymentCookieValue(ref),{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:86400});
 response.headers.set('Cache-Control','no-store');response.headers.set('X-Robots-Tag','noindex, nofollow');response.headers.set('Referrer-Policy','no-referrer');return response;
 }catch{return new NextResponse('Unable to open test checkout. Please try again.',{status:503});}
}

// Private, explicit retry of the existing paid test's team message only.
export async function POST(request:NextRequest) {
 try {
  const {ref,expires,token,action}=await request.json();
  if(process.env.PAYSOLUTIONS_ENABLED!=='true'||action!=='retry-team-email'||typeof ref!=='string'||typeof expires!=='string'||typeof token!=='string'||!validTestLink(ref,expires,token))return NextResponse.json({error:'Invalid test authorization.'},{status:404});
  const {data:booking,error}=await paymentDatabase().from('spa_reservations').select('*').eq('payment_ref',ref).single();
  if(error||!booking||!isTestBooking(booking)||booking.payment_status!=='paid')return NextResponse.json({error:'A confirmed paid test booking is required.'},{status:400});
  const id=await sendBookingTeamNotification({reference:booking.reference,guestName:booking.guest_name,email:booking.email,phone:booking.phone,date:booking.date,time:booking.time,guests:booking.guests,service:booking.service,amount:Number(booking.amount),occasion:booking.occasion,specialRequests:booking.special_requests,transactionId:booking.transaction_id});
  return NextResponse.json({id,to:BOOKING_ADMIN_RECIPIENTS},{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
 } catch {return NextResponse.json({error:'Unable to retry the staff notification.'},{status:503});}
}

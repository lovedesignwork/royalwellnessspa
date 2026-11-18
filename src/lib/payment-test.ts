import 'server-only';
import {createHmac,timingSafeEqual} from 'node:crypto';
import {paymentConfig} from './paysolutions';
export const PAYMENT_TEST_SERVICE='SYSTEM PAYMENT TEST - NO SPA TREATMENT';
export function testLinkSignature(ref:string,expires:string) {
 return createHmac('sha256',paymentConfig().secret).update(`spa-live-test:${ref}:${expires}`).digest('hex');
}
export function validTestLink(ref:string,expires:string,token:string,now=Date.now()) {
 if(!/^\d{12}$/.test(ref)||!/^\d{10,13}$/.test(expires)||!/^[a-f0-9]{64}$/.test(token))return false;
 const expiry=Number(expires);if(expiry<now||expiry>now+3600000)return false;
 return timingSafeEqual(Buffer.from(token,'hex'),Buffer.from(testLinkSignature(ref,expires),'hex'));
}
export function isTestBooking(booking:{service:string;amount:number|string;payment_status:string}) {
 return booking.service===PAYMENT_TEST_SERVICE&&Number(booking.amount)===10&&['pending','paid'].includes(booking.payment_status);
}

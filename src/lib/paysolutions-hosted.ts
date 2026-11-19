import 'server-only';
import { paymentConfig } from './paysolutions';

export const HOSTED_PAYMENT_API = 'https://apis.paysolutions.asia/payment/gateway/v2/ui-payments';
export const SPA_PAYMENT_ORIGIN = 'https://www.royalwellnessspaphuket.com';
export type HostedCheckoutRequest = {
  refNo: string;
  amount: number;
  description: string;
  customerEmail: string;
  locale?: string;
};

export function hostedPaymentConfig() {
  const merchant = paymentConfig();
  const terminalId = process.env.PAYSOLUTIONS_TERMINAL_ID?.trim();
  const keyVersion = process.env.PAYSOLUTIONS_KEY_VERSION?.trim();
  const apiKey = process.env.PAYSOLUTIONS_V2_API_KEY?.trim();
  const secretKey = process.env.PAYSOLUTIONS_V2_SECRET_KEY?.trim();
  if (!terminalId || !/^[A-Za-z0-9]{8}$/.test(terminalId)) throw new Error('Pay Solutions Terminal ID is not configured.');
  if (!keyVersion || !/^\d$/.test(keyVersion)) throw new Error('Pay Solutions key version is not configured.');
  if (!!apiKey !== !!secretKey) throw new Error('Configure both terminal API credentials together.');
  return {merchantId: merchant.merchantId, terminalId, keyVersion: Number(keyVersion), apiKey: apiKey || merchant.apiKey, secretKey: secretKey || merchant.secret};
}

export function hostedPaymentPayload(request: HostedCheckoutRequest) {
  const config = hostedPaymentConfig();
  if (!/^\d{12}$/.test(request.refNo) || !Number.isFinite(request.amount) || request.amount <= 0 || request.amount > 9999999) throw new Error('Invalid payment request.');
  if (typeof request.customerEmail !== 'string' || request.customerEmail.length > 50 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.customerEmail)) throw new Error('Enter a valid email address of up to 50 characters.');
  const returnUrl = new URL('/payment/result', SPA_PAYMENT_ORIGIN);
  returnUrl.searchParams.set('gateway', 'paysolutions');
  returnUrl.searchParams.set('refno', request.refNo);
  const postbackUrl = new URL('/api/payment/paysolutions/callback', SPA_PAYMENT_ORIGIN);
  // Dynamic callbacks are GET requests without a body. Include the reference explicitly.
  postbackUrl.searchParams.set('refno', request.refNo);
  return {
    merchantId: config.merchantId,
    customerEmail: request.customerEmail,
    referenceNo: request.refNo,
    description: request.description.replace(/[<>&"']/g, ' ').slice(0, 100),
    amount: Math.round(request.amount * 100) / 100,
    paymentChannel: 'ALL',
    paymentGateway: '',
    installmentTerm: '',
    currencyCode: '00',
    lang: request.locale === 'th' ? 'TH' : 'EN',
    returnUrl: returnUrl.href,
    postbackUrl: postbackUrl.href,
    terminalId: config.terminalId,
    keyVersion: config.keyVersion,
  };
}

export function validateHostedRedirect(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Pay Solutions did not return a checkout URL.');
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !['apis.paysolutions.asia', 'payments.paysolutions.asia'].includes(url.hostname)) throw new Error('Pay Solutions returned an unexpected checkout URL.');
  return url.href;
}

export async function createHostedPayment(request: HostedCheckoutRequest) {
  const config = hostedPaymentConfig();
  const response = await fetch(HOSTED_PAYMENT_API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json; charset=utf-8', apiKey: config.apiKey, secretKey: config.secretKey},
    body: JSON.stringify(hostedPaymentPayload(request)),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Pay Solutions checkout is temporarily unavailable.');
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('status' in data) || !data.status || typeof data.status !== 'object' || !('statusCode' in data.status) || data.status.statusCode !== '2A002' || !('redirectUrl' in data) || !('transactionId' in data) || typeof data.transactionId !== 'string' || !data.transactionId) throw new Error('Pay Solutions could not initialize checkout.');
  // Never fall back to the merchant-default form: it can route spa payments to the hotel.
  return {paymentUrl: validateHostedRedirect(data.redirectUrl), checkoutTransactionId: data.transactionId};
}

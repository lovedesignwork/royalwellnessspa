import 'server-only';
import { createHmac, timingSafeEqual } from "node:crypto";

export const PAYMENT_URL = "https://payments.paysolutions.asia/payment";
export const INQUIRY_URL =
  "https://apis.paysolutions.asia/order/orderdetailpost";
export function paymentConfig() {
  const merchantId = process.env.PAYSOLUTIONS_MERCHANT_ID?.trim();
  const secret = process.env.PAYSOLUTIONS_SECRET_KEY?.trim();
  const apiKey = process.env.PAYSOLUTIONS_API_KEY?.trim();
  if (!merchantId || !/^\d{8}$/.test(merchantId) || !secret || !apiKey)
    throw new Error("Payment service is not configured.");
  return { merchantId, secret, apiKey };
}
export function generatePaymentFormData(request: {
  refNo: string;
  amount: number;
  description: string;
  customerEmail: string;
  locale?: string;
}) {
  const { merchantId } = paymentConfig();
  if (
    !/^\d{12}$/.test(request.refNo) ||
    !Number.isFinite(request.amount) ||
    request.amount <= 0 ||
    request.amount > 9999999
  )
    throw new Error("Invalid payment request.");
  return {
    paymentUrl: PAYMENT_URL,
    formData: {
      merchantid: merchantId,
      refno: request.refNo,
      customeremail: request.customerEmail,
      productdetail: request.description.replace(/[<>&"']/g, " ").slice(0, 255),
      total: request.amount.toFixed(2),
      lang: request.locale === "th" ? "TH" : "EN",
      cc: "00",
    },
  };
}
export function paymentCookieName(ref: string) {
  return `rws_payment_${ref}`;
}
export function paymentCookieValue(ref: string) {
  return createHmac("sha256", paymentConfig().secret)
    .update(`spa-payment:${ref}`)
    .digest("hex");
}
export function validPaymentCookie(ref: string, value: string | undefined) {
  if (!/^\d{12}$/.test(ref) || !value || !/^[a-f0-9]{64}$/.test(value))
    return false;
  return timingSafeEqual(
    Buffer.from(value, "hex"),
    Buffer.from(paymentCookieValue(ref), "hex"),
  );
}
export type PaySolutionsOrder = {
  ReferenceNo: string;
  OrderNo: string;
  MerchantID: string;
  Total: number | string;
  CurrencyCode: string;
  Status: string;
  StatusName?: string;
};
export async function inquirePayment(
  ref: string,
): Promise<PaySolutionsOrder[]> {
  if (!/^\d{12}$/.test(ref)) throw new Error("Invalid payment reference.");
  const { merchantId, secret, apiKey } = paymentConfig();
  const response = await fetch(INQUIRY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      merchantID: merchantId.slice(-5),
      merchantSecretKey: secret,
      apikey: apiKey,
    },
    body: JSON.stringify({
      merchantID: merchantId.slice(-5),
      orderNo: "X",
      refno: ref,
      productDetail: "QWERTY",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok)
    throw new Error("Payment verification is temporarily unavailable.");
  const raw = await response.text();
  if (!raw.trim()) return [];
  const data: unknown = JSON.parse(raw);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "ReferenceNo" in data)
    return [data as PaySolutionsOrder];
  throw new Error("Unexpected payment verification response.");
}
// Only the authenticated inquiry response can authorize a successful payment.
export function verifiedOrder(
  orders: PaySolutionsOrder[],
  ref: string,
  amount: number,
  merchantId: string,
) {
  return orders.find(
    (o) =>
      String(o.ReferenceNo) === ref &&
      (String(o.MerchantID) === merchantId ||
        String(o.MerchantID).padStart(5, "0") === merchantId.slice(-5)) &&
      ["CP", "Y"].includes(o.Status) &&
      ["00", "OO"].includes(String(o.CurrencyCode)) &&
      Number.isFinite(Number(o.Total)) &&
      Math.round(Number(o.Total) * 100) === Math.round(amount * 100) &&
      !!o.OrderNo,
  );
}

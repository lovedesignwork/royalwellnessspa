const MERCHANT_ID = process.env.PAYSOLUTIONS_MERCHANT_ID || '38736906';

const PROD_BASE_URL = 'https://royal-wellness-spa.vercel.app';
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.startsWith('http://localhost')
    ? process.env.NEXT_PUBLIC_BASE_URL
    : PROD_BASE_URL;

// Pay Solutions Simple Payment URL (Form POST method)
// Docs: https://api-docs.paysolutions.asia/docs/api/redirect/simple-payment
const PAYMENT_URL = 'https://www.thaiepay.com/epaylink/payment.aspx';

export interface PaySolutionsCheckoutRequest {
  /**
   * Reference number sent to Pay Solutions (must be numeric, max 12 digits)
   */
  refNo: string;
  /**
   * Original booking reference (used for app routing/debug). If omitted, falls back to refNo.
   */
  originalRef?: string;
  amount: number;
  description: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface PaySolutionsCheckoutResponse {
  success: boolean;
  paymentUrl?: string;
  formData?: Record<string, string>;
  refNo?: string;
  error?: string;
}

export interface PaySolutionsCallbackData {
  refNo: string;
  amount: string;
  status: string;
  transactionId?: string;
}

function normalizeKeys(body: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(body).reduce<Record<string, unknown>>((acc, key) => {
    acc[key.toLowerCase()] = body[key];
    return acc;
  }, {});
}

/**
 * Generate Pay Solutions payment form data for Simple Payment (Form POST) method
 * The frontend must create a form and POST it to the payment URL
 * Docs: https://api-docs.paysolutions.asia/docs/api/redirect/simple-payment
 */
export function generatePaymentFormData(
  request: PaySolutionsCheckoutRequest
): PaySolutionsCheckoutResponse {
  try {
    const numericRef = request.refNo.replace(/\D/g, '');
    if (!numericRef) {
      throw new Error('refNo must contain at least one digit');
    }

    const originalRef = request.originalRef || request.refNo;

    const returnUrl = new URL(`${BASE_URL}/payment/result`);
    returnUrl.searchParams.set('gateway', 'paysolutions');
    returnUrl.searchParams.set('refNo', originalRef);

    const postbackUrl = new URL(`${BASE_URL}/api/payment/paysolutions/callback`);
    postbackUrl.searchParams.set('bookingRef', originalRef);

    const formData: Record<string, string> = {
      // Required parameters
      merchantid: MERCHANT_ID,
      refno: numericRef,
      productdetail: request.description.substring(0, 255),
      total: request.amount.toFixed(2),
      lang: 'EN', // EN = English, TH = Thai
      cc: '00', // 00 = THB

      // Callback URLs
      returnurl: returnUrl.toString(),
      postbackurl: postbackUrl.toString(),
    };

    if (request.customerEmail) {
      formData.customeremail = request.customerEmail;
    }
    if (request.customerName) {
      formData.cc_name = request.customerName;
    }
    if (request.customerPhone) {
      formData.customerphone = request.customerPhone;
    }

    console.log('Pay Solutions Form Data generated:', {
      merchantId: MERCHANT_ID,
      refNo: numericRef,
      originalRef,
      amount: request.amount.toFixed(2),
      paymentUrl: PAYMENT_URL,
    });

    return {
      success: true,
      paymentUrl: PAYMENT_URL,
      formData,
      refNo: numericRef,
    };
  } catch (error) {
    console.error('Pay Solutions form data generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Parse and validate callback data from Pay Solutions
 */
export function parseCallbackData(body: Record<string, unknown>): PaySolutionsCallbackData | null {
  try {
    const normalized = normalizeKeys(body);

    const getValue = (...keys: string[]): string => {
      for (const key of keys) {
        const val = normalized[key];
        if (val !== undefined && val !== null) {
          return String(val);
        }
      }
      return '';
    };

    const refNo = getValue(
      'refno',
      'ref_no',
      'refnum',
      'reference',
      'reference_no',
      'invoiceno',
      'invoice',
      'order',
      'order_no'
    );
    const amount = getValue('total', 'amount', 'totalamount') || '0';
    const status = getValue('result', 'status', 'paymentstatus', 'state');
    const transactionId = getValue('apcode', 'transactionid', 'transaction');

    if (!refNo) {
      console.error('Missing refNo in callback data:', body);
      return null;
    }

    return {
      refNo,
      amount,
      status,
      transactionId,
    };
  } catch (error) {
    console.error('Error parsing callback data:', error);
    return null;
  }
}

/**
 * Check if payment status indicates success
 * Pay Solutions returns "00" for successful payments
 */
export function isPaymentSuccessful(status: string): boolean {
  if (status === undefined || status === null) {
    return false;
  }

  const normalized = String(status).trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  // Numeric success codes (00, 0000, 0, 1)
  if (/^0+$/.test(normalized) || normalized === '1') {
    return true;
  }

  const successStatuses = new Set([
    'success',
    'successful',
    'payment success',
    'payment successful',
    'completed',
    'approved',
    'paid',
    'settled',
    'captured',
  ]);

  return successStatuses.has(normalized);
}

import * as crypto from 'crypto';

const SANDBOX_API_URL = 'https://sandbox-pgw.2c2p.com/payment/4.3';
const PRODUCTION_API_URL = 'https://pgw.2c2p.com/payment/4.3';

const MERCHANT_ID = process.env.TWOC2P_MERCHANT_ID || '';
const SECRET_KEY = process.env.TWOC2P_SECRET_KEY || '';
const IS_SANDBOX = process.env.TWOC2P_SANDBOX === 'true';

const API_URL = IS_SANDBOX ? SANDBOX_API_URL : PRODUCTION_API_URL;

const PROD_BASE_URL = 'https://royalwellnessspaphuket.com';
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.startsWith('http://localhost')
    ? process.env.NEXT_PUBLIC_BASE_URL
    : PROD_BASE_URL;

export interface TwoC2PPaymentRequest {
  invoiceNo: string;
  amount: number;
  description: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  currencyCode?: string;
  locale?: string;
}

export interface TwoC2PPaymentTokenResponse {
  success: boolean;
  webPaymentUrl?: string;
  paymentToken?: string;
  invoiceNo?: string;
  respCode?: string;
  respDesc?: string;
  error?: string;
}

export interface TwoC2PCallbackData {
  invoiceNo: string;
  amount: string;
  respCode: string;
  respDesc: string;
  tranRef?: string;
  approvalCode?: string;
  cardNo?: string;
  paymentChannel?: string;
}

export interface TwoC2PInquiryResponse {
  success: boolean;
  invoiceNo?: string;
  amount?: string;
  respCode?: string;
  respDesc?: string;
  tranRef?: string;
  approvalCode?: string;
  error?: string;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateJWT(payload: Record<string, unknown>): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const encodedPayload = parts[1];
    let payloadStr = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    while (payloadStr.length % 4) {
      payloadStr += '=';
    }
    const decoded = Buffer.from(payloadStr, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

function verifyJWT(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return signature === expectedSignature;
  } catch {
    return false;
  }
}

export async function requestPaymentToken(
  request: TwoC2PPaymentRequest
): Promise<TwoC2PPaymentTokenResponse> {
  try {
    if (!MERCHANT_ID || !SECRET_KEY) {
      return {
        success: false,
        error: '2C2P credentials not configured',
      };
    }

    const frontendReturnUrl = `${BASE_URL}/payment/result?gateway=2c2p&invoiceNo=${request.invoiceNo}`;
    const backendReturnUrl = `${BASE_URL}/api/payment/2c2p/callback`;

    const amountStr = (request.amount * 100).toFixed(0).padStart(12, '0');

    const payload: Record<string, unknown> = {
      merchantID: MERCHANT_ID,
      invoiceNo: request.invoiceNo,
      description: request.description.substring(0, 255),
      amount: amountStr,
      currencyCode: request.currencyCode || 'THB',
      frontendReturnUrl,
      backendReturnUrl,
      locale: request.locale || 'en',
    };

    if (request.customerEmail) {
      payload.userDefined1 = request.customerEmail;
    }
    if (request.customerName) {
      payload.userDefined2 = request.customerName;
    }
    if (request.customerPhone) {
      payload.userDefined3 = request.customerPhone;
    }

    const jwtToken = generateJWT(payload);

    console.log('2C2P Payment Token Request:', {
      merchantID: MERCHANT_ID,
      invoiceNo: request.invoiceNo,
      amount: request.amount,
      apiUrl: `${API_URL}/paymentToken`,
    });

    const response = await fetch(`${API_URL}/paymentToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: jwtToken }),
    });

    const responseData = await response.json();
    
    if (!responseData.payload) {
      console.error('2C2P response missing payload:', responseData);
      return {
        success: false,
        error: 'Invalid response from 2C2P',
      };
    }

    const decodedResponse = decodeJWT(responseData.payload);
    
    if (!decodedResponse) {
      return {
        success: false,
        error: 'Failed to decode 2C2P response',
      };
    }

    console.log('2C2P Payment Token Response:', {
      respCode: decodedResponse.respCode,
      respDesc: decodedResponse.respDesc,
      hasWebPaymentUrl: !!decodedResponse.webPaymentUrl,
    });

    if (decodedResponse.respCode === '0000') {
      return {
        success: true,
        webPaymentUrl: decodedResponse.webPaymentUrl as string,
        paymentToken: decodedResponse.paymentToken as string,
        invoiceNo: request.invoiceNo,
        respCode: decodedResponse.respCode as string,
        respDesc: decodedResponse.respDesc as string,
      };
    }

    return {
      success: false,
      respCode: decodedResponse.respCode as string,
      respDesc: decodedResponse.respDesc as string,
      error: `2C2P Error: ${decodedResponse.respCode} - ${decodedResponse.respDesc}`,
    };
  } catch (error) {
    console.error('2C2P payment token error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function parseCallbackPayload(payload: string): TwoC2PCallbackData | null {
  try {
    if (!verifyJWT(payload)) {
      console.error('2C2P callback JWT verification failed');
      return null;
    }

    const decoded = decodeJWT(payload);
    if (!decoded) {
      return null;
    }

    return {
      invoiceNo: (decoded.invoiceNo as string) || '',
      amount: (decoded.amount as string) || '0',
      respCode: (decoded.respCode as string) || '',
      respDesc: (decoded.respDesc as string) || '',
      tranRef: decoded.tranRef as string | undefined,
      approvalCode: decoded.approvalCode as string | undefined,
      cardNo: decoded.cardNo as string | undefined,
      paymentChannel: decoded.paymentChannel as string | undefined,
    };
  } catch (error) {
    console.error('Error parsing 2C2P callback:', error);
    return null;
  }
}

export function isPaymentSuccessful(respCode: string): boolean {
  return respCode === '0000';
}

export async function inquirePayment(invoiceNo: string): Promise<TwoC2PInquiryResponse> {
  try {
    if (!MERCHANT_ID || !SECRET_KEY) {
      return {
        success: false,
        error: '2C2P credentials not configured',
      };
    }

    const payload = {
      merchantID: MERCHANT_ID,
      invoiceNo,
      locale: 'en',
    };

    const jwtToken = generateJWT(payload);

    const response = await fetch(`${API_URL}/paymentInquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: jwtToken }),
    });

    const responseData = await response.json();

    if (!responseData.payload) {
      return {
        success: false,
        error: 'Invalid response from 2C2P',
      };
    }

    const decodedResponse = decodeJWT(responseData.payload);

    if (!decodedResponse) {
      return {
        success: false,
        error: 'Failed to decode 2C2P response',
      };
    }

    return {
      success: decodedResponse.respCode === '0000',
      invoiceNo: decodedResponse.invoiceNo as string,
      amount: decodedResponse.amount as string,
      respCode: decodedResponse.respCode as string,
      respDesc: decodedResponse.respDesc as string,
      tranRef: decodedResponse.tranRef as string | undefined,
      approvalCode: decodedResponse.approvalCode as string | undefined,
    };
  } catch (error) {
    console.error('2C2P payment inquiry error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

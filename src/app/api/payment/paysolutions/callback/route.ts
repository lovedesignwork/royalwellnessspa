import { NextRequest, NextResponse } from 'next/server';
import { getRPCHSupabaseClient } from '@/lib/supabase-rpch';
import { parseCallbackData, isPaymentSuccessful } from '@/lib/paysolutions';

async function parseRequestBody(request: NextRequest): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type')?.toLowerCase() || '';

  if (contentType.includes('application/json')) {
    return request.json();
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const raw = await request.text();
    return Object.fromEntries(new URLSearchParams(raw));
  }

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const result: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      result[key] = typeof value === 'string' ? value : value.toString();
    });
    return result;
  }

  const rawBody = await request.text();
  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }
}

async function handleCallback(body: Record<string, unknown>, request: NextRequest) {
  try {
    const bookingRefOverride = request.nextUrl?.searchParams?.get('bookingRef') || null;

    console.log('Pay Solutions callback received:', JSON.stringify(body).substring(0, 500));
    if (bookingRefOverride) {
      console.log('Pay Solutions callback bookingRef override from query:', bookingRefOverride);
    }

    const callbackData = parseCallbackData(body);

    if (!callbackData) {
      console.error('Invalid callback data');
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 });
    }

    const { refNo, amount, status, transactionId } = callbackData;

    const supabase = getRPCHSupabaseClient();

    // Find the booking by reference or payment_ref
    let bookingQuery = supabase.from('spa_reservations').select('*').limit(1);

    if (bookingRefOverride) {
      bookingQuery = bookingQuery.eq('reference', bookingRefOverride);
    } else {
      bookingQuery = bookingQuery.or(`reference.eq.${refNo},payment_ref.eq.${refNo}`);
    }

    const { data: booking, error: findError } = await bookingQuery.single();

    if (findError || !booking) {
      console.error('Booking not found:', refNo);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const isSuccess = isPaymentSuccessful(status);

    console.log('Pay Solutions payment result:', {
      refNo,
      amount,
      status,
      isSuccess,
      transactionId,
    });

    const { error: updateError } = await supabase
      .from('spa_reservations')
      .update({
        status: isSuccess ? 'confirmed' : 'cancelled',
        payment_status: isSuccess ? 'paid' : 'failed',
        transaction_id: transactionId || refNo,
        payment_completed_at: isSuccess ? new Date().toISOString() : null,
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Pay Solutions callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await parseRequestBody(request);
  return handleCallback(body, request);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const body: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      body[key] = value;
    });

    return handleCallback(body, request);
  } catch (error) {
    console.error('Pay Solutions callback GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

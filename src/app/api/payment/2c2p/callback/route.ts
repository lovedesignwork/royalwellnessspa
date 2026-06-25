import { NextRequest, NextResponse } from 'next/server';
import { getRPCHSupabaseClient } from '@/lib/supabase-rpch';
import { parseCallbackPayload, isPaymentSuccessful } from '@/lib/2c2p';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('2C2P callback received:', JSON.stringify(body).substring(0, 500));

    if (!body.payload) {
      console.error('2C2P callback missing payload');
      return NextResponse.json({ error: 'Missing payload' }, { status: 400 });
    }

    const callbackData = parseCallbackPayload(body.payload);

    if (!callbackData) {
      console.error('Invalid 2C2P callback data');
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 });
    }

    const { invoiceNo, amount, respCode, respDesc, tranRef, approvalCode } = callbackData;

    console.log('2C2P callback parsed:', {
      invoiceNo,
      amount,
      respCode,
      respDesc,
      tranRef,
      approvalCode,
    });

    const supabase = getRPCHSupabaseClient();

    const { data: booking, error: findError } = await supabase
      .from('spa_reservations')
      .select('*')
      .eq('reference', invoiceNo)
      .limit(1)
      .single();

    if (findError || !booking) {
      console.error('Booking not found for invoice:', invoiceNo);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const isSuccess = isPaymentSuccessful(respCode);

    console.log('2C2P payment result:', {
      invoiceNo,
      respCode,
      respDesc,
      isSuccess,
      tranRef,
    });

    const { error: updateError } = await supabase
      .from('spa_reservations')
      .update({
        status: isSuccess ? 'confirmed' : 'cancelled',
        payment_status: isSuccess ? 'paid' : 'failed',
        transaction_id: tranRef || approvalCode || invoiceNo,
        payment_completed_at: isSuccess ? new Date().toISOString() : null,
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('2C2P callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const invoiceNo = searchParams.get('invoiceNo');
  
  if (!invoiceNo) {
    return NextResponse.json({ error: 'Missing invoiceNo' }, { status: 400 });
  }

  console.log('2C2P callback GET received for invoice:', invoiceNo);
  
  return NextResponse.json({ status: 'ok', invoiceNo });
}

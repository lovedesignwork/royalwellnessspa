import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const refno = formData.get('refno') as string;
    const status = formData.get('status') as string;
    const total = formData.get('total') as string;
    const transactionId = formData.get('apcode') as string;
    const receivedChecksum = formData.get('checksum') as string;

    const secretKey = process.env.PAYSOLUTION_SECRET_KEY;
    const merchantId = process.env.PAYSOLUTION_MERCHANT_ID;

    if (secretKey && merchantId) {
      const checksumString = `${merchantId}${refno}${total}${status}${secretKey}`;
      const calculatedChecksum = crypto.createHash('md5').update(checksumString).digest('hex');

      if (calculatedChecksum !== receivedChecksum) {
        console.error('Checksum mismatch');
        return NextResponse.json({ success: false, error: 'Invalid checksum' }, { status: 400 });
      }
    }

    const supabase = await createClient();

    const paymentStatus = status === '000' ? 'paid' : 'failed';
    const bookingStatus = status === '000' ? 'confirmed' : 'payment_failed';

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: paymentStatus,
        status: bookingStatus,
        transaction_id: transactionId,
        payment_completed_at: status === '000' ? new Date().toISOString() : null,
      })
      .eq('reference', refno);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

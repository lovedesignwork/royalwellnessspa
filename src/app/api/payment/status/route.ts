import { NextRequest, NextResponse } from 'next/server';
import { getRPCHSupabaseClient } from '@/lib/supabase-rpch';
import { isPaymentSuccessful } from '@/lib/paysolutions';

type BookingRecord = {
  id: string;
  reference: string | null;
  payment_ref: string | null;
  payment_status: string | null;
  status: string;
  amount: number | null;
  transaction_id: string | null;
  updated_at: string;
  created_at: string;
  guest_name: string;
  email: string;
  phone: string;
  service: string | null;
  date: string;
  time: string;
  special_requests: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const bookingRef = request.nextUrl.searchParams.get('bookingRef');
    const result = request.nextUrl.searchParams.get('result');
    const apCode =
      request.nextUrl.searchParams.get('apcode') || request.nextUrl.searchParams.get('Apcode');
    const verify = request.nextUrl.searchParams.get('verify') === 'true';

    if (!bookingRef) {
      return NextResponse.json({ error: 'Missing bookingRef' }, { status: 400 });
    }

    const supabase = getRPCHSupabaseClient();

    const normalizedRef = bookingRef.trim();
    const upperRef = normalizedRef.toUpperCase();
    const lowerRef = normalizedRef.toLowerCase();
    const numericRef = normalizedRef.replace(/\D/g, '');

    const searchVariants = [
      { column: 'reference', value: normalizedRef },
      { column: 'reference', value: upperRef },
      { column: 'reference', value: lowerRef },
      { column: 'payment_ref', value: normalizedRef },
      { column: 'payment_ref', value: numericRef },
    ];

    const tried = new Set<string>();
    let booking: BookingRecord | null = null;

    for (const variant of searchVariants) {
      const key = `${variant.column}:${variant.value}`;
      if (!variant.value || tried.has(key)) {
        continue;
      }
      tried.add(key);

      const { data, error } = await supabase
        .from('spa_reservations')
        .select('*')
        .eq(variant.column, variant.value)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Payment status lookup error:', error);
        continue;
      }

      if (data && data.length > 0) {
        booking = data[0] as unknown as BookingRecord;
        break;
      }
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // If verify=true and we have result parameter, verify and update the booking
    if (verify && result && booking.status === 'pending' && !booking.payment_status) {
      const isSuccess = isPaymentSuccessful(result);

      console.log('Payment verification from return URL:', {
        bookingRef: booking.reference,
        result,
        apCode,
        isSuccess,
      });

      if (isSuccess) {
        const { error: updateError } = await supabase
          .from('spa_reservations')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            transaction_id: apCode || booking.transaction_id,
            payment_completed_at: new Date().toISOString(),
          })
          .eq('id', booking.id);

        if (updateError) {
          console.error('Failed to update booking:', updateError);
        } else {
          booking.status = 'confirmed';
          booking.payment_status = 'paid';
          booking.transaction_id = apCode || booking.transaction_id;
        }
      }
    }

    return NextResponse.json({
      booking: {
        reference: booking.reference,
        payment_ref: booking.payment_ref,
        payment_status: booking.payment_status,
        status: booking.status,
        amount: booking.amount,
        transaction_id: booking.transaction_id,
        treatment_name: booking.service,
        booking_date: booking.date,
        booking_time: booking.time,
        customer_name: booking.guest_name,
        customer_email: booking.email,
        has_callback: Boolean(booking.payment_status),
        updated_at: booking.updated_at,
        created_at: booking.created_at,
      },
    });
  } catch (error) {
    console.error('Payment status check failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

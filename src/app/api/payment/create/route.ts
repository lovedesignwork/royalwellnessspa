import { NextRequest, NextResponse } from 'next/server';
import { requestPaymentToken } from '@/lib/2c2p';
import { getRPCHSupabaseClient } from '@/lib/supabase-rpch';
import { bookingAttemptId, validBookingAttempt } from '@/lib/booking-attempt';

interface TreatmentItem {
  guestName: string;
  treatmentName: string;
  duration?: string;
  price: number;
}

interface PaymentRequest {
  amount: number;
  treatments: TreatmentItem[];
  treatment?: string;
  date: string;
  time: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  notes: string;
  isHotelGuest?: boolean;
  discount?: number;
}

export async function POST(request: NextRequest) {
  try {
    const attemptKey = request.headers.get('Idempotency-Key');
    if (!validBookingAttempt(attemptKey)) {
      return NextResponse.json({ success: false, error: 'Please refresh the booking page before submitting.' }, { status: 400 });
    }
    const body: PaymentRequest = await request.json();
    const { amount, treatments, treatment, date, time, customer, notes, isHotelGuest } = body;

    const supabase = getRPCHSupabaseClient();

    let bookingRef = `RWS${Date.now()}${Math.floor(Math.random() * 10000)}`.slice(0, 20);

    const treatmentNames = treatments && treatments.length > 0
      ? treatments
          .map((t) => `${t.guestName}: ${t.treatmentName}${t.duration ? ` (${t.duration})` : ''}`)
          .join(' | ')
      : treatment || '';

    const bookingDetails = {
        guest_name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        phone: customer.phone,
        date: date,
        time: time,
        guests: treatments?.length || 1,
        service: treatmentNames,
        occasion: isHotelGuest ? 'Hotel Guest (10% Discount)' : null,
        special_requests: notes || null,
        amount: amount,
        status: 'pending',
        payment_status: 'pending',
      };
    const bookingId = bookingAttemptId(attemptKey, bookingDetails);
    let { data: booking, error: bookingError } = await supabase
      .from('spa_reservations')
      .insert({ ...bookingDetails, id: bookingId, reference: bookingRef, payment_ref: bookingRef })
      .select()
      .single();

    if (bookingError?.code === '23505') {
      // A retry must reuse the original row and invoice; never enqueue a second inquiry.
      const existing = await supabase.from('spa_reservations').select('*').eq('id', bookingId).single();
      booking = existing.data;
      bookingError = existing.error;
    }

    if (bookingError || !booking) {
      console.error('Booking error:', bookingError);
      return NextResponse.json(
        { success: false, error: `Failed to create booking: ${bookingError?.message || 'unknown error'}` },
        { status: 500 }
      );
    }

    bookingRef = booking.reference;
    if (booking.payment_status === 'paid' || booking.status === 'confirmed') {
      return NextResponse.json({ success: false, bookingRef, error: 'This booking is already confirmed. Please check your confirmation email.' }, { status: 409 });
    }

    const merchantId = process.env.TWOC2P_MERCHANT_ID;

    if (!merchantId) {
      return NextResponse.json({
        success: true,
        bookingRef,
        bookingId: booking.id,
        message: 'Booking created (payment gateway not configured)',
      });
    }

    const productDetail = treatments && treatments.length > 0
      ? `Royal Wellness Spa - ${treatments.length} treatment(s)`
      : `Royal Wellness Spa - ${treatment || 'Booking'}`;
    const customerName = `${customer.firstName} ${customer.lastName}`.trim();

    const result = await requestPaymentToken({
      invoiceNo: bookingRef,
      amount: Number(amount),
      description: productDetail,
      customerEmail: customer.email,
      customerName,
      customerPhone: customer.phone,
    });

    if (!result.success) {
      console.error('2C2P payment token request failed:', result.error);
      return NextResponse.json(
        { success: false, bookingRef, error: `Your request ${bookingRef} has been received, but online payment could not start. Retrying the same details will reuse this request.` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: result.webPaymentUrl,
      paymentToken: result.paymentToken,
      invoiceNo: result.invoiceNo,
      bookingRef,
      bookingId: booking.id,
      gateway: '2c2p',
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

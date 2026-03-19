import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

interface TreatmentItem {
  guestName: string;
  treatmentName: string;
  price: number;
}

interface PaymentRequest {
  amount: number;
  treatments: TreatmentItem[];
  treatment?: string; // Legacy single treatment
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
    const body: PaymentRequest = await request.json();
    const { amount, treatments, treatment, date, time, customer, notes, isHotelGuest, discount } = body;

    const supabase = await createClient();

    const bookingRef = `RWS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Format treatment names for storage
    const treatmentNames = treatments 
      ? treatments.map(t => `${t.guestName}: ${t.treatmentName}`).join(' | ')
      : treatment || '';

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        reference: bookingRef,
        treatment_name: treatmentNames,
        booking_date: date,
        booking_time: time,
        customer_first_name: customer.firstName,
        customer_last_name: customer.lastName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        notes: `${notes}${isHotelGuest ? ' [HOTEL GUEST - 10% DISCOUNT]' : ''}`,
        amount: amount,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking error:', bookingError);
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    const merchantId = process.env.PAYSOLUTION_MERCHANT_ID;
    const secretKey = process.env.PAYSOLUTION_SECRET_KEY;
    const apiUrl = process.env.PAYSOLUTION_API_URL || 'https://www.thaiepay.com/epaylink/payment.aspx';

    if (!merchantId || !secretKey) {
      return NextResponse.json({
        success: true,
        bookingRef,
        bookingId: booking.id,
        message: 'Booking created (payment gateway not configured)',
      });
    }

    const orderRef = bookingRef;
    const productDetail = treatments 
      ? `Royal Wellness Spa - ${treatments.length} treatment(s)`
      : `Royal Wellness Spa - ${treatment}`;
    const customerEmail = customer.email;
    const customerName = `${customer.firstName} ${customer.lastName}`;
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/payment/success?ref=${orderRef}`;
    const failUrl = `${baseUrl}/payment/fail?ref=${orderRef}`;
    const cancelUrl = `${baseUrl}/payment/cancel?ref=${orderRef}`;
    const backendUrl = `${baseUrl}/api/payment/webhook`;

    const checksumString = `${merchantId}${orderRef}${amount}${secretKey}`;
    const checksum = crypto.createHash('md5').update(checksumString).digest('hex');

    const paymentParams = new URLSearchParams({
      merchantid: merchantId,
      refno: orderRef,
      customeremail: customerEmail,
      productdetail: productDetail,
      total: amount.toString(),
      cc: 'THB',
      returnurl: successUrl,
      postbackurl: backendUrl,
      cancelurl: cancelUrl,
      failurl: failUrl,
      customername: customerName,
      checksum: checksum,
    });

    const paymentUrl = `${apiUrl}?${paymentParams.toString()}`;

    return NextResponse.json({
      success: true,
      paymentUrl,
      bookingRef,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

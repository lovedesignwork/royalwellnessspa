import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { generatePaymentFormData } from '@/lib/paysolutions';
import { insertSpaReservation } from '@/lib/supabase-rpch';

const MAX_REF_LENGTH = 12;

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

function buildNumericRef(source: string): string {
  const digits = (source || '').replace(/\D/g, '');
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0');

  const combined = `${digits}${timestamp}${random}`;
  return combined.slice(-MAX_REF_LENGTH);
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    const { amount, treatments, treatment, date, time, customer, notes, isHotelGuest } = body;

    const supabase = createAdminSupabaseClient();

    // Generate booking reference (alphanumeric, max 20 chars)
    const bookingRef = `RWS${Date.now()}${Math.floor(Math.random() * 10000)}`.slice(0, 20);

    // Format treatment names for storage
    const treatmentNames = treatments && treatments.length > 0
      ? treatments
          .map((t) => `${t.guestName}: ${t.treatmentName}${t.duration ? ` (${t.duration})` : ''}`)
          .join(' | ')
      : treatment || '';

    // Generate the numeric Pay Solutions ref
    const paySolutionsRef = buildNumericRef(bookingRef);

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
        notes: `${notes || ''}${isHotelGuest ? ' [HOTEL GUEST - 10% DISCOUNT]' : ''}`,
        amount,
        status: 'pending',
        payment_status: 'pending',
        payment_ref: paySolutionsRef,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error('Booking error:', bookingError);
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Also insert into RPCH admin dashboard (spa_reservations table)
    const rpchResult = await insertSpaReservation({
      guest_name: `${customer.firstName} ${customer.lastName}`.trim(),
      email: customer.email,
      phone: customer.phone,
      date: date,
      time: time,
      guests: treatments?.length || 1,
      service: treatmentNames,
      occasion: isHotelGuest ? 'Hotel Guest (10% Discount)' : undefined,
      special_requests: notes || undefined,
    });

    if (!rpchResult.ok) {
      console.error('RPCH reservation insert failed:', rpchResult.error);
      // Continue anyway - local booking succeeded, admin will see it in local DB
    }

    const merchantId = process.env.PAYSOLUTIONS_MERCHANT_ID;

    if (!merchantId) {
      // Fallback: confirm booking without payment (for testing)
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

    // Generate Pay Solutions form data
    const result = generatePaymentFormData({
      refNo: paySolutionsRef,
      originalRef: bookingRef,
      amount: Number(amount),
      description: productDetail,
      customerEmail: customer.email,
      customerName,
      customerPhone: customer.phone,
    });

    if (!result.success) {
      console.error('Pay Solutions form data generation failure:', result.error);
      return NextResponse.json(
        { success: false, error: `Payment initialization failed: ${result.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: result.paymentUrl,
      formData: result.formData,
      refNo: result.refNo,
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

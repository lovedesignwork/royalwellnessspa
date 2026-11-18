import { NextRequest, NextResponse } from "next/server";
import { paymentCookieName, validPaymentCookie } from "@/lib/paysolutions";
import { reconcilePayment } from "@/lib/payment-booking";
export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("bookingRef") || "";
  if (!/^\d{12}$/.test(ref))
    return NextResponse.json(
      { error: "Invalid payment reference." },
      { status: 400 },
    );
  try {
    if (
      !validPaymentCookie(
        ref,
        request.cookies.get(paymentCookieName(ref))?.value,
      )
    )
      return NextResponse.json(
        {
          error:
            "Open the payment result in the browser used to make your booking.",
        },
        { status: 403 },
      );
    // Return URL result/status parameters are untrusted and never change payment state.
    const booking = await reconcilePayment(ref);
    if (!booking)
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    return NextResponse.json(
      {
        booking: {
          reference: booking.reference,
          payment_status: booking.payment_status,
          status: booking.status,
          amount: booking.amount,
          transaction_id: booking.transaction_id,
          treatment_name: booking.service,
          booking_date: booking.date,
          booking_time: booking.time,
          customer_name: booking.guest_name,
          customer_email: booking.email,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Payment verification is temporarily unavailable." },
      { status: 503 },
    );
  }
}

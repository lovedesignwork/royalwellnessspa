import { randomInt, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  paymentCookieName,
  paymentCookieValue,
} from "@/lib/paysolutions";
import { createHostedPayment, hostedPaymentConfig } from "@/lib/paysolutions-hosted";
import { paymentDatabase } from "@/lib/payment-booking";
import { priceTreatments } from "@/lib/payment-pricing";
export async function POST(request: NextRequest) {
  try {
    if (process.env.PAYSOLUTIONS_ENABLED !== 'true') {
      return NextResponse.json({ success: false, error: 'Online payment is being set up. Please contact Royal Wellness Spa on 090-596-9666 to arrange your booking.' }, { status: 503 });
    }
    hostedPaymentConfig();
    const body = await request.json();
    const { customer, date, time } = body;
    if (
      !customer ||
      typeof customer.firstName !== "string" ||
      !customer.firstName.trim() ||
      typeof customer.lastName !== "string" ||
      typeof customer.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
      customer.email.length > 50 ||
      typeof customer.phone !== "string" ||
      !customer.phone.trim() ||
      customer.phone.length > 50 ||
      customer.firstName.length > 100 ||
      customer.lastName.length > 100
    )
      return NextResponse.json(
        { error: "Enter valid guest contact details." },
        { status: 400 },
      );
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Bangkok",
    });
    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date ||
      date < today ||
      typeof time !== "string" ||
      !/^(1[0-9]|20):00$/.test(time)
    )
      return NextResponse.json(
        { error: "Choose a valid date and time." },
        { status: 400 },
      );
    let priced;
    try {
      priced = priceTreatments(body.treatments, body.isHotelGuest === true);
    } catch {
      return NextResponse.json(
        { error: "Check your treatment and duration selections." },
        { status: 400 },
      );
    }
    if (
      typeof body.amount !== "number" ||
      Math.round(body.amount * 100) !== Math.round(priced.amount * 100)
    )
      return NextResponse.json(
        {
          error:
            "Your treatment price has changed. Please refresh and select your treatments again.",
        },
        { status: 400 },
      );
    const sb = paymentDatabase();
    // 12 digits, allocated with a database unique index. Never truncate a booking ID.
    let booking;
    let ref = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      ref = String(randomInt(100000000000, 1000000000000));
      const { data, error } = await sb
        .from("spa_reservations")
        .insert({
          reference: `RWS${randomUUID().replace(/-/g, "").slice(0, 17).toUpperCase()}`,
          payment_ref: ref,
          guest_name: `${customer.firstName} ${customer.lastName}`
            .trim()
            .replace(/[<>&"']/g, ""),
          email: customer.email,
          phone: customer.phone,
          date,
          time,
          guests: priced.guests,
          service: priced.service,
          occasion:
            body.isHotelGuest === true ? "Hotel Guest (10% Discount)" : null,
          special_requests:
            typeof body.notes === "string"
              ? body.notes.replace(/[<>&"']/g, "").slice(0, 3000)
              : null,
          amount: priced.amount,
          status: "pending",
          payment_status: "pending",
        })
        .select("id,reference")
        .single();
      if (!error) {
        booking = data;
        break;
      }
      if (error.code !== "23505") throw new Error("Unable to create booking.");
    }
    if (!booking) throw new Error("Unable to allocate payment reference.");
    const checkout = await createHostedPayment({
      refNo: ref,
      amount: priced.amount,
      description: `Royal Wellness Spa - ${body.treatments.length} treatment(s)`,
      customerEmail: customer.email,
      locale: body.locale,
    });
    const response = NextResponse.json({
      success: true,
      ...checkout,
      bookingRef: booking.reference,
      refNo: ref,
      gateway: "paysolutions",
    });
    response.cookies.set(paymentCookieName(ref), paymentCookieValue(ref), {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });
    return response;
  } catch (error) {
    console.error(
      "Payment initialization failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      {
        success: false,
        error: "Unable to start payment. Please try again or contact the spa.",
      },
      { status: 503 },
    );
  }
}

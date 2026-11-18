import { NextRequest, NextResponse } from "next/server";
import { reconcilePayment } from "@/lib/payment-booking";
async function callback(request: NextRequest) {
  try {
    let values: Record<string, unknown>;
    if (request.method === "GET")
      values = Object.fromEntries(request.nextUrl.searchParams);
    else if (request.headers.get("content-type")?.includes("application/json"))
      values = await request.json();
    else values = Object.fromEntries(await request.formData());
    const normalized = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k.toLowerCase(), String(v)]),
    );
    const ref =
      normalized.refno ||
      normalized.referenceno ||
      normalized.reference_no ||
      "";
    if (!/^\d{12}$/.test(ref))
      return NextResponse.json(
        { error: "Invalid payment reference." },
        { status: 400 },
      );
    // Callback fields and browser query strings are hints only. Independently inquire
    // using server credentials, then match merchant, reference, THB amount and CP state.
    const booking = await reconcilePayment(ref);
    if (!booking)
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    if (booking.payment_status !== "paid")
      return NextResponse.json({ status: "pending" }, { status: 503 });
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json(
      { error: "Unable to verify payment. Please retry." },
      { status: 503 },
    );
  }
}
export const POST = callback;
export const GET = callback;

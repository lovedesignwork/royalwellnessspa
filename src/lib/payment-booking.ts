import "server-only";
import { createClient } from "@supabase/supabase-js";
import { RPCH_SUPABASE_URL } from "./supabase-rpch";
import { inquirePayment, paymentConfig, verifiedOrder } from "./paysolutions";
import { sendBookingConfirmationEmails } from "./email";
export function paymentDatabase() {
  const key = process.env.RPCH_SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Payment storage is not configured.");
  return createClient(RPCH_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export async function reconcilePayment(ref: string) {
  const sb = paymentDatabase();
  const { data: booking, error } = await sb
    .from("spa_reservations")
    .select("*")
    .eq("payment_ref", ref)
    .maybeSingle();
  if (error) throw new Error("Unable to load payment.");
  if (!booking) return null;
  if (booking.payment_status === "paid") return booking;
  const order = verifiedOrder(
    await inquirePayment(ref),
    ref,
    Number(booking.amount),
    paymentConfig().merchantId,
  );
  if (!order) return booking; // An empty inquiry is not a failure: the guest may still be paying.
  const { data: updated, error: updateError } = await sb
    .from("spa_reservations")
    .update({
      status: "confirmed",
      payment_status: "paid",
      transaction_id: String(order.OrderNo),
      payment_completed_at: new Date().toISOString(),
    })
    .eq("id", booking.id)
    .eq("payment_status", "pending")
    .select("*")
    .maybeSingle();
  if (updateError) throw new Error("Unable to record verified payment.");
  if (updated) {
    await sendBookingConfirmationEmails({
      reference: updated.reference,
      guestName: updated.guest_name,
      email: updated.email,
      phone: updated.phone,
      date: updated.date,
      time: updated.time,
      guests: updated.guests,
      service: updated.service,
      amount: Number(updated.amount),
      occasion: updated.occasion,
      specialRequests: updated.special_requests,
      transactionId: updated.transaction_id,
    });
    return updated;
  }
  const { data: current, error: readError } = await sb
    .from("spa_reservations")
    .select("*")
    .eq("id", booking.id)
    .single();
  if (readError) throw new Error("Unable to load verified payment.");
  return current;
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Royal Wellness Spa uses the shared Royal Phuket City Hotel Supabase project.
 * All reservations go to `spa_reservations` and all contact messages
 * go to `spa_contact_submissions`. Both tables are managed from the
 * RPCH admin dashboard in the Royal Wellness Spa section.
 *
 * We use the anon key here (not service role). Both tables have RLS
 * policies that allow public INSERTs but no reads — the admin dashboard
 * reads via the service role client.
 */

const RPCH_SUPABASE_URL = "https://crhzxvbubvyachauomlx.supabase.co";
const RPCH_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyaHp4dmJ1YnZ5YWNoYXVvbWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDk0MjQsImV4cCI6MjA4OTQyNTQyNH0.k8jEtxz3ixWbMvG3507ImJZ5PRizktOO0wossbPZSQk";

let client: SupabaseClient | null = null;

export function getRPCHSupabaseClient(): SupabaseClient {
  if (client) return client;

  client = createClient(RPCH_SUPABASE_URL, RPCH_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

// ----------------------------------------------------------------------------
// Reservations (Spa Bookings)
// ----------------------------------------------------------------------------

export type SpaReservationInsert = {
  guest_name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  service?: string; // Treatment name(s)
  occasion?: string;
  seating_preference?: string; // Room preference
  country?: string;
  special_requests?: string;
};

export async function insertSpaReservation(
  row: SpaReservationInsert
): Promise<{ ok: boolean; error?: string }> {
  const sb = getRPCHSupabaseClient();

  const { error } = await sb.from("spa_reservations").insert({
    guest_name: row.guest_name,
    email: row.email,
    phone: row.phone,
    date: row.date,
    time: row.time,
    guests: row.guests,
    service: row.service ?? null,
    occasion: row.occasion ?? null,
    seating_preference: row.seating_preference ?? null,
    country: row.country ?? null,
    special_requests: row.special_requests ?? null,
    status: "new",
  });

  if (error) {
    console.error("[spa] Reservation insert failed:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

// ----------------------------------------------------------------------------
// Contact submissions
// ----------------------------------------------------------------------------

export type SpaContactInsert = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string; // general | spa | reservation
  inquiry_type_label?: string;
  country?: string;
};

export async function insertSpaContact(
  row: SpaContactInsert
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const sb = getRPCHSupabaseClient();

  const { data, error } = await sb.from("spa_contact_submissions").insert({
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    subject: row.subject ?? null,
    message: row.message,
    inquiry_type: row.inquiry_type ?? "general",
    inquiry_type_label: row.inquiry_type_label ?? null,
    country: row.country ?? null,
    status: "new",
  }).select("id").single();

  if (error) {
    console.error("[spa] Contact insert failed:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data?.id };
}

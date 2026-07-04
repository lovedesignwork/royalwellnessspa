# Royal Phuket City Hotel Admin Dashboard Integration Guide

This guide explains how to integrate a new website (e.g., a restaurant, spa, or activity site) so that its **bookings/reservations** and **contact inquiries** appear in the centralized RPCH admin dashboard at `https://royalphuketcity.com/admin`.

It follows the same pattern that was implemented for **Yan Long** and **Royal Wellness Spa**.

---

## Architecture Overview

```
┌─────────────────────────┐         ┌─────────────────────────┐
│  Your New Website       │         │  RPCH Admin Dashboard   │
│  (e.g. /book, /contact) │         │  (royalphuketcity.com)  │
└───────────┬─────────────┘         └───────────┬─────────────┘
            │                                   │
            │ INSERT (anon key)                 │ SELECT/UPDATE/DELETE
            │                                   │ (service_role key)
            ▼                                   ▼
┌──────────────────────────────────────────────────────────────┐
│  Shared Supabase Project                                      │
│  URL: https://crhzxvbubvyachauomlx.supabase.co                │
│  Project ID: crhzxvbubvyachauomlx                             │
│                                                                │
│  Tables:                                                       │
│  - {brand}_reservations          (bookings)                   │
│  - {brand}_contact_submissions   (inquiries)                  │
└──────────────────────────────────────────────────────────────┘
```

Replace `{brand}` with your project slug (e.g., `spa`, `yanlong`, `restaurant`, etc.)

---

## Part 1: Database Setup in Shared Supabase

### Project Identification
- **Supabase Project ID:** `crhzxvbubvyachauomlx`
- **URL:** `https://crhzxvbubvyachauomlx.supabase.co`
- **Anon Key:** Get from RPCH project owner
- **Service Role Key:** Stored only in RPCH admin dashboard Vercel env vars

### Step 1.1: Create Reservations Table

```sql
CREATE TABLE IF NOT EXISTS public.{brand}_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL,
  service TEXT,
  occasion TEXT,
  seating_preference TEXT,
  country TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT
);
```

### Step 1.2: Create Contact Submissions Table

```sql
CREATE TABLE IF NOT EXISTS public.{brand}_contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT NOT NULL DEFAULT 'general',
  inquiry_type_label TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT
);
```

### Step 1.3: Enable RLS

```sql
ALTER TABLE public.{brand}_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.{brand}_contact_submissions ENABLE ROW LEVEL SECURITY;
```

### Step 1.4: Create RLS Policies

```sql
-- Allow public website to INSERT bookings
CREATE POLICY "{brand}_anyone_create_reservation" ON public.{brand}_reservations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow payment callbacks to UPDATE bookings (for status changes after payment)
CREATE POLICY "{brand}_anon_update_for_payment" ON public.{brand}_reservations
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Allow admin dashboard (authenticated) to read/update
CREATE POLICY "{brand}_authenticated_read_reservations" ON public.{brand}_reservations
  FOR SELECT TO authenticated USING (true);

-- Allow public website to INSERT contact inquiries
CREATE POLICY "{brand}_anyone_submit_contact" ON public.{brand}_contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow admin dashboard to read/update inquiries
CREATE POLICY "{brand}_authenticated_read_submissions" ON public.{brand}_contact_submissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "{brand}_authenticated_update_submissions" ON public.{brand}_contact_submissions
  FOR UPDATE TO authenticated USING (true);
```

### Step 1.5: ⚠️ CRITICAL — Grant Table Privileges

**This step is often missed and causes silent failures.** Even with RLS policies, the underlying table privileges must be granted. The `service_role` does NOT automatically have access to new tables.

```sql
-- Reservations table grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.{brand}_reservations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.{brand}_reservations TO authenticated;
GRANT INSERT, UPDATE ON public.{brand}_reservations TO anon;

-- Contact submissions table grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.{brand}_contact_submissions TO service_role;
GRANT SELECT, UPDATE, DELETE ON public.{brand}_contact_submissions TO authenticated;
GRANT INSERT ON public.{brand}_contact_submissions TO anon;
```

### Step 1.6: Verify Grants

After running the migrations, verify with:

```sql
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = '{brand}_contact_submissions'
  AND grantee IN ('service_role', 'authenticated', 'anon')
ORDER BY grantee, privilege_type;
```

`service_role` MUST have: `SELECT, INSERT, UPDATE, DELETE`. If not, the admin dashboard will return empty results with silent errors in Vercel logs.

---

## Part 2: Your New Website Code

### Step 2.1: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 2.2: Create Supabase Helper

Create `src/lib/supabase-rpch.ts`:

```typescript
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const RPCH_SUPABASE_URL = "https://crhzxvbubvyachauomlx.supabase.co";
const RPCH_SUPABASE_ANON_KEY = "<ANON_KEY_FROM_RPCH_PROJECT>";

let client: SupabaseClient | null = null;

export function getRPCHSupabaseClient(): SupabaseClient {
  if (client) return client;
  client = createClient(RPCH_SUPABASE_URL, RPCH_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

// ------------------ Reservations ------------------

export type ReservationInsert = {
  guest_name: string;
  email: string;
  phone: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  guests: number;
  service?: string;
  occasion?: string;
  seating_preference?: string;
  country?: string;
  special_requests?: string;
};

export async function insertReservation(
  row: ReservationInsert
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const sb = getRPCHSupabaseClient();
  const { data, error } = await sb
    .from("{brand}_reservations")
    .insert({ ...row, status: "new" })
    .select("id")
    .single();

  if (error) {
    console.error("[{brand}] Reservation insert failed:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data?.id };
}

// ------------------ Contact Submissions ------------------

export type ContactInsert = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
  inquiry_type_label?: string;
  country?: string;
};

export async function insertContact(
  row: ContactInsert
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const sb = getRPCHSupabaseClient();
  const { data, error } = await sb
    .from("{brand}_contact_submissions")
    .insert({
      ...row,
      inquiry_type: row.inquiry_type ?? "general",
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[{brand}] Contact insert failed:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data?.id };
}
```

### Step 2.3: Use in API Routes

**Contact form** — `src/app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { insertContact } from "@/lib/supabase-rpch";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await insertContact({
    name: body.name,
    email: body.email,
    phone: body.phone,
    subject: body.subject,
    message: body.message,
    inquiry_type: body.inquiryType ?? "general",
    inquiry_type_label: body.subject,
    country: body.country,
  });

  if (!result.ok) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    referenceNumber: `REF-${result.id?.slice(0, 8).toUpperCase()}`,
  });
}
```

**Booking** — `src/app/api/booking/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { insertReservation } from "@/lib/supabase-rpch";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await insertReservation({
    guest_name: body.name,
    email: body.email,
    phone: body.phone,
    date: body.date,
    time: body.time,
    guests: body.guests,
    service: body.service,
    special_requests: body.specialRequests,
  });

  if (!result.ok) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }
  return NextResponse.json({ success: true, id: result.id });
}
```

### Step 2.4: Email Notifications via Resend (Optional but Recommended)

```bash
npm install resend
```

Add to `.env.local` and Vercel env vars:
```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXX
```

In your contact API:
```typescript
if (process.env.RESEND_API_KEY) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Your Brand <marketing@royalphuketcity.com>",
    to: ["marketing@royalphuketcity.com", "your-team@yourdomain.com"],
    replyTo: body.email,
    subject: `New Inquiry: ${body.subject}`,
    html: `<html>...</html>`,
  });
}
```

---

## Part 3: RPCH Admin Dashboard Setup

**Repo:** `D:\SAAS-PROJECT\ROYAL PHUKET CITY\Royal Phuket City Hotel Website`

### Step 3.1: Create API Routes

Create `src/app/api/admin/{brand}/reservations/route.ts` and `src/app/api/admin/{brand}/inquiries/route.ts`.

Copy from `src/app/api/admin/yanlong/inquiries/route.ts` and `reservations/route.ts` as templates. Only change the table name (e.g., `yanlong_contact_submissions` → `{brand}_contact_submissions`).

The routes use `getSupabaseClient()` from `@/lib/supabase` which is already configured with `SUPABASE_SERVICE_ROLE_KEY`.

### Step 3.2: Create Admin Pages

Create `src/app/admin/{brand}/reservations/page.tsx` and `src/app/admin/{brand}/inquiries/page.tsx`.

Copy from the existing `src/app/admin/spa/inquiries/page.tsx` and `src/app/admin/spa/reservations/page.tsx` as templates. Adjust only:
- The API endpoint paths
- The page title/copy
- The accent color (use a unique hex for each brand)

### Step 3.3: Add to Sidebar

Edit `src/app/admin/layout.tsx` and add a new section:

```tsx
{/* Your New Brand */}
<SidebarSection title="YOUR BRAND" accent="#YOUR_HEX">
  <SidebarLink href="/admin/{brand}/reservations" icon={<CalendarIcon />}>
    Reservations
  </SidebarLink>
  <SidebarLink href="/admin/{brand}/inquiries" icon={<MessageIcon />}>
    Inquiries
  </SidebarLink>
</SidebarSection>
```

### Step 3.4: Deploy

```bash
git add -A
git commit -m "feat: add {brand} section to admin dashboard"
git push origin main
```

Vercel auto-deploys on push.

---

## Part 4: Verification Checklist

After setup, verify everything works:

- [ ] **Test contact form** on the website → submit → check Supabase `{brand}_contact_submissions` has a row
- [ ] **Test booking form** on the website → submit → check Supabase `{brand}_reservations` has a row
- [ ] **Check admin dashboard** → inquiry should appear at `/admin/{brand}/inquiries`
- [ ] **Check admin dashboard** → booking should appear at `/admin/{brand}/reservations`
- [ ] **Check Vercel logs** for RPCH project — no `permission denied` or `PGRST` errors
- [ ] **Check email** — admin and customer should receive notification (if Resend is configured)

---

## Common Pitfalls

### 1. Admin Dashboard Shows "No Records" but Data Exists in DB
**Cause:** `service_role` missing GRANT privileges on the new table.
**Fix:** Run Step 1.5 (GRANT statements).

### 2. Contact/Booking Submission Returns "permission denied"
**Cause:** `anon` role missing INSERT grant or RLS policy.
**Fix:** Verify Step 1.4 (RLS policies) and Step 1.5 (anon grants).

### 3. Admin API Returns 500 with `relation does not exist`
**Cause:** Table name typo in admin API route.
**Fix:** Double-check table name matches between migration and API route.

### 4. Email Not Sending
**Cause:** `RESEND_API_KEY` not set in Vercel production environment.
**Fix:** Run `vercel env add RESEND_API_KEY production`.

### 5. RLS Blocking Reads Even With Service Role
**Cause:** `service_role` actually does respect SOME RLS policies if you query with the wrong client.
**Fix:** Use `SUPABASE_SERVICE_ROLE_KEY` (NOT anon key) on the admin side. Service role bypasses RLS only when used via the service role JWT.

---

## Reference: Existing Integrations

Look at these working examples in the codebase:

| Brand | Website Repo | Tables | Admin Routes |
|-------|--------------|--------|--------------|
| Yan Long | `yanlong-restaurant` | `yanlong_reservations`, `yanlong_contact_submissions` | `/admin/yanlong/*` |
| Royal Wellness Spa | `royalwellnessspa` | `spa_reservations`, `spa_contact_submissions` | `/admin/spa/*` |

Copy the structure of either of these for your new integration.

---

## Tools You'll Need

- **Supabase MCP** — for running migrations on the shared DB (project ID: `crhzxvbubvyachauomlx`)
- **Vercel MCP** — for checking deployment logs (project: `royalphuketcity-hotel`)
- **GitHub** — both your new site repo AND the RPCH admin dashboard repo need commits

---

## Summary

The integration works because:

1. **Your website** uses the **anon key** to INSERT into shared Supabase tables.
2. **RLS policies** allow public inserts but block public reads.
3. **The RPCH admin dashboard** uses the **service_role key** to read all data and manage it.
4. **GRANT statements** at the table level give each role the SQL privileges it needs (separate from RLS).
5. **Resend** sends instant email notifications independent of database storage.

Both layers (RLS + table grants) must be correct for the integration to work.

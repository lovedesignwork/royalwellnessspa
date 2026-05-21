import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminDashboard from '@/components/admin/AdminDashboard';

interface SpaReservationRow {
  id: string;
  reference: string | null;
  service: string | null;
  date: string;
  time: string;
  guest_name: string;
  email: string;
  phone: string;
  special_requests: string | null;
  amount: number | null;
  status: string;
  payment_status: string | null;
  created_at: string;
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/xadmin/login');
  }

  const { data: rawBookings } = await supabase
    .from('spa_reservations')
    .select('*')
    .order('created_at', { ascending: false });

  // Map spa_reservations fields to the AdminDashboard's Booking interface
  const bookings = (rawBookings || []).map((b: SpaReservationRow) => {
    const nameParts = (b.guest_name || '').split(' ');
    return {
      id: b.id,
      reference: b.reference || b.id,
      treatment_name: b.service || '',
      booking_date: b.date,
      booking_time: b.time,
      customer_first_name: nameParts[0] || '',
      customer_last_name: nameParts.slice(1).join(' '),
      customer_email: b.email,
      customer_phone: b.phone,
      notes: b.special_requests || '',
      amount: Number(b.amount) || 0,
      status: b.status,
      payment_status: b.payment_status || 'pending',
      created_at: b.created_at,
    };
  });

  // Compute stats client-side from the bookings list
  const today = new Date().toISOString().slice(0, 10);
  const stats = {
    total_bookings: bookings.length,
    confirmed_bookings: bookings.filter(
      (b) => b.status === 'confirmed' || b.status === 'completed' || b.status === 'replied'
    ).length,
    pending_bookings: bookings.filter(
      (b) => b.status === 'pending' || b.status === 'new'
    ).length,
    total_revenue: bookings
      .filter((b) => b.payment_status === 'paid')
      .reduce((sum, b) => sum + (b.amount || 0), 0),
    today_bookings: bookings.filter((b) => b.booking_date === today).length,
  };

  return <AdminDashboard user={user} bookings={bookings} stats={stats} />;
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  LogOut,
  Search,
  ChevronDown,
  Check,
  X,
  Clock,
  TrendingUp,
  DollarSign,
  Eye,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Booking {
  id: string;
  reference: string;
  treatment_name: string;
  booking_date: string;
  booking_time: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
  amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Stats {
  total_bookings: number;
  confirmed_bookings: number;
  pending_bookings: number;
  total_revenue: number;
  today_bookings: number;
}

interface AdminDashboardProps {
  user: User;
  bookings: Booking[];
  stats: Stats | null;
}

type TabType = 'overview' | 'bookings';

export default function AdminDashboard({ user, bookings, stats }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/xadmin/login');
    router.refresh();
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const supabase = createClient();
    await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
    router.refresh();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700',
      payment_failed: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-charcoal text-white">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-display text-xl">ROYAL WELLNESS</h1>
          <p className="text-gold text-xs tracking-[0.2em]">ADMIN</p>
        </div>

        <nav className="p-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-body transition-colors ${
              activeTab === 'overview' ? 'bg-gold text-white' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-body transition-colors ${
              activeTab === 'bookings' ? 'bg-gold text-white' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Bookings
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user.email}</p>
              <p className="text-xs text-white/50">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        {activeTab === 'overview' && (
          <>
            <div className="mb-8">
              <h2 className="font-display text-3xl text-charcoal">Dashboard</h2>
              <p className="font-body text-sm text-charcoal/60">
                Welcome back! Here is your spa overview.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-gold" />
                  <span className="text-xs text-green-600 font-body">
                    <TrendingUp className="w-3 h-3 inline" /> Today
                  </span>
                </div>
                <p className="font-display text-3xl text-charcoal">
                  {stats?.today_bookings || 0}
                </p>
                <p className="font-body text-sm text-charcoal/60">
                  Today Bookings
                </p>
              </div>

              <div className="bg-white p-6 rounded-sm shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-gold" />
                </div>
                <p className="font-display text-3xl text-charcoal">
                  {stats?.total_bookings || 0}
                </p>
                <p className="font-body text-sm text-charcoal/60">
                  Total Bookings
                </p>
              </div>

              <div className="bg-white p-6 rounded-sm shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="font-display text-3xl text-charcoal">
                  {stats?.pending_bookings || 0}
                </p>
                <p className="font-body text-sm text-charcoal/60">
                  Pending
                </p>
              </div>

              <div className="bg-white p-6 rounded-sm shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <p className="font-display text-3xl text-charcoal">
                  ฿{(stats?.total_revenue || 0).toLocaleString()}
                </p>
                <p className="font-body text-sm text-charcoal/60">
                  Total Revenue
                </p>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-6">
              <h3 className="font-display text-xl text-charcoal mb-4">
                Recent Bookings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-body text-xs text-charcoal/60 uppercase">
                        Reference
                      </th>
                      <th className="text-left py-3 px-4 font-body text-xs text-charcoal/60 uppercase">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-body text-xs text-charcoal/60 uppercase">
                        Treatment
                      </th>
                      <th className="text-left py-3 px-4 font-body text-xs text-charcoal/60 uppercase">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-body text-xs text-charcoal/60 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 font-body text-sm">
                          {booking.reference}
                        </td>
                        <td className="py-3 px-4 font-body text-sm">
                          {booking.customer_first_name} {booking.customer_last_name}
                        </td>
                        <td className="py-3 px-4 font-body text-sm text-charcoal/70">
                          {booking.treatment_name}
                        </td>
                        <td className="py-3 px-4 font-body text-sm text-charcoal/70">
                          {format(new Date(booking.booking_date), 'MMM d, yyyy')} at {booking.booking_time}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs font-body rounded-sm ${getStatusBadge(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-display text-3xl text-charcoal">Bookings</h2>
                <p className="font-body text-sm text-charcoal/60">
                  Manage all spa bookings
                </p>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                  <input
                    type="text"
                    placeholder="Search by reference, name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 font-body text-sm"
                  />
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-200 font-body text-sm bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-4 px-6 font-body text-xs text-charcoal/60 uppercase">
                      Reference
                    </th>
                    <th className="text-left py-4 px-6 font-body text-xs text-charcoal/60 uppercase">
                      Customer
                    </th>
                    <th className="text-left py-4 px-6 font-body text-xs text-charcoal/60 uppercase">
                      Treatment
                    </th>
                    <th className="text-left py-4 px-6 font-body text-xs text-charcoal/60 uppercase">
                      Date & Time
                    </th>
                    <th className="text-left py-4 px-6 font-body text-xs text-charcoal/60 uppercase">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 font-body text-xs text-charcoal/60 uppercase">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-body text-xs text-charcoal/60 uppercase">
                      Payment
                    </th>
                    <th className="text-left py-4 px-6 font-body text-xs text-charcoal/60 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-6 font-body text-sm font-medium">
                        {booking.reference}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-body text-sm">
                          {booking.customer_first_name} {booking.customer_last_name}
                        </p>
                        <p className="font-body text-xs text-charcoal/50">
                          {booking.customer_email}
                        </p>
                      </td>
                      <td className="py-4 px-6 font-body text-sm text-charcoal/70">
                        {booking.treatment_name}
                      </td>
                      <td className="py-4 px-6 font-body text-sm text-charcoal/70">
                        {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                        <br />
                        <span className="text-xs">{booking.booking_time}</span>
                      </td>
                      <td className="py-4 px-6 font-body text-sm">
                        ฿{booking.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 text-xs font-body rounded-sm ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 text-xs font-body rounded-sm ${getPaymentBadge(
                            booking.payment_status
                          )}`}
                        >
                          {booking.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1 text-charcoal/50 hover:text-charcoal"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="p-1 text-green-600 hover:text-green-700"
                                title="Confirm"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="p-1 text-red-600 hover:text-red-700"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              className="p-1 text-blue-600 hover:text-blue-700"
                              title="Mark Complete"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBookings.length === 0 && (
                <div className="py-12 text-center">
                  <p className="font-body text-charcoal/50">
                    No bookings found
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-display text-xl text-charcoal">
                  Booking Details
                </h3>
                <button onClick={() => setSelectedBooking(null)} className="text-charcoal/50 hover:text-charcoal">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs text-charcoal/50 uppercase">
                      Reference
                    </p>
                    <p className="font-body text-sm font-medium">
                      {selectedBooking.reference}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-charcoal/50 uppercase">
                      Status
                    </p>
                    <span
                      className={`px-2 py-1 text-xs font-body rounded-sm ${getStatusBadge(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="font-body text-xs text-charcoal/50 uppercase">
                    Treatment
                  </p>
                  <p className="font-body text-sm">
                    {selectedBooking.treatment_name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs text-charcoal/50 uppercase">
                      Date
                    </p>
                    <p className="font-body text-sm">
                      {format(new Date(selectedBooking.booking_date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-charcoal/50 uppercase">
                      Time
                    </p>
                    <p className="font-body text-sm">
                      {selectedBooking.booking_time}
                    </p>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <p className="font-body text-xs text-charcoal/50 uppercase mb-2">
                    Customer Information
                  </p>
                  <p className="font-body text-sm">
                    {selectedBooking.customer_first_name} {selectedBooking.customer_last_name}
                  </p>
                  <p className="font-body text-sm text-charcoal/70">
                    {selectedBooking.customer_email}
                  </p>
                  <p className="font-body text-sm text-charcoal/70">
                    {selectedBooking.customer_phone}
                  </p>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <p className="font-body text-xs text-charcoal/50 uppercase">
                      Notes
                    </p>
                    <p className="font-body text-sm text-charcoal/70">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                <hr className="border-gray-100" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs text-charcoal/50 uppercase">
                      Amount
                    </p>
                    <p className="font-display text-2xl text-gold">
                      ฿{selectedBooking.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-charcoal/50 uppercase">
                      Payment Status
                    </p>
                    <span
                      className={`px-2 py-1 text-xs font-body rounded-sm ${getPaymentBadge(
                        selectedBooking.payment_status
                      )}`}
                    >
                      {selectedBooking.payment_status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="font-body text-xs text-charcoal/50 uppercase">
                    Created At
                  </p>
                  <p className="font-body text-sm text-charcoal/70">
                    {format(new Date(selectedBooking.created_at), 'PPpp')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

-- Royal Wellness Spa Database Schema
-- Run this in your Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference VARCHAR(50) UNIQUE NOT NULL,
  treatment_name VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(10) NOT NULL,
  customer_first_name VARCHAR(100) NOT NULL,
  customer_last_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  notes TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(100),
  payment_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create stats function for admin dashboard
CREATE OR REPLACE FUNCTION get_booking_stats()
RETURNS TABLE (
  total_bookings BIGINT,
  confirmed_bookings BIGINT,
  pending_bookings BIGINT,
  total_revenue DECIMAL,
  today_bookings BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_bookings,
    COUNT(*) FILTER (WHERE status = 'confirmed' OR status = 'completed')::BIGINT as confirmed_bookings,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_bookings,
    COALESCE(SUM(amount) FILTER (WHERE payment_status = 'paid'), 0) as total_revenue,
    COUNT(*) FILTER (WHERE booking_date = CURRENT_DATE)::BIGINT as today_bookings
  FROM bookings;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (admins) to see all bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users (admins) to insert bookings
CREATE POLICY "Admins can insert bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users (admins) to update bookings
CREATE POLICY "Admins can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for service role to do everything (for API routes)
CREATE POLICY "Service role can do everything"
  ON bookings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert bookings (for public booking form)
CREATE POLICY "Anonymous users can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

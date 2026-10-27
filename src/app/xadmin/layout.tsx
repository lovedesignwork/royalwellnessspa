import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Royal Wellness Spa',
  description: 'Admin dashboard for Royal Wellness Spa',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html lang="en"><body>{children}</body></html>;
}

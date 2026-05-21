'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl text-charcoal mb-4">
            Payment Successful!
          </h1>
          <p className="font-body text-charcoal/70 mb-6">
            Your booking has been confirmed. We look forward to welcoming you at Royal Wellness Spa.
          </p>
          {ref && (
            <p className="font-body text-sm text-charcoal/60 mb-8">
              Booking Reference: <strong>{ref}</strong>
            </p>
          )}
          <Link
            href="/"
            className="btn-luxury bg-gold hover:bg-gold-dark text-white font-body text-sm px-8 py-3 inline-block"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl">⟳</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}

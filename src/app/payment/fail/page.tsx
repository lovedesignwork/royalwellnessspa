'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { XCircle } from 'lucide-react';

function FailContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="font-display text-3xl text-charcoal mb-4">
            Payment Failed
          </h1>
          <p className="font-[var(--font-montserrat)] text-charcoal/70 mb-6">
            Unfortunately, your payment could not be processed. Please try again or contact us for assistance.
          </p>
          {ref && (
            <p className="font-[var(--font-montserrat)] text-sm text-charcoal/60 mb-8">
              Reference: <strong>{ref}</strong>
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Link
              href="/book"
              className="btn-luxury bg-gold hover:bg-gold-dark text-white font-[var(--font-montserrat)] text-sm px-8 py-3 inline-block"
            >
              Try Again
            </Link>
            <Link
              href="/contact"
              className="border border-charcoal hover:bg-charcoal hover:text-white text-charcoal font-[var(--font-montserrat)] text-sm px-8 py-3 inline-block transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl">⟳</div></div>}>
      <FailContent />
    </Suspense>
  );
}

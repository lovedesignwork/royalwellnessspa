import { Suspense } from 'react';
import PaymentResultClient from './PaymentResultClient';

export const dynamic = 'force-dynamic';

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="font-body text-charcoal/60">Loading payment result...</p>
          </div>
        </div>
      }
    >
      <PaymentResultClient />
    </Suspense>
  );
}

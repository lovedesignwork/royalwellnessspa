'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, Loader2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type ResultStatus = 'loading' | 'success' | 'failed' | 'pending';

interface BookingInfo {
  reference: string;
  payment_status: string | null;
  status: string;
  amount: number;
  treatment_name: string;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  customer_email: string;
  transaction_id: string | null;
}

const PAY_SOLUTIONS_POLL_INTERVAL = 1500;
const PAY_SOLUTIONS_MAX_ATTEMPTS = 12;

export default function PaymentResultClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ResultStatus>('loading');
  const [bookingRef, setBookingRef] = useState('');
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [gateway, setGateway] = useState<string | null>(null);
  const pollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackDetectedRef = useRef(false);

  useEffect(() => {
    const gatewayParam = searchParams.get('gateway');
    setGateway(gatewayParam);

    const refNo =
      searchParams.get('refNo') ||
      searchParams.get('ref_no') ||
      searchParams.get('referenceNo') ||
      searchParams.get('invoiceNo') ||
      searchParams.get('refno') ||
      '';

    if (refNo) {
      setBookingRef(refNo);
    }

    return () => {
      if (pollTimeout.current) {
        clearTimeout(pollTimeout.current);
      }
    };
  }, [searchParams]);

  useEffect(() => {
    if (!bookingRef) {
      return;
    }

    let attempts = 0;
    let cancelled = false;
    let resolved = false;
    callbackDetectedRef.current = false;

    const result = searchParams.get('result') || searchParams.get('Result') || '';
    const apCode = searchParams.get('apcode') || searchParams.get('Apcode') || '';

    const checkStatus = async () => {
      if (cancelled || resolved) {
        return;
      }

      attempts += 1;

      try {
        const statusUrl = new URL(`/api/payment/status`, window.location.origin);
        statusUrl.searchParams.set('bookingRef', bookingRef);

        if (attempts === 1 && result) {
          statusUrl.searchParams.set('verify', 'true');
          statusUrl.searchParams.set('result', result);
          if (apCode) {
            statusUrl.searchParams.set('apcode', apCode);
          }
        }

        const response = await fetch(statusUrl.toString(), {
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.booking) {
            setBookingInfo(data.booking);

            if (data.booking.reference && data.booking.reference !== bookingRef) {
              setBookingRef(data.booking.reference);
            }

            if (data.booking.payment_status) {
              callbackDetectedRef.current = true;
            }

            if (data.booking.payment_status === 'paid' || data.booking.status === 'confirmed') {
              resolved = true;
              setStatus('success');
              return;
            }

            if (
              data.booking.payment_status === 'failed' ||
              data.booking.status === 'payment_failed' ||
              data.booking.status === 'cancelled'
            ) {
              resolved = true;
              setStatus('failed');
              return;
            }
          }
        }
      } catch (error) {
        console.error('Failed to verify payment status:', error);
      }

      if (attempts < PAY_SOLUTIONS_MAX_ATTEMPTS) {
        pollTimeout.current = setTimeout(checkStatus, PAY_SOLUTIONS_POLL_INTERVAL);
      } else if (!cancelled && !resolved) {
        setStatus(callbackDetectedRef.current ? 'failed' : 'pending');
      }
    };

    setStatus('loading');
    checkStatus();

    return () => {
      cancelled = true;
      if (pollTimeout.current) {
        clearTimeout(pollTimeout.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRef]);

  const renderBookingDetails = () => {
    if (!bookingInfo) {
      return bookingRef ? (
        <div className="bg-cream rounded-2xl p-5 mb-6 text-left">
          <p className="font-body text-xs text-charcoal/60 uppercase tracking-wide">Reference</p>
          <p className="font-display text-2xl text-gold break-all">{bookingRef}</p>
        </div>
      ) : null;
    }

    return (
      <div className="bg-cream rounded-2xl p-6 mb-6 text-left space-y-3">
        <div>
          <p className="font-body text-xs text-charcoal/60 uppercase tracking-wide">Reference</p>
          <p className="font-display text-2xl text-gold break-all">{bookingInfo.reference}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-charcoal/10">
          <div>
            <p className="font-body text-xs text-charcoal/60 uppercase tracking-wide">Date</p>
            <p className="font-body text-sm text-charcoal font-medium">
              {bookingInfo.booking_date}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-charcoal/60 uppercase tracking-wide">Time</p>
            <p className="font-body text-sm text-charcoal font-medium">
              {bookingInfo.booking_time}
            </p>
          </div>
        </div>
        <div className="pt-3 border-t border-charcoal/10">
          <p className="font-body text-xs text-charcoal/60 uppercase tracking-wide mb-1">
            Treatment
          </p>
          <p className="font-body text-sm text-charcoal">{bookingInfo.treatment_name}</p>
        </div>
        <div className="pt-3 border-t border-charcoal/10 flex justify-between items-center">
          <span className="font-body text-xs text-charcoal/60 uppercase tracking-wide">Total</span>
          <span className="font-display text-xl text-gold">
            ฿{bookingInfo.amount?.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  if (status === 'loading') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-6" />
            <p className="font-display text-2xl text-charcoal mb-2">Processing Payment</p>
            <p className="font-body text-charcoal/60">
              Please wait while we confirm your payment...
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center py-24 px-6">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-3">
                Payment Successful!
              </h1>
              <p className="font-body text-charcoal/70 mb-6">
                Your booking has been confirmed. We look forward to welcoming you at Royal Wellness
                Spa.
              </p>
              {renderBookingDetails()}
              <p className="font-body text-sm text-charcoal/60 mb-6">
                A confirmation email has been sent to your inbox. Please check your spam folder if
                you don&apos;t see it.
              </p>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-3">
                Payment Failed
              </h1>
              <p className="font-body text-charcoal/70 mb-6">
                We were unable to process your payment. If you received a Pay Solutions receipt,
                please contact our team using the reference below and we will finish your booking
                manually.
              </p>
              {renderBookingDetails()}
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-12 h-12 text-amber-600" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-3">
                Thank You for Your Booking
              </h1>
              <p className="font-body text-charcoal/70 mb-6">
                {gateway === 'paysolutions'
                  ? 'If your payment was successful, you will receive a confirmation email shortly. Our team will verify your payment and finalize the booking.'
                  : 'We will get back to you with confirmation of your booking soon.'}
              </p>
              {renderBookingDetails()}
              {gateway === 'paysolutions' && (
                <p className="font-body text-sm text-charcoal/60 mb-6">
                  Please keep your Pay Solutions receipt for reference.
                </p>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal/80 text-white font-body px-6 py-3 rounded-full transition-all"
            >
              Return to Home
            </Link>
            <Link
              href="/treatments"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-body px-6 py-3 rounded-full transition-all"
            >
              Browse Treatments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

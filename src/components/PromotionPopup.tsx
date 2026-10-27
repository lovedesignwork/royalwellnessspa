'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

const STORAGE_KEY = 'rws_promo_seen';

export default function PromotionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('common');
  const pathname = usePathname();

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      alreadySeen = false;
    }

    if (alreadySeen || pathname.startsWith('/blog')) return;

    const timer = setTimeout(() => setIsOpen(true), 900);
    return () => clearTimeout(timer);
  }, [pathname]);

  const close = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Royal Wellness Spa promotion"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />

      <div className="relative animate-fade-in-up max-h-[92vh] flex flex-col items-center">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white text-charcoal shadow-lg flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <Link href="/book" onClick={close} className="block">
          <Image
            src="/images/promotion.jpg"
            alt="Royal Wellness Spa — Recovery Packages Promotion"
            width={1008}
            height={1429}
            priority
            className="h-auto w-auto max-h-[80vh] max-w-full rounded-2xl shadow-2xl"
          />
        </Link>

        <Link
          href="/book"
          onClick={close}
          className="mt-4 inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-body text-sm sm:text-base px-8 py-3 rounded-full shadow-lg transition-all hover:shadow-gold/30 hover:scale-105"
        >
          {t('bookNow')}
        </Link>
      </div>
    </div>
  );
}

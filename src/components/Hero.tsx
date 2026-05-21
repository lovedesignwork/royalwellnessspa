'use client';

import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/shutterstock_1062047603_resize.jpg')`,
        }}
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="font-body text-gold-light text-sm tracking-[0.4em] mb-4 animate-fade-in-up opacity-0 animate-delay-100">
          {t('subtitle')}
        </p>

        <h1 className="font-display text-white text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 animate-fade-in-up opacity-0 animate-delay-200">
          {t('title')}
        </h1>

        <p className="font-body text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto mb-4 animate-fade-in-up opacity-0 animate-delay-300">
          {t('description')}
        </p>

        <p className="font-body text-gold-light text-sm tracking-wider mb-10 animate-fade-in-up opacity-0 animate-delay-300">
          OPEN 10AM - 11PM
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0 animate-delay-400">
          <Link
            href="/book"
            className="btn-luxury bg-gold hover:bg-gold-dark text-white font-body text-sm px-10 py-4 tracking-widest"
          >
            {tCommon('bookYourEscape').toUpperCase()}
          </Link>
          <Link
            href="/treatments"
            className="border border-white/30 hover:border-gold hover:bg-gold/10 text-white font-body text-sm px-10 py-4 tracking-widest transition-all"
          >
            {tCommon('viewTreatments').toUpperCase()}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/50" />
      </div>
    </section>
  );
}

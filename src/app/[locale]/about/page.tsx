'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/routing';
import { Award, Heart, Leaf, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');
  const tCommon = useTranslations('common');

  const features = [
    {
      icon: Award,
      title: t('certifiedExperts'),
      desc: t('certifiedExpertsDesc'),
    },
    {
      icon: Heart,
      title: t('premiumProducts'),
      desc: t('premiumProductsDesc'),
    },
    {
      icon: Leaf,
      title: t('holisticApproach'),
      desc: t('holisticApproachDesc'),
    },
    {
      icon: Users,
      title: t('personalizedCare'),
      desc: t('personalizedCareDesc'),
    },
  ];

  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-16 bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
              {t('subtitle')}
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-white mb-6">
              {t('title')}
            </h1>
            <p className="font-body text-white/70 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
                  {t('location')}
                </p>
                <h2 className="font-display text-4xl text-charcoal mb-6">
                  {t('sanctuaryTitle')}
                </h2>
                <p className="font-body text-charcoal/70 leading-relaxed mb-6">
                  {t('sanctuaryText1')}
                </p>
                <p className="font-body text-charcoal/70 leading-relaxed mb-6">
                  {t('sanctuaryText2')}
                </p>
                <p className="font-body text-charcoal/70 leading-relaxed">
                  {t('sanctuaryText3')}
                </p>
              </div>
              <div className="relative">
                <div
                  className="aspect-[4/5] bg-cover bg-center"
                  style={{
                    backgroundImage: `url('/images/Royal Spa 11.jpg')`,
                  }}
                />
                <div className="absolute -bottom-8 -left-8 bg-gold p-8 max-w-[200px]">
                  <span className="font-display text-white text-4xl block mb-2">
                    {t('openHours')}
                  </span>
                  <span className="font-body text-white/80 text-sm">
                    {t('toHours')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl text-charcoal mb-6">
                {t('whyChooseUs')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((item, idx) => (
                <div key={idx} className="bg-white p-8 text-center card-hover">
                  <item.icon className="w-12 h-12 text-gold mx-auto mb-6" />
                  <h3 className="font-display text-xl text-charcoal mb-4">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-charcoal/70">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/shutterstock_2530376767_resize.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-charcoal/80" />

          <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="font-body text-white/80 mb-10">
              {t('ctaDesc')}
            </p>
            <Link
              href="/book"
              className="btn-luxury bg-gold hover:bg-gold-dark text-white font-body text-sm px-12 py-4 tracking-widest inline-block"
            >
              {tCommon('bookNow').toUpperCase()}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

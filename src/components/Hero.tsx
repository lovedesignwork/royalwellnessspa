'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowDown, ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './HomeWellness.module.css';

export default function Hero() {
  const t = useTranslations('homepageDesign');
  const common = useTranslations('common');
  const welcome = useTranslations('welcome');

  return (
    <section className={styles.hero} aria-labelledby="spa-hero-title">
      <div className={styles.heroPhoto}>
        <Image src="/images/Royal Spa 6.jpg" alt={t('massageAlt')} fill priority
          sizes="100vw" className={styles.coverImage} />
      </div>
      <div className={styles.heroShade} />
      <div className={`${styles.container} ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{t('heroEyebrow')}</p>
          <h1 id="spa-hero-title">{t('heroTitle')}<em>{t('heroAccent')}</em></h1>
          <p className={styles.heroDescription}>{t('heroDescription')}</p>
          <div className={styles.heroActions}>
            <Link href="/book" className={styles.lightButton}>
              {common('bookYourEscape')} <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/treatments" className={styles.heroTextLink}>{common('viewTreatments')}</Link>
          </div>
        </div>
        <div className={styles.heroFoot}>
          <div><MapPin size={16} aria-hidden="true" /><span>{t('location')}</span></div>
          <div><Clock3 size={16} aria-hidden="true" /><span>{welcome('openDaily')} · {welcome('hours')}</span></div>
          <a href="#welcome" className={styles.exploreLink}>{t('slowDown')} <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import { ArrowUpRight, KeyRound } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { categories, getTreatmentsByCategory, type Category } from '@/lib/spa-data';
import styles from './HomeWellness.module.css';

type FeaturedCategory = Exclude<Category, 'Top-Up / Add-On'>;

// Attach imagery to the category instead of depending on its array position.
const categoryDetails = {
  Promotion: { key: 'promotion', image: '/images/Royal Spa 12.jpg' },
  'Travel Recovery': { key: 'travelRecovery', image: '/images/Royal Spa 7.jpg' },
  'Skin & Radiance': { key: 'skinRadiance', image: '/images/Royal Spa 9.jpg' },
  'Couple & Special': { key: 'coupleSpecial', image: '/images/Royal Spa 8.jpg' },
  'Facial Treatments': { key: 'facialTreatments', image: '/images/Royal Spa 10.jpg' },
  'Classic Thai Heritage': { key: 'classicThaiHeritage', image: '/images/Royal Wellness Spa 8.jpg' },
} satisfies Record<FeaturedCategory, { key: string; image: string }>;

export default async function HomeWellnessSections() {
  const t = await getTranslations('homepageDesign');
  const hotel = await getTranslations('hotelDiscount');
  const names = await getTranslations('categories');
  const descriptions = await getTranslations('categoryDescriptions');
  const common = await getTranslations('common');

  return (
    <>
      <section className={styles.hotelSection} aria-labelledby="hotel-offer-title">
        <div className={styles.container}>
          <div className={styles.hotelOffer}>
            <div className={styles.hotelPhoto}>
              <Image src="/images/Royal Wellness Spa 7.jpg" alt={t('roomAlt')} fill
                sizes="(max-width: 760px) 100vw, 40vw" className={styles.coverImage} />
              <span className={styles.photoCaption}>{t('hotelPhotoCaption')}</span>
            </div>
            <div className={styles.hotelCopy}>
              <p className={styles.eyebrow}><KeyRound size={16} aria-hidden="true" />{hotel('exclusive')}</p>
              <h2 id="hotel-offer-title">{t('hotelTitle')}<em>{t('hotelAccent')}</em></h2>
              <div className={styles.hotelDetails}>
                <div>
                  <p>{hotel('description')}</p>
                  <Link href="/book" className={styles.darkButton}>
                    {hotel('cta')}<ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
                <div className={styles.discount}>
                  <span className={styles.discountValue}>10<span>%</span></span>
                  <span className={styles.discountLabel}>{t('discountLabel')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.categoriesSection} aria-labelledby="treatment-collections-title">
        <div className={styles.container}>
          <div className={styles.categoryHeading}>
            <div>
              <p className={styles.eyebrow}>{t('collectionsEyebrow')}</p>
              <h2 id="treatment-collections-title">{t('collectionsTitle')} <em>{t('collectionsAccent')}</em></h2>
            </div>
            <p>{t('collectionsDescription')}</p>
          </div>
          <div className={styles.categoryGrid}>
            {categories.filter((category): category is FeaturedCategory => category !== 'Top-Up / Add-On').map((category, index) => {
              const { key, image } = categoryDetails[category];
              const count = getTreatmentsByCategory(category).length;
              return (
                <Link key={category} href={`/treatments?category=${encodeURIComponent(category)}`} className={styles.categoryCard}>
                  <div className={styles.categoryPhoto}>
                    <Image src={image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" className={styles.coverImage} />
                    <span className={styles.categoryCount}>{count} {common('treatments')}</span>
                    <span className={styles.categoryArrow}><ArrowUpRight size={22} aria-hidden="true" /></span>
                  </div>
                  <div className={styles.categoryCopy}>
                    <span className={styles.categoryNumber} aria-hidden="true">0{index + 1}</span>
                    <div><h3>{names(key)}</h3><p>{descriptions(key)}</p></div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className={styles.collectionFooter}>
            <span>{t('collectionNote')}</span>
            <Link href="/treatments" className={styles.textLink}>{common('viewTreatments')}<ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

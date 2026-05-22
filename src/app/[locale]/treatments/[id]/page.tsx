import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { treatments, getTreatmentById, getTreatmentsByCategory, type Treatment, type Category } from '@/lib/spa-data';
import { Clock, Sparkles, ArrowRight, Check, Users, Star, ArrowLeft, Calendar, Heart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const categoryKeys: Record<string, string> = {
  "Travel Recovery": "travelRecovery",
  "Skin & Radiance": "skinRadiance",
  "Couple & Special": "coupleSpecial",
  "Facial Treatments": "facialTreatments",
  "Classic Thai Heritage": "classicThaiHeritage",
};

export async function generateStaticParams() {
  return treatments.map((treatment) => ({
    id: treatment.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const treatment = getTreatmentById(parseInt(id));
  const t = await getTranslations({ locale });
  
  if (!treatment) {
    return { title: 'Treatment Not Found' };
  }

  const treatmentName = locale === 'th' ? t(`treatmentNames.${treatment.id}`) : treatment.name;
  const treatmentDescription = locale === 'th' ? t(`treatmentDescriptions.${treatment.id}`) : treatment.description;

  return {
    title: `${treatmentName} | Royal Wellness Spa`,
    description: treatmentDescription,
  };
}

function parseDurationOptions(treatment: Treatment): { duration: string; price: number }[] {
  const durationStr = treatment.duration;
  const hasMin = durationStr.toLowerCase().includes('min');
  const durations = durationStr.split(' / ').map(d => {
    const trimmed = d.trim();
    if (hasMin && !trimmed.toLowerCase().includes('min')) {
      return `${trimmed} min`;
    }
    return trimmed;
  });
  
  const prices = treatment.price.split(' / ').map(p => {
    const numStr = p.replace(/,/g, '').replace(/[^\d]/g, '');
    return parseInt(numStr) || 0;
  });
  
  return durations.map((duration, index) => ({
    duration,
    price: prices[index] || prices[0] || treatment.priceValue,
  }));
}

export default async function TreatmentDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const treatment = getTreatmentById(parseInt(id));
  const t = await getTranslations({ locale });

  if (!treatment) {
    notFound();
  }

  const durationOptions = parseDurationOptions(treatment);
  
  const relatedTreatments = getTreatmentsByCategory(treatment.category as Category)
    .filter(t => t.id !== treatment.id)
    .slice(0, 3);

  const treatmentName = locale === 'th' 
    ? t(`treatmentNames.${treatment.id}`) 
    : treatment.name;
  
  const treatmentDescription = locale === 'th'
    ? t(`treatmentDescriptions.${treatment.id}`)
    : treatment.description;

  const categoryName = locale === 'th' && categoryKeys[treatment.category]
    ? t(`categories.${categoryKeys[treatment.category]}`)
    : treatment.category;

  const highlights = locale === 'th'
    ? (t.raw(`treatmentHighlights.${treatment.id}`) as string[])
    : treatment.highlights;

  const targetGuest = locale === 'th' ? getTargetGuestThai(treatment.targetGuest) : treatment.targetGuest;
  const bestBookingTime = locale === 'th' ? getBestBookingTimeThai(treatment.bestBookingTime) : treatment.bestBookingTime;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px]">
          <Image
            src={treatment.image}
            alt={treatmentName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" />
          
          {/* Back Button */}
          <Link 
            href="/treatments"
            className="absolute top-28 left-6 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('treatmentDetail.backToTreatments')}
          </Link>

          {/* Badges */}
          <div className="absolute top-28 right-6 z-10 flex items-center gap-2">
            {treatment.isSignature && (
              <div className="bg-gold text-white text-sm font-body px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Sparkles className="w-4 h-4" />
                {t('common.signature').toUpperCase()}
              </div>
            )}
            {treatment.isCouple && (
              <div className="bg-rose-500 text-white text-sm font-body px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Heart className="w-4 h-4" />
                {t('common.couple').toUpperCase()}
              </div>
            )}
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
            <div className="max-w-7xl mx-auto">
              <p className="font-body text-gold text-sm tracking-wider mb-2">
                {categoryName}
              </p>
              <h1 className="font-display text-4xl md:text-6xl text-white mb-4">
                {treatmentName}
              </h1>
              <p className="font-body text-white/80 text-lg max-w-2xl">
                {treatmentDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-10">
                {/* Duration & Pricing */}
                <div className="bg-white rounded-2xl shadow-md p-8">
                  <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-gold" />
                    {t('treatmentDetail.duration')} & {t('treatmentDetail.price')}
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {durationOptions.map((option, index) => (
                      <div 
                        key={index}
                        className="border-2 border-cream rounded-xl p-5 text-center hover:border-gold/50 transition-colors"
                      >
                        <p className="font-body text-charcoal/60 text-sm mb-1">
                          {option.duration}
                        </p>
                        <p className="font-display text-3xl text-gold">
                          ฿{option.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {treatment.priceNote && (
                    <p className="mt-4 font-body text-sm text-charcoal/60 italic">
                      {locale === 'th' 
                        ? `ราคา${treatment.priceNote === 'per couple' ? t('common.perCouple') : t('common.perPerson')}`
                        : `Price is ${treatment.priceNote}`
                      }
                    </p>
                  )}
                </div>

                {/* Key Techniques */}
                <div className="bg-white rounded-2xl shadow-md p-8">
                  <h2 className="font-display text-2xl text-charcoal mb-6">
                    {t('treatmentDetail.highlights')}
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-gold" />
                        </div>
                        <span className="font-body text-charcoal/80">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Guest & Best Booking Time */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="font-display text-xl text-charcoal mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-gold" />
                      {t('treatmentDetail.targetGuest')}
                    </h3>
                    <p className="font-body text-charcoal/70">
                      {targetGuest}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="font-display text-xl text-charcoal mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gold" />
                      {t('treatmentDetail.bestTime')}
                    </h3>
                    <p className="font-body text-charcoal/70">
                      {bestBookingTime}
                    </p>
                  </div>
                </div>

                {treatment.notes && !treatment.notes.toLowerCase().includes('signature') && (
                  <div className="bg-cream/50 rounded-2xl p-6">
                    <p className="font-body text-sm text-charcoal/60">
                      <span className="font-medium text-charcoal">{locale === 'th' ? 'หมายเหตุ: ' : 'Note: '}</span>
                      {treatment.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Sticky Booking Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-28">
                  <div className="bg-charcoal rounded-2xl shadow-xl p-8 text-white">
                    <h3 className="font-display text-2xl mb-2">
                      {locale === 'th' ? 'พร้อมจองแล้วหรือยัง?' : 'Ready to Book?'}
                    </h3>
                    <p className="font-body text-white/70 text-sm mb-6">
                      {locale === 'th' 
                        ? `สัมผัสประสบการณ์ ${treatmentName} และฟื้นฟูสุขภาพของคุณ`
                        : `Experience the ${treatmentName} and restore your well-being.`
                      }
                    </p>

                    <div className="border-t border-white/10 pt-6 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-body text-white/70 text-sm">
                          {locale === 'th' ? 'เริ่มต้นที่' : 'Starting from'}
                        </span>
                        <span className="font-display text-3xl text-gold">
                          ฿{treatment.priceValue.toLocaleString()}
                        </span>
                      </div>
                      <p className="font-body text-white/50 text-xs">
                        {treatment.duration}
                      </p>
                    </div>

                    <Link
                      href={`/book?treatment=${treatment.id}`}
                      className="block w-full text-center bg-gold hover:bg-gold-dark text-white font-body py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-gold/30"
                    >
                      {t('treatmentDetail.bookNow')}
                    </Link>

                    {/* Hotel Guest Discount */}
                    <div className="mt-6 bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-gold" />
                        <span className="font-body text-sm font-medium">
                          {t('hotelDiscount.hotelGuestDiscount')}
                        </span>
                      </div>
                      <p className="font-body text-white/60 text-xs">
                        {locale === 'th'
                          ? 'ผู้เข้าพักโรงแรม Royal Phuket City รับส่วนลด 10% สำหรับทุกทรีทเมนต์'
                          : 'Royal Phuket City Hotel guests receive 10% off all treatments.'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
                    <h4 className="font-body text-sm font-medium text-charcoal mb-4">
                      {locale === 'th' ? 'ข้อมูลด่วน' : 'Quick Info'}
                    </h4>
                    <div className="space-y-3 text-sm font-body">
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">{locale === 'th' ? 'หมวดหมู่' : 'Category'}</span>
                        <span className="text-charcoal font-medium">{categoryName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">{t('treatmentDetail.duration')}</span>
                        <span className="text-charcoal font-medium">{treatment.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">{locale === 'th' ? 'ช่วงราคา' : 'Price Range'}</span>
                        <span className="text-charcoal font-medium">{treatment.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Treatments */}
        {relatedTreatments.length > 0 && (
          <section className="py-16 bg-cream/50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl text-charcoal mb-2">
                  {locale === 'th' ? `เพิ่มเติมใน${categoryName}` : `More in ${treatment.category}`}
                </h2>
                <p className="font-body text-charcoal/60">
                  {locale === 'th' 
                    ? 'ค้นพบทรีทเมนต์อื่นๆ ที่คุณอาจชอบ'
                    : 'Explore other treatments you might enjoy'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedTreatments.map((related) => {
                  const relatedName = locale === 'th' ? t(`treatmentNames.${related.id}`) : related.name;
                  return (
                    <Link
                      key={related.id}
                      href={`/treatments/${related.id}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={related.image}
                          alt={relatedName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-display text-xl text-white">
                            {relatedName}
                          </h3>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-charcoal/60">
                            <Clock className="w-4 h-4" />
                            <span className="font-body text-sm">
                              {related.duration}
                            </span>
                          </div>
                          <span className="font-display text-xl text-gold">
                            {related.price.split(' /')[0]}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/treatments"
                  className="inline-flex items-center gap-2 font-body text-gold hover:text-gold-dark transition-colors"
                >
                  {locale === 'th' ? 'ดูทรีทเมนต์ทั้งหมด' : 'View All Treatments'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-charcoal">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-display text-4xl text-white mb-4">
              {locale === 'th' ? 'สัมผัสการผ่อนคลายที่แท้จริง' : 'Experience True Relaxation'}
            </h2>
            <p className="font-body text-white/70 mb-8 max-w-2xl mx-auto">
              {locale === 'th'
                ? `จอง${treatmentName}วันนี้ และให้ผู้เชี่ยวชาญของเราฟื้นฟูร่างกายและจิตใจของคุณ`
                : `Book your ${treatmentName} today and let our expert therapists restore your body and mind.`
              }
            </p>
            <Link
              href={`/book?treatment=${treatment.id}`}
              className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-white font-body px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-gold/30"
            >
              {t('common.bookNow')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function getTargetGuestThai(targetGuest: string): string {
  const translations: Record<string, string> = {
    "Office workers, remote workers, frequent computer users": "พนักงานออฟฟิศ ทำงานทางไกล ผู้ใช้คอมพิวเตอร์บ่อย",
    "Modern professionals, urban workers, sedentary lifestyle": "มืออาชีพยุคใหม่ คนทำงานในเมือง ผู้มีวิถีชีวิตนั่งทำงาน",
    "Long-haul travelers, post-flight recovery, jet lag sufferers": "นักเดินทางระยะไกล ฟื้นตัวหลังเที่ยวบิน ผู้มีอาการเจ็ตแล็ก",
    "Active travelers, walkers, sightseeing enthusiasts": "นักเดินทางที่กระตือรือร้น นักเดิน ผู้ชื่นชอบการท่องเที่ยว",
    "Athletes, fitness enthusiasts, sports travelers": "นักกีฬา ผู้ชื่นชอบการออกกำลังกาย นักเดินทางสายกีฬา",
    "Beach lovers, outdoor enthusiasts, sun exposure recovery": "ผู้รักชายหาด ผู้ชื่นชอบกิจกรรมกลางแจ้ง ฟื้นฟูผิวจากแสงแดด",
    "Luxury seekers, special occasion, complete pampering": "ผู้แสวงหาความหรูหรา โอกาสพิเศษ การดูแลตัวเองอย่างครบครัน",
    "Beauty enthusiasts, skin care lovers, radiance seekers": "ผู้ชื่นชอบความงาม ผู้รักการดูแลผิว ผู้แสวงหาผิวเปล่งประกาย",
    "Couples, anniversaries, romantic getaways": "คู่รัก วันครบรอบ การพักผ่อนโรแมนติก",
    "Brides-to-be, pre-wedding, special events": "ว่าที่เจ้าสาว ก่อนแต่งงาน งานพิเศษ",
    "Sun exposure recovery, post-beach, outdoor activities": "ฟื้นฟูผิวจากแสงแดด หลังเที่ยวชายหาด กิจกรรมกลางแจ้ง",
    "Skincare enthusiasts, anti-aging, facial rejuvenation": "ผู้ชื่นชอบการดูแลผิว ชะลอวัย ฟื้นฟูใบหน้า",
    "Traditional Thai experience seekers, holistic wellness": "ผู้แสวงหาประสบการณ์ไทยดั้งเดิม สุขภาพแบบองค์รวม",
    "Relaxation seekers, stress relief, sleep improvement": "ผู้แสวงหาการผ่อนคลาย บรรเทาความเครียด ปรับปรุงการนอนหลับ",
    "Muscle tension, traditional healing, herbal therapy lovers": "กล้ามเนื้อตึง การรักษาแบบดั้งเดิม ผู้ชื่นชอบการบำบัดด้วยสมุนไพร",
    "Quick refresh, add-on treatment, foot recovery": "รีเฟรชด่วน ทรีทเมนต์เสริม ฟื้นฟูเท้า",
    "Quick relief, tension headaches, mental fatigue": "บรรเทาด่วน ปวดศีรษะจากความเครียด ความเหนื่อยล้าทางจิต",
    "Add-on treatment, muscle relaxation enhancement": "ทรีทเมนต์เสริม เพิ่มการผ่อนคลายกล้ามเนื้อ",
    "Digital workers, screen fatigue, eye strain": "คนทำงานดิจิทัล ความเหนื่อยล้าจากหน้าจอ อาการตาล้า"
  };
  return translations[targetGuest] || targetGuest;
}

function getBestBookingTimeThai(bestBookingTime: string): string {
  const translations: Record<string, string> = {
    "After long work day, midweek refresh": "หลังวันทำงานหนัก รีเฟรชกลางสัปดาห์",
    "Morning or after work hours": "ช่วงเช้าหรือหลังเลิกงาน",
    "Day of arrival or next morning": "วันที่เดินทางมาถึงหรือเช้าวันรุ่งขึ้น",
    "After full day of sightseeing": "หลังจากเที่ยวชมสถานที่ทั้งวัน",
    "Post-workout, after sports activities": "หลังออกกำลังกาย หลังกิจกรรมกีฬา",
    "Same day or day after sun exposure": "วันเดียวกันหรือวันหลังจากโดนแดด",
    "Special occasions, anniversary, celebration": "โอกาสพิเศษ วันครบรอบ งานเฉลิมฉลอง",
    "Before special events, weekly self-care": "ก่อนงานพิเศษ ดูแลตัวเองรายสัปดาห์",
    "Evening, romantic dinner pairing": "ช่วงเย็น จับคู่กับมื้อเย็นโรแมนติก",
    "1-2 weeks before wedding day": "1-2 สัปดาห์ก่อนวันแต่งงาน",
    "Evening, post-sun exposure": "ช่วงเย็น หลังโดนแสงแดด",
    "Morning or before evening events": "ช่วงเช้าหรือก่อนงานตอนเย็น",
    "Evening for deep relaxation, morning for energy": "ช่วงเย็นเพื่อผ่อนคลายลึก ช่วงเช้าเพื่อพลังงาน",
    "Evening, before sleep, stress relief": "ช่วงเย็น ก่อนนอน บรรเทาความเครียด",
    "Anytime, pairs with any massage": "ตลอดเวลา จับคู่กับการนวดใดก็ได้",
    "Anytime, quick refresh": "ตลอดเวลา รีเฟรชด่วน",
    "Midday or after work": "ช่วงกลางวันหรือหลังเลิกงาน",
    "After long screen time": "หลังใช้หน้าจอนาน"
  };
  return translations[bestBookingTime] || bestBookingTime;
}

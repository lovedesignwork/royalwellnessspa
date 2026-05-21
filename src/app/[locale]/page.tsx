import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/routing';
import { categories, getTreatmentsByCategory } from '@/lib/spa-data';
import { Clock, Award, Heart, Leaf, Star, Quote, Hotel, Sparkles, Shield, Users, Gem, CheckCircle } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('welcome');
  const tUsp = await getTranslations('usp');
  const tHotel = await getTranslations('hotelDiscount');
  const tCategories = await getTranslations('categories');
  const tTestimonials = await getTranslations('testimonials');
  const tCta = await getTranslations('cta');
  const tCommon = await getTranslations('common');
  const tTravel = await getTranslations('travelRecovery');
  const travelRecovery = getTreatmentsByCategory('Travel Recovery').slice(0, 3);

  const testimonials = [
    {
      name: "Sarah M.",
      country: "Australia",
      rating: 5,
      text: "Absolutely divine experience! The Digital Detox treatment was exactly what I needed after weeks of remote work. The therapists are incredibly skilled.",
      date: "2 weeks ago"
    },
    {
      name: "James L.",
      country: "United Kingdom", 
      rating: 5,
      text: "Best spa in Phuket! The Royal Glow Renewal Ritual left my skin feeling amazing. The ambiance is so peaceful and luxurious.",
      date: "1 month ago"
    },
    {
      name: "Yuki T.",
      country: "Japan",
      rating: 5,
      text: "Perfect recovery after a long flight from Tokyo. The Jet Lag Recovery Ritual really works! Staff was professional and friendly.",
      date: "3 weeks ago"
    },
    {
      name: "Michael R.",
      country: "Germany",
      rating: 5,
      text: "My wife and I had the couples treatment - it was unforgettable. The attention to detail and quality of service exceeded our expectations.",
      date: "1 week ago"
    }
  ];

  const uspFeatures = [
    {
      icon: Gem,
      title: tUsp('premiumProducts'),
      description: tUsp('premiumProductsDesc')
    },
    {
      icon: Users,
      title: tUsp('masterTherapists'),
      description: tUsp('masterTherapistsDesc')
    },
    {
      icon: Shield,
      title: tUsp('personalizedTreatments'),
      description: tUsp('personalizedTreatmentsDesc')
    },
    {
      icon: Sparkles,
      title: tUsp('travelerFocused'),
      description: tUsp('travelerFocusedDesc')
    }
  ];

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Welcome Section - Redesigned */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div 
                      className="aspect-[3/4] bg-cover bg-center rounded-sm shadow-lg"
                      style={{ backgroundImage: `url('/images/Royal Spa 1.jpg')` }}
                    />
                    <div 
                      className="aspect-square bg-cover bg-center rounded-sm shadow-lg"
                      style={{ backgroundImage: `url('/images/Royal Spa 2.jpg')` }}
                    />
                  </div>
                  <div className="space-y-4 pt-12">
                    <div 
                      className="aspect-square bg-cover bg-center rounded-sm shadow-lg"
                      style={{ backgroundImage: `url('/images/Royal Spa 3.jpg')` }}
                    />
                    <div 
                      className="aspect-[3/4] bg-cover bg-center rounded-sm shadow-lg"
                      style={{ backgroundImage: `url('/images/Royal Spa 4.jpg')` }}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gold p-6 rounded-sm shadow-xl hidden lg:block">
                  <p className="font-display text-white text-4xl font-semibold">13+</p>
                  <p className="font-body text-white/80 text-sm">{t('yearsExcellence')}</p>
                </div>
              </div>

              <div>
                <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
                  {t('subtitle')}
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6 leading-tight">
                  {t('title')} <span className="text-gold">{t('titleHighlight')}</span> {t('titleEnd')}
                </h2>
                <p className="font-body text-charcoal/70 leading-relaxed mb-8">
                  {t('description')}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { icon: Clock, title: t('openDaily'), desc: t('hours') },
                    { icon: Award, title: t('certifiedExperts'), desc: t('training') },
                    { icon: Heart, title: t('organicOils'), desc: t('premiumAromatics') },
                    { icon: Leaf, title: t('ecoConscious'), desc: t('sustainable') },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-body text-sm font-medium text-charcoal">
                          {item.title}
                        </h3>
                        <p className="font-body text-xs text-charcoal/60">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-body text-sm text-gold hover:text-gold-dark transition-colors"
                >
                  {t('discoverStory')}
                  <span className="text-lg">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Recovery - Redesigned */}
        <section className="py-24 bg-charcoal text-white relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{ 
              backgroundImage: `url('/images/shutterstock_1874692903_resize.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
                  {tTravel('subtitle')}
                </p>
                <h2 className="font-display text-4xl md:text-5xl mb-6">
                  {tTravel('title')} <span className="text-gold">{tTravel('titleHighlight')}</span>
                </h2>
                <p className="font-body text-white/70 mb-8 leading-relaxed">
                  {tTravel('description')}
                </p>

                <div className="space-y-4 mb-8">
                  {[tTravel('jetLag'), tTravel('digitalDetox'), tTravel('walking'), tTravel('sports')].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gold" />
                      <span className="font-body text-sm text-white/80">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/treatments?category=Travel%20Recovery"
                  className="btn-luxury border border-gold bg-transparent hover:bg-gold text-white font-body text-sm px-8 py-3 inline-block"
                >
                  {tTravel('viewAll')}
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {travelRecovery.map((treatment, idx) => (
                  <div
                    key={treatment.id}
                    className={`bg-white/5 backdrop-blur-sm border border-white/10 p-6 card-hover flex items-center gap-6 ${idx === 0 ? 'lg:translate-x-8' : idx === 2 ? 'lg:translate-x-8' : ''}`}
                  >
                    <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-display text-gold text-2xl">0{idx + 1}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-display text-xl text-white mb-1">
                        {treatment.name}
                      </h3>
                      <p className="font-body text-white/60 text-xs mb-2 line-clamp-1">
                        {treatment.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg text-gold">
                          ฿{treatment.price}
                        </span>
                        <Link
                          href={`/book?treatment=${treatment.id}`}
                          className="font-body text-xs text-gold hover:text-gold-light transition-colors"
                        >
                          {tTravel('book')} →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why We're Different - USP Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
                {tUsp('subtitle')}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
                {tUsp('title')} <span className="text-gold">{tUsp('titleHighlight')}</span>
              </h2>
              <p className="font-body text-charcoal/70">
                {tUsp('description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {uspFeatures.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-6 p-8 bg-gradient-to-br from-cream/50 to-transparent border border-cream/50 card-hover"
                >
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-charcoal mb-3">
                      {feature.title}
                    </h3>
                    <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hotel Guest Discount */}
        <section className="py-20 bg-gradient-to-r from-gold-dark via-gold to-gold-light relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Hotel className="w-16 h-16 text-gold" />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full mb-4">
                  <span className="font-body text-white text-sm font-medium">
                    {tHotel('exclusive')}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
                  {tHotel('title')} <span className="font-semibold">{tHotel('discount')}</span>
                </h2>
                <p className="font-body text-white/90 mb-6 max-w-xl">
                  {tHotel('description')}
                </p>
                <Link
                  href="/book"
                  className="inline-block bg-white text-gold hover:bg-cream font-body text-sm px-8 py-3 transition-colors shadow-lg"
                >
                  {tHotel('cta')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Categories - Redesigned */}
        <section className="py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
                {tCategories('subtitle')}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
                {tCategories('title')}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categories.filter(c => c !== "Top-Up / Add-On").map((category, idx) => {
                const images = [
                  '/images/Royal Spa 5.jpg',
                  '/images/Royal Spa 6.jpg',
                  '/images/Royal Spa 7.jpg',
                  '/images/Royal Spa 8.jpg',
                  '/images/Royal Spa 9.jpg',
                ];
                const treatmentCount = getTreatmentsByCategory(category as typeof categories[number]).length;
                const categoryNames: Record<string, string> = {
                  'Travel Recovery': tCategories('travelRecovery'),
                  'Skin & Radiance': tCategories('skinRadiance'),
                  'Couple & Special': tCategories('coupleSpecial'),
                  'Facial Treatments': tCategories('facialTreatments'),
                  'Classic Thai Heritage': tCategories('classicThaiHeritage'),
                };
                
                return (
                  <Link
                    key={category}
                    href={`/treatments?category=${encodeURIComponent(category)}`}
                    className={`group relative overflow-hidden card-hover ${idx === 0 ? 'col-span-2 lg:col-span-1 row-span-2' : ''}`}
                    style={{ minHeight: idx === 0 ? '400px' : '200px' }}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${images[idx]}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                    <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-colors duration-300" />
                    <div className="relative h-full flex flex-col justify-end p-6">
                      <span className="font-body text-gold text-xs tracking-wider mb-2">
                        {treatmentCount} {tCommon('treatments').toUpperCase()}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl text-white">
                        {categoryNames[category] || category}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials & Reviews */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/3">
                <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
                  {tTestimonials('subtitle')}
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
                  {tTestimonials('title')}
                </h2>
                
                <div className="bg-cream p-8 rounded-sm mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-body text-sm font-medium text-charcoal">Google</span>
                    <span className="font-body text-xs text-charcoal/60">{tTestimonials('googleReviews').replace('Google ', '')}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-display text-4xl text-charcoal">4.9</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="font-body text-sm text-charcoal/60">
                    {tTestimonials('basedOn')}
                  </p>
                </div>

                <a
                  href="https://google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-sm text-gold hover:text-gold-dark transition-colors"
                >
                  {tTestimonials('seeAll')}
                  <span className="text-lg">→</span>
                </a>
              </div>

              <div className="lg:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gradient-to-br from-cream/50 to-white p-6 border border-cream card-hover"
                    >
                      <Quote className="w-8 h-8 text-gold/30 mb-4" />
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                        ))}
                      </div>
                      <p className="font-body text-sm text-charcoal/70 mb-4 leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-body text-sm font-medium text-charcoal">
                            {testimonial.name}
                          </p>
                          <p className="font-body text-xs text-charcoal/50">
                            {testimonial.country}
                          </p>
                        </div>
                        <span className="font-body text-xs text-charcoal/40">
                          {testimonial.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/shutterstock_2167201991_resize.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-charcoal/70" />

          <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
            <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
              {tCta('subtitle')}
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              {tCta('title')}
            </h2>
            <p className="font-body text-white/80 mb-10">
              {tCta('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="btn-luxury bg-gold hover:bg-gold-dark text-white font-body text-sm px-12 py-4 tracking-widest inline-block"
              >
                {tCommon('bookYourEscape').toUpperCase()}
              </Link>
              <Link
                href="/treatments"
                className="border border-white/30 hover:border-gold hover:bg-gold/10 text-white font-body text-sm px-12 py-4 tracking-widest inline-block transition-all"
              >
                {tCommon('viewTreatments').toUpperCase()}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

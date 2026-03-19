import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getSignatureTreatments, categories, getTreatmentsByCategory } from '@/lib/spa-data';
import { Clock, Award, Heart, Leaf, Star, Quote, Hotel, Sparkles, Shield, Users, Gem, CheckCircle } from 'lucide-react';

export default function Home() {
  const signatureTreatments = getSignatureTreatments();
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
      title: "Premium Organic Products",
      description: "We exclusively use certified organic oils and botanical ingredients sourced from Thailand's finest suppliers."
    },
    {
      icon: Users,
      title: "Master-Level Therapists",
      description: "Our therapists undergo 500+ hours of specialized training, combining ancient Thai techniques with modern wellness science."
    },
    {
      icon: Shield,
      title: "Personalized Treatments",
      description: "Every session begins with a consultation to customize pressure, focus areas, and aromatherapy to your specific needs."
    },
    {
      icon: Sparkles,
      title: "Traveler-Focused Recovery",
      description: "Unique treatments designed specifically for jet lag, screen fatigue, and the physical demands of travel."
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
                  <p className="font-[var(--font-montserrat)] text-white/80 text-sm">Years of Excellence</p>
                </div>
              </div>

              <div>
                <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-[0.3em] mb-4">
                  WELCOME TO ROYAL WELLNESS SPA
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6 leading-tight">
                  A Sanctuary of <span className="text-gold">Serenity</span> in the Heart of Phuket
                </h2>
                <p className="font-[var(--font-montserrat)] text-charcoal/70 leading-relaxed mb-8">
                  Nestled on the 3rd floor with panoramic views, Royal Wellness Spa offers an escape from the ordinary. 
                  With expert massage techniques passed down through generations and premium aromatic oils sourced from 
                  Thailand's finest botanical gardens, every treatment is a journey to complete renewal.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { icon: Clock, title: 'Open Daily', desc: '10AM - 11PM' },
                    { icon: Award, title: 'Certified Experts', desc: '500+ hours training' },
                    { icon: Heart, title: 'Organic Oils', desc: 'Premium aromatics' },
                    { icon: Leaf, title: 'Eco-Conscious', desc: 'Sustainable practices' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal">
                          {item.title}
                        </h3>
                        <p className="font-[var(--font-montserrat)] text-xs text-charcoal/60">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-[var(--font-montserrat)] text-sm text-gold hover:text-gold-dark transition-colors"
                >
                  Discover Our Story
                  <span className="text-lg">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Signature Treatments */}
        <section className="py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-[0.3em] mb-4">
                OUR SPECIALTIES
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
                Signature Treatments
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {signatureTreatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className="bg-white p-8 card-hover flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-2xl text-charcoal mb-2">
                        {treatment.name}
                      </h3>
                      <p className="font-[var(--font-montserrat)] text-gold text-sm">
                        {treatment.category}
                      </p>
                    </div>
                    <span className="bg-gold/10 text-gold font-[var(--font-montserrat)] text-xs px-3 py-1">
                      SIGNATURE
                    </span>
                  </div>

                  <p className="font-[var(--font-montserrat)] text-charcoal/70 text-sm mb-6 flex-grow">
                    {treatment.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {treatment.highlights.slice(0, 4).map((h, i) => (
                      <span
                        key={i}
                        className="font-[var(--font-montserrat)] text-xs bg-cream px-3 py-1 text-charcoal/70"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-cream">
                    <div>
                      <span className="font-[var(--font-montserrat)] text-xs text-charcoal/50 block">
                        {treatment.duration}
                      </span>
                      <span className="font-display text-2xl text-gold">
                        ฿{treatment.price}
                      </span>
                    </div>
                    <Link
                      href={`/book?treatment=${treatment.id}`}
                      className="btn-luxury bg-charcoal hover:bg-gold text-white font-[var(--font-montserrat)] text-sm px-6 py-3"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
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
                <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-[0.3em] mb-4">
                  PERFECT FOR TRAVELERS
                </p>
                <h2 className="font-display text-4xl md:text-5xl mb-6">
                  Travel Recovery <span className="text-gold">Collection</span>
                </h2>
                <p className="font-[var(--font-montserrat)] text-white/70 mb-8 leading-relaxed">
                  Designed specifically for weary travelers, our recovery treatments restore your body 
                  and mind after long journeys. From jet lag to digital fatigue, we have the perfect 
                  remedy for modern travel stress.
                </p>

                <div className="space-y-4 mb-8">
                  {['Jet Lag & Flight Recovery', 'Digital Detox & Screen Fatigue', 'Walking & Sightseeing Recovery', 'Active Sports Recovery'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gold" />
                      <span className="font-[var(--font-montserrat)] text-sm text-white/80">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/treatments?category=Travel%20Recovery"
                  className="btn-luxury border border-gold bg-transparent hover:bg-gold text-white font-[var(--font-montserrat)] text-sm px-8 py-3 inline-block"
                >
                  View All Recovery Treatments
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
                      <p className="font-[var(--font-montserrat)] text-white/60 text-xs mb-2 line-clamp-1">
                        {treatment.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg text-gold">
                          ฿{treatment.price}
                        </span>
                        <Link
                          href={`/book?treatment=${treatment.id}`}
                          className="font-[var(--font-montserrat)] text-xs text-gold hover:text-gold-light transition-colors"
                        >
                          Book →
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
              <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-[0.3em] mb-4">
                WHY CHOOSE US
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
                What Makes Us <span className="text-gold">Different</span>
              </h2>
              <p className="font-[var(--font-montserrat)] text-charcoal/70">
                At Royal Wellness Spa, we don't just offer massages – we craft transformative experiences 
                that address the unique challenges of modern travelers and city dwellers.
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
                    <p className="font-[var(--font-montserrat)] text-sm text-charcoal/70 leading-relaxed">
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
                  <span className="font-[var(--font-montserrat)] text-white text-sm font-medium">
                    EXCLUSIVE OFFER
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
                  Royal Phuket City Hotel Guests Get <span className="font-semibold">10% OFF</span>
                </h2>
                <p className="font-[var(--font-montserrat)] text-white/90 mb-6 max-w-xl">
                  Staying at Royal Phuket City Hotel? Enjoy an exclusive 10% discount on all spa treatments. 
                  Simply present your room key or booking confirmation at reception.
                </p>
                <Link
                  href="/book"
                  className="inline-block bg-white text-gold hover:bg-cream font-[var(--font-montserrat)] text-sm px-8 py-3 transition-colors shadow-lg"
                >
                  Book With Hotel Discount
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Categories - Redesigned */}
        <section className="py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-[0.3em] mb-4">
                EXPLORE
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
                Treatment Categories
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categories.map((category, idx) => {
                const images = [
                  '/images/Royal Spa 5.jpg',
                  '/images/Royal Spa 6.jpg',
                  '/images/Royal Spa 7.jpg',
                  '/images/Royal Spa 8.jpg',
                  '/images/Royal Spa 9.jpg',
                  '/images/Royal Spa 10.jpg',
                ];
                const treatmentCount = getTreatmentsByCategory(category as typeof categories[number]).length;
                
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
                      <span className="font-[var(--font-montserrat)] text-gold text-xs tracking-wider mb-2">
                        {treatmentCount} TREATMENTS
                      </span>
                      <h3 className="font-display text-xl md:text-2xl text-white">
                        {category}
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
                <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-[0.3em] mb-4">
                  TESTIMONIALS
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
                  What Our Guests Say
                </h2>
                
                <div className="bg-cream p-8 rounded-sm mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal">Google</span>
                    <span className="font-[var(--font-montserrat)] text-xs text-charcoal/60">Reviews</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-display text-4xl text-charcoal">4.9</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="font-[var(--font-montserrat)] text-sm text-charcoal/60">
                    Based on 200+ reviews
                  </p>
                </div>

                <Link
                  href="https://google.com/maps"
                  target="_blank"
                  className="inline-flex items-center gap-2 font-[var(--font-montserrat)] text-sm text-gold hover:text-gold-dark transition-colors"
                >
                  See All Reviews on Google
                  <span className="text-lg">→</span>
                </Link>
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
                      <p className="font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-4 leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal">
                            {testimonial.name}
                          </p>
                          <p className="font-[var(--font-montserrat)] text-xs text-charcoal/50">
                            {testimonial.country}
                          </p>
                        </div>
                        <span className="font-[var(--font-montserrat)] text-xs text-charcoal/40">
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
            <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-[0.3em] mb-4">
              BEGIN YOUR JOURNEY
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              Ready to Experience True Relaxation?
            </h2>
            <p className="font-[var(--font-montserrat)] text-white/80 mb-10">
              Book your appointment today and discover the art of wellness at Royal Wellness Spa. 
              Your sanctuary of serenity awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="btn-luxury bg-gold hover:bg-gold-dark text-white font-[var(--font-montserrat)] text-sm px-12 py-4 tracking-widest inline-block"
              >
                BOOK YOUR ESCAPE
              </Link>
              <Link
                href="/treatments"
                className="border border-white/30 hover:border-gold hover:bg-gold/10 text-white font-[var(--font-montserrat)] text-sm px-12 py-4 tracking-widest inline-block transition-all"
              >
                VIEW TREATMENTS
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

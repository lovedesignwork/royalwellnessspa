import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { treatments, getTreatmentById, getTreatmentsByCategory, type Treatment } from '@/lib/spa-data';
import { Clock, Sparkles, ArrowRight, Check, Users, ChevronLeft, Star, ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return treatments.map((treatment) => ({
    id: treatment.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const treatment = getTreatmentById(parseInt(id));
  
  if (!treatment) {
    return { title: 'Treatment Not Found' };
  }

  return {
    title: `${treatment.name} | Royal Wellness Spa`,
    description: treatment.description,
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

export default async function TreatmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const treatment = getTreatmentById(parseInt(id));

  if (!treatment) {
    notFound();
  }

  const isSignature = treatment.notes.toLowerCase().includes('signature');
  const durationOptions = parseDurationOptions(treatment);
  const hasMultipleDurations = durationOptions.length > 1;
  
  const relatedTreatments = getTreatmentsByCategory(treatment.category as typeof treatments[0]['category'])
    .filter(t => t.id !== treatment.id)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section - Full bleed with header overlay */}
        <section className="relative h-[60vh] min-h-[500px]">
          <Image
            src={treatment.image.replace('w=600', 'w=1600')}
            alt={treatment.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" />
          
          {/* Back Button - positioned below header */}
          <Link 
            href="/treatments"
            className="absolute top-28 left-6 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors font-[var(--font-montserrat)] text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All Treatments
          </Link>

          {/* Badges - positioned below header */}
          <div className="absolute top-28 right-6 z-10 flex items-center gap-2">
            {isSignature && (
              <div className="bg-gold text-white text-sm font-[var(--font-montserrat)] px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Sparkles className="w-4 h-4" />
                SIGNATURE
              </div>
            )}
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
            <div className="max-w-7xl mx-auto">
              <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-wider mb-2">
                {treatment.category}
              </p>
              <h1 className="font-display text-4xl md:text-6xl text-white mb-4">
                {treatment.name}
              </h1>
              <p className="font-[var(--font-montserrat)] text-white/80 text-lg max-w-2xl">
                {treatment.description}
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
                    Duration & Pricing
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {durationOptions.map((option, index) => (
                      <div 
                        key={index}
                        className="border-2 border-cream rounded-xl p-5 text-center hover:border-gold/50 transition-colors"
                      >
                        <p className="font-[var(--font-montserrat)] text-charcoal/60 text-sm mb-1">
                          {option.duration}
                        </p>
                        <p className="font-display text-3xl text-gold">
                          ฿{option.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {treatment.notes && !treatment.notes.toLowerCase().includes('signature') && (
                    <p className="mt-4 font-[var(--font-montserrat)] text-sm text-charcoal/60 italic">
                      {treatment.notes}
                    </p>
                  )}
                </div>

                {/* What's Included */}
                <div className="bg-white rounded-2xl shadow-md p-8">
                  <h2 className="font-display text-2xl text-charcoal mb-6">
                    What's Included
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {treatment.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-gold" />
                        </div>
                        <span className="font-[var(--font-montserrat)] text-charcoal/80">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Treatment Flow */}
                {treatment.flow.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md p-8">
                    <h2 className="font-display text-2xl text-charcoal mb-6">
                      Treatment Flow
                    </h2>
                    
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-cream" />
                      
                      <div className="space-y-6">
                        {treatment.flow.map((step, index) => (
                          <div key={index} className="relative flex items-start gap-6 pl-12">
                            <div className="absolute left-0 w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center font-[var(--font-montserrat)] text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1 bg-cream/50 rounded-xl p-4">
                              <p className="font-[var(--font-montserrat)] text-charcoal">
                                {step}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ideal For */}
                {treatment.idealFor.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md p-8">
                    <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                      <Users className="w-6 h-6 text-gold" />
                      Ideal For
                    </h2>
                    
                    <div className="flex flex-wrap gap-3">
                      {treatment.idealFor.map((item, index) => (
                        <span 
                          key={index}
                          className="bg-cream text-charcoal font-[var(--font-montserrat)] text-sm px-4 py-2 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternate Names */}
                {treatment.alternateNames.length > 0 && (
                  <div className="bg-cream/50 rounded-2xl p-6">
                    <p className="font-[var(--font-montserrat)] text-sm text-charcoal/60">
                      <span className="font-medium text-charcoal">Also known as: </span>
                      {treatment.alternateNames.join(' • ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Sticky Booking Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-28">
                  <div className="bg-charcoal rounded-2xl shadow-xl p-8 text-white">
                    <h3 className="font-display text-2xl mb-2">
                      Ready to Book?
                    </h3>
                    <p className="font-[var(--font-montserrat)] text-white/70 text-sm mb-6">
                      Experience the {treatment.name} and restore your well-being.
                    </p>

                    <div className="border-t border-white/10 pt-6 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-[var(--font-montserrat)] text-white/70 text-sm">Starting from</span>
                        <span className="font-display text-3xl text-gold">
                          ฿{treatment.priceValue.toLocaleString()}
                        </span>
                      </div>
                      <p className="font-[var(--font-montserrat)] text-white/50 text-xs">
                        {treatment.duration}
                      </p>
                    </div>

                    <Link
                      href={`/book?treatment=${treatment.id}`}
                      className="block w-full text-center bg-gold hover:bg-gold-dark text-white font-[var(--font-montserrat)] py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-gold/30"
                    >
                      Book This Treatment
                    </Link>

                    {/* Hotel Guest Discount */}
                    <div className="mt-6 bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-gold" />
                        <span className="font-[var(--font-montserrat)] text-sm font-medium">
                          Hotel Guest Discount
                        </span>
                      </div>
                      <p className="font-[var(--font-montserrat)] text-white/60 text-xs">
                        Royal Phuket City Hotel guests receive 10% off all treatments.
                      </p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
                    <h4 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal mb-4">
                      Quick Info
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Category</span>
                        <span className="text-charcoal font-medium">{treatment.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Duration</span>
                        <span className="text-charcoal font-medium">{treatment.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Price Range</span>
                        <span className="text-charcoal font-medium">฿{treatment.price}</span>
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
                  More in {treatment.category}
                </h2>
                <p className="font-[var(--font-montserrat)] text-charcoal/60">
                  Explore other treatments you might enjoy
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedTreatments.map((related) => (
                  <Link
                    key={related.id}
                    href={`/treatments/${related.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-xl text-white">
                          {related.name}
                        </h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-charcoal/60">
                          <Clock className="w-4 h-4" />
                          <span className="font-[var(--font-montserrat)] text-sm">
                            {related.duration}
                          </span>
                        </div>
                        <span className="font-display text-xl text-gold">
                          ฿{related.price.split(' /')[0]}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/treatments"
                  className="inline-flex items-center gap-2 font-[var(--font-montserrat)] text-gold hover:text-gold-dark transition-colors"
                >
                  View All Treatments
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
              Experience True Relaxation
            </h2>
            <p className="font-[var(--font-montserrat)] text-white/70 mb-8 max-w-2xl mx-auto">
              Book your {treatment.name} today and let our expert therapists restore your body and mind.
            </p>
            <Link
              href={`/book?treatment=${treatment.id}`}
              className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-white font-[var(--font-montserrat)] px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-gold/30"
            >
              Book Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

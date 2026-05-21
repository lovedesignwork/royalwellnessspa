'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { treatments, categories, type Category, type Treatment } from '@/lib/spa-data';
import { Clock, Sparkles, Star, ArrowRight } from 'lucide-react';

const categoryDescriptions: Record<string, string> = {
  "Travel Recovery": "Restore your body after long journeys",
  "Skin & Radiance": "Reveal your natural glow",
  "Couple & Special": "Share wellness moments together",
  "Facial Treatments": "Rejuvenate and refresh your face",
  "Classic Thai Heritage": "Ancient techniques, timeless results",
  "Top-Up / Add-On": "Enhance your experience",
};

function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const hasMultipleDurations = treatment.duration.includes('/');

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <Link href={`/treatments/${treatment.id}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={treatment.image}
            alt={treatment.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {treatment.isSignature && (
            <div className="absolute top-4 right-4 bg-gold text-white text-xs font-body px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3 h-3" />
              SIGNATURE
            </div>
          )}

          {treatment.isCouple && (
            <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-body px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Star className="w-3 h-3" />
              COUPLE
            </div>
          )}

          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-charcoal text-xs font-body px-3 py-1 rounded-full">
              {treatment.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <h3 className="font-display text-xl text-white drop-shadow-lg">
                {treatment.name}
              </h3>
              <span className="bg-gold text-white font-display text-lg px-3 py-1 rounded-lg shadow-lg">
                {treatment.price.split(' /')[0]}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-sm text-charcoal/60 font-body">
            <Clock className="w-4 h-4 text-gold" />
            <span>{treatment.duration}</span>
          </div>
          {hasMultipleDurations && (
            <span className="bg-gold/10 text-gold text-[10px] font-body px-2 py-0.5 rounded-full">
              Multiple options
            </span>
          )}
          {treatment.priceNote && (
            <span className="bg-rose-500/10 text-rose-500 text-[10px] font-body px-2 py-0.5 rounded-full">
              {treatment.priceNote}
            </span>
          )}
        </div>

        <Link href={`/treatments/${treatment.id}`}>
          <p className="font-body text-sm text-charcoal/70 mb-4 line-clamp-2 hover:text-charcoal transition-colors">
            {treatment.description}
          </p>
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {treatment.highlights.slice(0, 3).map((highlight, idx) => (
            <span
              key={idx}
              className="text-[10px] font-body bg-cream text-charcoal/60 px-2 py-0.5 rounded-full"
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/treatments/${treatment.id}`}
            className="flex-1 text-center border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-body text-sm py-2.5 rounded-xl transition-all"
          >
            Learn More
          </Link>
          <Link
            href={`/book?treatment=${treatment.id}`}
            className="flex-1 text-center bg-gold hover:bg-gold-dark text-white font-body text-sm py-2.5 rounded-xl transition-all"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function TreatmentsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    (categoryParam as Category) || 'all'
  );

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam as Category)) {
      setSelectedCategory(categoryParam as Category);
    }
  }, [categoryParam]);

  const filteredTreatments = treatments.filter((t) => {
    return selectedCategory === 'all' || t.category === selectedCategory;
  });

  const treatmentsByCategory = categories.reduce((acc, category) => {
    acc[category] = treatments.filter(t => t.category === category);
    return acc;
  }, {} as Record<Category, Treatment[]>);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-charcoal" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="font-body text-sm tracking-wide">
                  {treatments.length} Premium Treatments
                </span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl text-white mb-6">
                Our <span className="text-gold italic">Spa Menu</span>
              </h1>
              
              <p className="font-body text-white/70 max-w-2xl mx-auto text-lg">
                Discover our curated collection of treatments, each designed to restore 
                balance and bring harmony to your body and mind.
              </p>
            </div>
          </div>
        </section>

        {/* Category Pills */}
        <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-cream shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full font-body text-xs transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gold text-white'
                    : 'bg-cream text-charcoal hover:bg-gold/20'
                }`}
              >
                All ({treatments.length})
              </button>
              
              {categories.filter(c => c !== "Top-Up / Add-On").map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full font-body text-xs transition-all ${
                    selectedCategory === category
                      ? 'bg-gold text-white'
                      : 'bg-cream text-charcoal hover:bg-gold/20'
                  }`}
                >
                  {category} ({treatmentsByCategory[category]?.length || 0})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Category Header (when filtered) */}
        {selectedCategory !== 'all' && (
          <section className="bg-gradient-to-r from-cream to-white py-8 border-b border-cream">
            <div className="max-w-7xl mx-auto px-6">
              <div>
                <h2 className="font-display text-3xl text-charcoal">
                  {selectedCategory}
                </h2>
                <p className="font-body text-sm text-charcoal/60">
                  {categoryDescriptions[selectedCategory]}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Treatments Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTreatments.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Categories (when showing all) */}
        {selectedCategory === 'all' && (
          <section className="py-16 bg-charcoal">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
                  Browse by Category
                </h2>
                <p className="font-body text-white/60">
                  Find the perfect treatment for your needs
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.filter(c => c !== "Top-Up / Add-On").map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/50 rounded-2xl p-6 text-center transition-all hover:scale-105"
                  >
                    <h3 className="font-display text-lg text-white group-hover:text-gold transition-colors mb-1">
                      {category}
                    </h3>
                    <p className="font-body text-xs text-white/50">
                      {treatmentsByCategory[category]?.length || 0} treatments
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-cream via-white to-cream">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4" />
              <span className="font-body text-sm">Special Offer</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
              Royal Phuket City Hotel Guests
            </h2>
            
            <p className="font-body text-charcoal/70 text-lg mb-8 max-w-2xl mx-auto">
              Enjoy an exclusive <span className="text-gold font-semibold">10% discount</span> on all 
              treatments when you stay at Royal Phuket City Hotel.
            </p>
            
            <Link
              href="/book"
              className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-white font-body text-lg px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-gold/30 hover:gap-4"
            >
              Book Your Treatment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function TreatmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-charcoal/60">Loading treatments...</p>
        </div>
      </div>
    }>
      <TreatmentsContent />
    </Suspense>
  );
}

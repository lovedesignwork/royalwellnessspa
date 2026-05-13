import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Award, Heart, Leaf, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-16 bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
              ABOUT US
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-white mb-6">
              Our Story
            </h1>
            <p className="font-body text-white/70 max-w-2xl mx-auto">
              Discover the passion and expertise behind Royal Wellness Spa
            </p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
                  3RD FLOOR • PHUKET
                </p>
                <h2 className="font-display text-4xl text-charcoal mb-6">
                  A Sanctuary of Serenity
                </h2>
                <p className="font-body text-charcoal/70 leading-relaxed mb-6">
                  Indulge in a tranquil spa experience designed to restore balance to both body and mind. With expert massage techniques and premium aromatic oils, our spa offers a serene escape that leaves you feeling refreshed, relaxed, and completely renewed.
                </p>
                <p className="font-body text-charcoal/70 leading-relaxed mb-6">
                  Located in the heart of Phuket, Royal Wellness Spa combines traditional Thai healing arts with modern wellness practices. Our team of certified therapists brings years of expertise and a genuine passion for helping guests achieve total relaxation.
                </p>
                <p className="font-body text-charcoal/70 leading-relaxed">
                  Whether you are a weary traveler seeking recovery from jet lag, a digital nomad needing relief from screen fatigue, or simply looking for a luxurious escape, we have crafted treatments specifically for your needs.
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
                    10AM
                  </span>
                  <span className="font-body text-white/80 text-sm">
                    to 11PM Daily
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
                Why Choose Us
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Award,
                  title: 'Certified Experts',
                  desc: 'Our therapists are trained and certified in traditional Thai and modern massage techniques.',
                },
                {
                  icon: Heart,
                  title: 'Premium Products',
                  desc: 'We use only the finest aromatic oils and natural ingredients for all our treatments.',
                },
                {
                  icon: Leaf,
                  title: 'Holistic Approach',
                  desc: 'We treat the whole person, addressing both physical tension and mental stress.',
                },
                {
                  icon: Users,
                  title: 'Personalized Care',
                  desc: 'Every treatment is customized to meet your specific needs and preferences.',
                },
              ].map((item, idx) => (
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
              Experience True Relaxation
            </h2>
            <p className="font-body text-white/80 mb-10">
              Book your appointment today and let us guide you on a journey to wellness.
            </p>
            <Link
              href="/book"
              className="btn-luxury bg-gold hover:bg-gold-dark text-white font-body text-sm px-12 py-4 tracking-widest inline-block"
            >
              BOOK NOW
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

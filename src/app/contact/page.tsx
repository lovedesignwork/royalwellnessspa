'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-16 bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-body text-gold text-sm tracking-[0.3em] mb-4">
              GET IN TOUCH
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-white mb-6">
              Contact Us
            </h1>
            <p className="font-body text-white/70 max-w-2xl mx-auto">
              We would love to hear from you. Reach out with any questions or to book your spa experience.
            </p>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="font-display text-3xl text-charcoal mb-8">
                  Visit Us
                </h2>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-medium text-charcoal mb-1">
                        Location
                      </h3>
                      <p className="font-body text-sm text-charcoal/70">
                        Royal Wellness Spa<br />
                        3rd Floor, Royal Phuket City Hotel<br />
                        Phuket, Thailand
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-medium text-charcoal mb-1">
                        Phone
                      </h3>
                      <a href="tel:+66905969666" className="font-body text-sm text-charcoal/70 hover:text-gold transition-colors">
                        090-596-9666
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-medium text-charcoal mb-1">
                        WhatsApp
                      </h3>
                      <a href="https://wa.me/66905969666" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-charcoal/70 hover:text-gold transition-colors">
                        090-596-9666
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-medium text-charcoal mb-1">
                        LINE
                      </h3>
                      <a href="https://lin.ee/En1ToHH" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-charcoal/70 hover:text-gold transition-colors">
                        @royalwellnessspa
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-medium text-charcoal mb-1">
                        Email
                      </h3>
                      <a href="mailto:wallop.c@royalwellnessspaphuket.com" className="font-body text-sm text-charcoal/70 hover:text-gold transition-colors">
                        wallop.c@royalwellnessspaphuket.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-medium text-charcoal mb-1">
                        Opening Hours
                      </h3>
                      <p className="font-body text-sm text-charcoal/70">
                        Open Daily: 10:00 AM – 10:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-cream p-8">
                  <h3 className="font-display text-xl text-charcoal mb-4">
                    Quick Booking
                  </h3>
                  <p className="font-body text-sm text-charcoal/70 mb-4">
                    Ready to book your spa experience? Use our online booking system for instant confirmation.
                  </p>
                  <a
                    href="/book"
                    className="btn-luxury bg-gold hover:bg-gold-dark text-white font-body text-sm px-8 py-3 inline-block"
                  >
                    Book Online
                  </a>
                </div>
              </div>

              <div className="bg-white p-8 border border-cream">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-display text-2xl text-charcoal mb-4">
                      Message Sent!
                    </h3>
                    <p className="font-body text-sm text-charcoal/70">
                      Thank you for reaching out. We will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-3xl text-charcoal mb-8">
                      Send a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-body text-sm text-charcoal/70 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full p-3 border border-cream font-body text-sm"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block font-body text-sm text-charcoal/70 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="w-full p-3 border border-cream font-body text-sm"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-body text-sm text-charcoal/70 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            className="w-full p-3 border border-cream font-body text-sm"
                            placeholder="+66 XX XXX XXXX"
                          />
                        </div>
                        <div>
                          <label className="block font-body text-sm text-charcoal/70 mb-2">
                            Subject
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, subject: e.target.value }))
                            }
                            className="w-full p-3 border border-cream font-body text-sm"
                            placeholder="How can we help?"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-body text-sm text-charcoal/70 mb-2">
                          Message
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, message: e.target.value }))
                          }
                          className="w-full p-3 border border-cream font-body text-sm h-32 resize-none"
                          placeholder="Your message..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-luxury bg-gold hover:bg-gold-dark disabled:bg-charcoal/30 text-white font-body text-sm px-8 py-3 w-full flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin">⟳</span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

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
            <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-[0.3em] mb-4">
              GET IN TOUCH
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-white mb-6">
              Contact Us
            </h1>
            <p className="font-[var(--font-montserrat)] text-white/70 max-w-2xl mx-auto">
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
                      <h3 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal mb-1">
                        Location
                      </h3>
                      <p className="font-[var(--font-montserrat)] text-sm text-charcoal/70">
                        3rd Floor<br />
                        Phuket, Thailand
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal mb-1">
                        Phone
                      </h3>
                      <p className="font-[var(--font-montserrat)] text-sm text-charcoal/70">
                        +66 XX XXX XXXX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal mb-1">
                        Email
                      </h3>
                      <p className="font-[var(--font-montserrat)] text-sm text-charcoal/70">
                        info@royalwellnessspa.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal mb-1">
                        Opening Hours
                      </h3>
                      <p className="font-[var(--font-montserrat)] text-sm text-charcoal/70">
                        Open Daily: 10AM - 11PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-cream p-8">
                  <h3 className="font-display text-xl text-charcoal mb-4">
                    Quick Booking
                  </h3>
                  <p className="font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-4">
                    Ready to book your spa experience? Use our online booking system for instant confirmation.
                  </p>
                  <a
                    href="/book"
                    className="btn-luxury bg-gold hover:bg-gold-dark text-white font-[var(--font-montserrat)] text-sm px-8 py-3 inline-block"
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
                    <p className="font-[var(--font-montserrat)] text-sm text-charcoal/70">
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
                          <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full p-3 border border-cream font-[var(--font-montserrat)] text-sm"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="w-full p-3 border border-cream font-[var(--font-montserrat)] text-sm"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            className="w-full p-3 border border-cream font-[var(--font-montserrat)] text-sm"
                            placeholder="+66 XX XXX XXXX"
                          />
                        </div>
                        <div>
                          <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                            Subject
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, subject: e.target.value }))
                            }
                            className="w-full p-3 border border-cream font-[var(--font-montserrat)] text-sm"
                            placeholder="How can we help?"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                          Message
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, message: e.target.value }))
                          }
                          className="w-full p-3 border border-cream font-[var(--font-montserrat)] text-sm h-32 resize-none"
                          placeholder="Your message..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-luxury bg-gold hover:bg-gold-dark disabled:bg-charcoal/30 text-white font-[var(--font-montserrat)] text-sm px-8 py-3 w-full flex items-center justify-center gap-2"
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

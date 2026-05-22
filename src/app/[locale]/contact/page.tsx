'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CountryPhoneSelector from '@/components/CountryPhoneSelector';
import { MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const INQUIRY_TYPES_KEYS = [
  "inquiryGeneral",
  "inquirySpa",
  "inquiryGroup",
  "inquiryWedding",
  "inquiryCorporate",
  "inquiryPartnership",
  "inquiryFeedback",
  "inquiryOther",
] as const;

const INQUIRY_TYPES_EN = [
  "General Inquiry",
  "Spa Treatment Question",
  "Group Booking",
  "Wedding & Special Occasions",
  "Corporate Wellness",
  "Partnership",
  "Feedback & Suggestions",
  "Other",
] as const;

type InquiryType = typeof INQUIRY_TYPES_EN[number];

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    inquiryType: 'General Inquiry',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [error, setError] = useState('');
  const [formLoadedAt] = useState(() => Date.now());
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _ts: formLoadedAt,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setReferenceNumber(data.referenceNumber || '');
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-charcoal relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/Royal Spa 1.jpg')" }}
            />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-gold" />
              <span className="font-body text-gold text-xs tracking-[0.4em]">{t('subtitle')}</span>
              <span className="w-12 h-px bg-gold" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              {t('title')} <em className="italic text-gold">{t('titleHighlight')}</em>
              <br />
              <span className="text-gold">{t('titleEnd')}</span>
            </h1>
            <p className="font-body text-xs text-white/50 tracking-[0.3em] uppercase mb-6">
              {t('tagline')}
            </p>
            <p className="font-display italic text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20 bg-cream/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 items-start">
              {/* Sidebar */}
              <aside className="lg:sticky lg:top-32 lg:pr-8 lg:border-r lg:border-cream">
                <p className="font-body text-gold text-xs tracking-[0.3em] mb-4">
                  {t('directLines')}
                </p>
                <h3 className="font-display italic text-3xl text-charcoal mb-8">
                  {t('reachUs')}
                </h3>
                
                <div className="space-y-6 mb-8">
                  <ContactDetail 
                    label={t('emailLabel')} 
                    value="wallop.c@royalwellnessspaphuket.com" 
                    href="mailto:wallop.c@royalwellnessspaphuket.com"
                  />
                  <ContactDetail 
                    label={t('phoneLabel')} 
                    value="090-596-9666" 
                    href="tel:+66905969666"
                  />
                  <ContactDetail 
                    label={t('whatsappLabel')} 
                    value="090-596-9666" 
                    href="https://wa.me/66905969666"
                  />
                  <ContactDetail 
                    label={t('lineLabel')} 
                    value="@royalwellnessspa" 
                    href="https://lin.ee/En1ToHH"
                  />
                  <ContactDetail 
                    label={t('hoursLabel')} 
                    value={t('hoursValue')}
                  />
                  <ContactDetail 
                    label={t('addressLabel')} 
                    value={t('addressValue')}
                  />
                </div>

                <p className="font-body text-sm text-charcoal/60 leading-relaxed">
                  {t('bookingNote').split('online booking system')[0]}
                  <Link href="/book" className="text-gold underline underline-offset-2 hover:text-gold-dark">
                    {tCommon('bookNow').toLowerCase()}
                  </Link>
                  {t('bookingNote').split('online booking system')[1]}
                </p>
              </aside>

              {/* Form */}
              <div className="bg-white p-8 md:p-12 border border-cream">
                {submitted ? (
                  <div ref={successRef} className="text-center py-16">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <p className="font-body text-gold text-xs tracking-[0.3em] mb-4">
                      {t('successTitle').toUpperCase()}
                    </p>
                    <h3 className="font-display text-3xl md:text-4xl text-charcoal mb-4">
                      {t('successTitle')}
                    </h3>
                    <p className="font-body text-charcoal/70 max-w-md mx-auto mb-6">
                      {t('successDesc')}
                    </p>
                    {referenceNumber && (
                      <div className="inline-block bg-cream px-6 py-4 mb-8">
                        <p className="font-body text-xs text-charcoal/60 mb-1">{t('referenceNumber')}</p>
                        <p className="font-display text-xl text-gold">{referenceNumber}</p>
                      </div>
                    )}
                    <div className="flex gap-4 justify-center flex-wrap">
                      <Link 
                        href="/" 
                        className="font-body text-sm px-6 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors"
                      >
                        {t('backToHome')}
                      </Link>
                      <button 
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            country: '',
                            inquiryType: 'General Inquiry',
                            subject: '',
                            message: '',
                          });
                        }}
                        className="font-body text-sm px-6 py-3 bg-gold text-white hover:bg-gold-dark transition-colors"
                      >
                        {t('sendAnother')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Honeypot */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      className="absolute left-[-10000px] w-px h-px opacity-0"
                    />

                    {/* Section 01 - Inquiry */}
                    <FormSection number="01" title={t('step1Label').split(' — ')[1] || 'INQUIRY'} subtitle={t('step1Title')}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label={t('inquiryType')}>
                          <select
                            value={formData.inquiryType}
                            onChange={(e) => setFormData(prev => ({ ...prev, inquiryType: e.target.value as typeof INQUIRY_TYPES_EN[number] }))}
                            className="w-full p-3 bg-white border border-cream font-body text-sm text-charcoal outline-none focus:border-gold appearance-none cursor-pointer"
                          >
                            {INQUIRY_TYPES_KEYS.map((key, idx) => (
                              <option key={key} value={INQUIRY_TYPES_EN[idx]}>{t(key)}</option>
                            ))}
                          </select>
                        </FormField>
                        <FormField label={t('subjectLabel')} hint={t('subjectOptional')}>
                          <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="e.g. Group booking for 6 guests"
                            className="w-full p-3 bg-white border border-cream font-body text-sm text-charcoal outline-none focus:border-gold"
                          />
                        </FormField>
                      </div>
                    </FormSection>

                    {/* Section 02 - Contact Info */}
                    <FormSection number="02" title={t('step2Label').split(' — ')[1] || 'YOU'} subtitle={t('step2Title')}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label={t('fullName')} required>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Mr. or Ms. ___"
                            autoComplete="name"
                            className="w-full p-3 bg-white border border-cream font-body text-sm text-charcoal outline-none focus:border-gold"
                          />
                        </FormField>
                        <FormField label={t('email')} required>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="you@example.com"
                            autoComplete="email"
                            className="w-full p-3 bg-white border border-cream font-body text-sm text-charcoal outline-none focus:border-gold"
                          />
                        </FormField>
                        <FormField label={t('phone')}>
                          <CountryPhoneSelector
                            name="phone"
                            defaultCountry="TH"
                            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                          />
                        </FormField>
                        <FormField label={t('country')} hint={t('countryOptional')}>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                            placeholder="Thailand, Australia, Japan..."
                            autoComplete="country-name"
                            className="w-full p-3 bg-white border border-cream font-body text-sm text-charcoal outline-none focus:border-gold"
                          />
                        </FormField>
                      </div>
                    </FormSection>

                    {/* Section 03 - Message */}
                    <FormSection number="03" title={t('step3Label').split(' — ')[1] || 'MESSAGE'} subtitle={t('step3Title')}>
                      <FormField 
                        label={t('message')} 
                        required
                        hint={t('messagePlaceholder')}
                      >
                        <textarea
                          required
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Hello Royal Wellness team,&#10;&#10;I am writing to enquire about..."
                          className="w-full p-3 bg-white border border-cream font-body text-sm text-charcoal outline-none focus:border-gold resize-y min-h-[150px]"
                        />
                      </FormField>
                    </FormSection>

                    {/* Submit */}
                    <div className="mt-12 pt-8 border-t border-cream">
                      {error && (
                        <div className="bg-red-50 border-l-2 border-red-400 px-4 py-3 mb-6">
                          <p className="font-body text-sm text-red-600">{error}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <p className="font-body text-xs text-charcoal/50 max-w-sm leading-relaxed">
                          {t('submitConsent')}
                        </p>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark disabled:bg-charcoal/30 text-white font-body text-sm px-10 py-4 transition-colors min-w-[200px]"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin">⟳</span>
                              {t('sending')}
                            </>
                          ) : (
                            <>
                              {t('sendMessage')}
                              <Send className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-body text-gold text-xs tracking-[0.3em] mb-4">
                  {t('findUs')}
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
                  {t('visitSanctuary')}
                </h2>
                <p className="font-body text-charcoal/70 mb-8 leading-relaxed">
                  {t('visitDesc')}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://maps.google.com/?q=Royal+Phuket+City+Hotel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-body text-sm px-6 py-3 bg-charcoal text-white hover:bg-charcoal/80 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    {t('getDirections')}
                  </a>
                  <a
                    href="tel:+66905969666"
                    className="flex items-center gap-2 font-body text-sm px-6 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {tCommon('callUs')}
                  </a>
                </div>
              </div>
              
              <div className="aspect-video bg-cream overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0123456789!2d98.3866!3d7.8845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRoyal%20Phuket%20City%20Hotel!5e0!3m2!1sen!2sth!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Royal Wellness Spa Location"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ContactDetail({ 
  label, 
  value, 
  href 
}: { 
  label: string; 
  value: string; 
  href?: string;
}) {
  const valueElement = (
    <span className="font-body text-sm text-charcoal whitespace-pre-line leading-relaxed">
      {value}
    </span>
  );

  return (
    <div>
      <div className="font-body text-xs tracking-[0.2em] text-gold uppercase mb-1.5">
        {label}
      </div>
      {href ? (
        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="hover:text-gold transition-colors">
          {valueElement}
        </a>
      ) : (
        valueElement
      )}
    </div>
  );
}

function FormSection({ 
  number, 
  title, 
  subtitle, 
  children 
}: { 
  number: string; 
  title: string; 
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-10 mb-10 border-b border-cream">
      <div className="mb-8">
        <p className="font-body text-gold text-xs tracking-[0.3em] mb-3">
          {number} — {title.toUpperCase()}
        </p>
        <h3 className="font-display italic text-2xl md:text-3xl text-charcoal">
          {subtitle}
        </h3>
      </div>
      {children}
    </div>
  );
}

function FormField({ 
  label, 
  hint, 
  required, 
  children 
}: { 
  label: string; 
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="font-body text-xs tracking-[0.2em] text-charcoal/70 uppercase">
          {label}
          {required && <span className="text-gold ml-1">*</span>}
        </label>
      </div>
      {children}
      {hint && (
        <p className="mt-2 font-body text-xs text-charcoal/50">{hint}</p>
      )}
    </div>
  );
}

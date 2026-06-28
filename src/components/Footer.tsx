'use client';

import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Image
              src="/Logo-Royal-Spa.png"
              alt="Royal Wellness Spa"
              width={180}
              height={60}
              className="h-14 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-white/70 font-body text-sm leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold mb-6 text-gold">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  href="/treatments"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  {tNav('treatments')}
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  {tNav('home') === 'Home' ? 'Book Appointment' : 'จองนัดหมาย'}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold mb-6 text-gold">
              {t('contactInfo')}
            </h4>
            <ul className="space-y-4 font-body text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span>3rd Floor, Royal Phuket City Hotel<br />Phuket, Thailand</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+66905969666" className="hover:text-gold transition-colors">
                  090-596-9666
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a href="https://wa.me/66905969666" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  WhatsApp: 090-596-9666
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-gold flex-shrink-0" />
                <a 
                  href="https://lin.ee/En1ToHH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  LINE: @royalwellnessspa
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{t('openDaily')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold mb-6 text-gold">
              {tNav('home') === 'Home' ? 'Follow Us' : 'ติดตามเรา'}
            </h4>
            <div className="flex gap-4 mb-8">
              <a
                href="#"
                className="w-10 h-10 border border-gold/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/royalwellnessspaphuket"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gold/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://lin.ee/En1ToHH"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gold/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <p className="font-body text-sm text-white/70">
              {tNav('home') === 'Home' 
                ? 'Subscribe to our newsletter for exclusive offers and wellness tips.'
                : 'สมัครรับจดหมายข่าวเพื่อรับข้อเสนอพิเศษและเคล็ดลับสุขภาพ'}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-white/50">
            © 2026 Royal Wellness Spa. {t('copyright')}
          </p>
          <div className="flex gap-6 font-body text-xs text-white/50">
            <Link href="/privacy" className="hover:text-gold transition-colors">
              {tNav('home') === 'Home' ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว'}
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              {tNav('home') === 'Home' ? 'Terms of Service' : 'ข้อกำหนดการใช้บริการ'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

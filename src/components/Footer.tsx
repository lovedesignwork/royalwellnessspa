import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
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
              Indulge in a tranquil spa experience designed to restore balance
              to both body and mind.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold mb-6 text-gold">
              Quick Links
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  href="/treatments"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  Our Treatments
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold mb-6 text-gold">
              Contact Info
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
                <span>Daily 10:00 – 22:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold mb-6 text-gold">
              Follow Us
            </h4>
            <div className="flex gap-4 mb-8">
              <a
                href="#"
                className="w-10 h-10 border border-gold/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
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
              Subscribe to our newsletter for exclusive offers and wellness tips.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-white/50">
            © 2026 Royal Wellness Spa. All rights reserved.
          </p>
          <div className="flex gap-6 font-body text-xs text-white/50">
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-display text-3xl font-semibold mb-2">
              ROYAL WELLNESS
            </h3>
            <p className="text-gold text-sm tracking-[0.3em] mb-6">SPA</p>
            <p className="text-white/70 font-[var(--font-montserrat)] text-sm leading-relaxed">
              Indulge in a tranquil spa experience designed to restore balance
              to both body and mind.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold mb-6 text-gold">
              Quick Links
            </h4>
            <ul className="space-y-3 font-[var(--font-montserrat)] text-sm">
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
            <ul className="space-y-4 font-[var(--font-montserrat)] text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span>3rd Floor, Phuket, Thailand</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+66 XX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>info@royalwellnessspa.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Open Daily: 10AM - 11PM</span>
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
            </div>
            <p className="font-[var(--font-montserrat)] text-sm text-white/70">
              Subscribe to our newsletter for exclusive offers and wellness tips.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-[var(--font-montserrat)] text-xs text-white/50">
            © 2026 Royal Wellness Spa. All rights reserved.
          </p>
          <div className="flex gap-6 font-[var(--font-montserrat)] text-xs text-white/50">
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

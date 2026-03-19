'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, Phone } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/treatments', label: 'Treatments' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Main Header */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'top-0 bg-white/95 backdrop-blur-md shadow-lg py-3'
            : 'top-0 bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                isScrolled ? 'bg-gold' : 'bg-white/10 backdrop-blur-sm border border-white/20'
              }`}>
                <span className={`font-display text-xl font-bold ${
                  isScrolled ? 'text-white' : 'text-gold'
                }`}>
                  R
                </span>
              </div>
              <div className="hidden sm:block">
                <span
                  className={`font-display text-lg font-semibold tracking-wide block leading-tight transition-colors ${
                    isScrolled ? 'text-charcoal' : 'text-white'
                  }`}
                >
                  ROYAL WELLNESS
                </span>
                <span
                  className={`text-[10px] tracking-[0.25em] font-[var(--font-montserrat)] transition-colors ${
                    isScrolled ? 'text-gold' : 'text-gold-light'
                  }`}
                >
                  SPA & MASSAGE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className={`flex items-center rounded-full px-2 py-1 transition-all duration-300 ${
                isScrolled ? 'bg-cream/50' : 'bg-white/10 backdrop-blur-sm'
              }`}>
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative font-[var(--font-montserrat)] text-sm px-5 py-2 rounded-full transition-all duration-300 ${
                      isScrolled
                        ? 'text-charcoal hover:text-gold hover:bg-gold/10'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    } ${idx === 0 && !isScrolled ? 'bg-white/10' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/book"
                className={`group relative overflow-hidden font-[var(--font-montserrat)] text-sm px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
                  isScrolled
                    ? 'bg-gold text-white hover:bg-gold-dark'
                    : 'bg-white text-charcoal hover:bg-gold hover:text-white'
                }`}
              >
                <span className="relative z-10">Book Now</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isScrolled 
                  ? 'text-charcoal hover:bg-cream' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-charcoal/90 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="font-display text-white text-lg font-bold">R</span>
                </div>
                <div>
                  <span className="font-display text-charcoal text-sm font-semibold block">
                    ROYAL WELLNESS
                  </span>
                  <span className="text-[9px] tracking-[0.2em] font-[var(--font-montserrat)] text-gold">
                    SPA & MASSAGE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-cream text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-6 py-4 font-[var(--font-montserrat)] text-charcoal hover:bg-cream hover:text-gold transition-colors group"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span className="text-lg">{link.label}</span>
                  <ChevronRight className="w-5 h-5 text-charcoal/30 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Footer */}
            <div className="p-6 border-t border-cream bg-cream/30">
              <Link
                href="/book"
                className="block w-full bg-gold hover:bg-gold-dark text-white font-[var(--font-montserrat)] text-center py-4 rounded-full transition-colors mb-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Your Escape
              </Link>
              
              <div className="flex items-center justify-center gap-4 text-sm">
                <a 
                  href="tel:+66XXXXXXXX" 
                  className="flex items-center gap-2 text-charcoal/60 hover:text-gold transition-colors font-[var(--font-montserrat)]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
                <span className="text-charcoal/30">|</span>
                <span className="flex items-center gap-2 text-charcoal/60 font-[var(--font-montserrat)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>Open Now</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

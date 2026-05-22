'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import { Menu, X, ChevronRight, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/treatments', label: t('treatments') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
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
            <Link href="/" className="group flex items-center">
              <Image
                src="/Logo-Royal-Spa.png"
                alt="Royal Wellness Spa"
                width={180}
                height={60}
                className={`h-12 w-auto transition-all duration-300 ${
                  isScrolled ? '' : 'brightness-0 invert'
                }`}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className={`flex items-center rounded-full px-2 py-1 transition-all duration-300 ${
                isScrolled ? 'bg-cream/50' : 'bg-white/10 backdrop-blur-sm'
              }`}>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative font-body text-sm px-5 py-2 rounded-full transition-all duration-300 ${
                        isScrolled
                          ? `text-charcoal hover:text-gold hover:bg-gold/10 ${isActive ? 'bg-gold/10 text-gold' : ''}`
                          : `text-white/90 hover:text-white hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Language Switcher & CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher isScrolled={isScrolled} />
              <Link
                href="/book"
                className={`group relative overflow-hidden font-body text-sm px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
                  isScrolled
                    ? 'bg-gold text-white hover:bg-gold-dark'
                    : 'bg-white text-charcoal hover:bg-gold hover:text-white'
                }`}
              >
                <span className="relative z-10">{tCommon('bookNow')}</span>
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
              <Image
                src="/Logo-Royal-Spa.png"
                alt="Royal Wellness Spa"
                width={140}
                height={47}
                className="h-10 w-auto"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-cream text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-6 py-4 font-body transition-colors group ${
                      isActive 
                        ? 'bg-gold/10 text-gold border-l-4 border-gold' 
                        : 'text-charcoal hover:bg-cream hover:text-gold'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <span className="text-lg">{link.label}</span>
                    <ChevronRight className={`w-5 h-5 transition-all ${
                      isActive ? 'text-gold' : 'text-charcoal/30 group-hover:text-gold group-hover:translate-x-1'
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Footer */}
            <div className="p-6 border-t border-cream bg-cream/30">
              <div className="flex justify-center mb-4">
                <LanguageSwitcher isScrolled={true} />
              </div>
              <Link
                href="/book"
                className="block w-full bg-gold hover:bg-gold-dark text-white font-body text-center py-4 rounded-full transition-colors mb-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {tCommon('bookYourEscape')}
              </Link>
              
              <div className="flex items-center justify-center gap-4 text-sm">
                <a 
                  href="tel:090-596-9666" 
                  className="flex items-center gap-2 text-charcoal/60 hover:text-gold transition-colors font-body"
                >
                  <Phone className="w-4 h-4" />
                  <span>{tCommon('callUs')}</span>
                </a>
                <span className="text-charcoal/30">|</span>
                <span className="flex items-center gap-2 text-charcoal/60 font-body">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>{tCommon('openNow')}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

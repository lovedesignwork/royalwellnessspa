'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { treatments, getTreatmentById, categories, type Treatment } from '@/lib/spa-data';
import { Calendar, Clock, User, Phone, Mail, ChevronRight, Check, CreditCard, Sparkles, Search, Plus, Trash2, Users, ShoppingBag, X } from 'lucide-react';
import { format, addDays } from 'date-fns';

type BookingStep = 'treatment' | 'details' | 'confirmation';

interface DurationOption {
  duration: string;
  price: number;
}

interface GuestBooking {
  id: string;
  guestName: string;
  treatment: Treatment | null;
  selectedDuration: string;
  selectedPrice: number;
}

interface BookingData {
  guests: GuestBooking[];
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  isHotelGuest: boolean;
}

function parseDurationOptions(treatment: Treatment): DurationOption[] {
  const durations = treatment.duration.split(' / ').map(d => d.trim());
  const prices = treatment.price.split(' / ').map(p => {
    const numStr = p.replace(/,/g, '').replace(/[^\d]/g, '');
    return parseInt(numStr) || 0;
  });
  
  return durations.map((duration, index) => ({
    duration,
    price: prices[index] || prices[0] || treatment.priceValue,
  }));
}

function hasDurationOptions(treatment: Treatment): boolean {
  return treatment.duration.includes('/');
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const treatmentId = searchParams.get('treatment');

  const [currentStep, setCurrentStep] = useState<BookingStep>('treatment');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeGuestId, setActiveGuestId] = useState<string>('guest-1');
  const [showCart, setShowCart] = useState(false);
  const [durationModal, setDurationModal] = useState<{ treatment: Treatment; guestId: string } | null>(null);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    guests: [{ id: 'guest-1', guestName: 'Guest 1', treatment: null, selectedDuration: '', selectedPrice: 0 }],
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    isHotelGuest: false,
  });

  useEffect(() => {
    if (treatmentId) {
      const treatment = getTreatmentById(parseInt(treatmentId));
      if (treatment) {
        if (hasDurationOptions(treatment)) {
          setDurationModal({ treatment, guestId: 'guest-1' });
        } else {
          setBookingData((prev) => ({
            ...prev,
            guests: [{ 
              id: 'guest-1', 
              guestName: 'Guest 1', 
              treatment,
              selectedDuration: treatment.duration,
              selectedPrice: treatment.priceValue
            }],
          }));
          setShowCart(true);
        }
      }
    }
  }, [treatmentId]);

  const steps: { id: BookingStep; label: string }[] = [
    { id: 'treatment', label: 'Treatments & Time' },
    { id: 'details', label: 'Details & Payment' },
    { id: 'confirmation', label: 'Confirmed' },
  ];

  const availableTimes = [
    '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
  ];

  const availableDates = Array.from({ length: 14 }, (_, i) =>
    format(addDays(new Date(), i + 1), 'yyyy-MM-dd')
  );

  const addGuest = () => {
    const newGuestId = `guest-${bookingData.guests.length + 1}`;
    setBookingData((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        { id: newGuestId, guestName: `Guest ${prev.guests.length + 1}`, treatment: null, selectedDuration: '', selectedPrice: 0 },
      ],
    }));
    setActiveGuestId(newGuestId);
  };

  const removeGuest = (guestId: string) => {
    if (bookingData.guests.length <= 1) return;
    setBookingData((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== guestId),
    }));
    if (activeGuestId === guestId) {
      setActiveGuestId(bookingData.guests[0].id);
    }
  };

  const updateGuestName = (guestId: string, name: string) => {
    setBookingData((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === guestId ? { ...g, guestName: name } : g
      ),
    }));
  };

  const handleTreatmentSelect = (treatment: Treatment) => {
    if (hasDurationOptions(treatment)) {
      setDurationModal({ treatment, guestId: activeGuestId });
    } else {
      setBookingData((prev) => ({
        ...prev,
        guests: prev.guests.map((g) =>
          g.id === activeGuestId ? { 
            ...g, 
            treatment,
            selectedDuration: treatment.duration,
            selectedPrice: treatment.priceValue
          } : g
        ),
      }));
      setShowCart(true);
    }
  };

  const handleDurationSelect = (duration: string, price: number) => {
    if (!durationModal) return;
    
    setBookingData((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === durationModal.guestId ? { 
          ...g, 
          treatment: durationModal.treatment,
          selectedDuration: duration,
          selectedPrice: price
        } : g
      ),
    }));
    setShowCart(true);
    setDurationModal(null);
  };

  const removeTreatmentFromGuest = (guestId: string) => {
    setBookingData((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === guestId ? { ...g, treatment: null, selectedDuration: '', selectedPrice: 0 } : g
      ),
    }));
  };

  const guestsWithTreatments = bookingData.guests.filter((g) => g.treatment !== null);
  const canProceedToDetails = guestsWithTreatments.length > 0 && bookingData.date && bookingData.time;

  const handleProceedToDetails = () => {
    if (canProceedToDetails) {
      setCurrentStep('details');
    }
  };

  const calculateSubtotal = () => {
    return bookingData.guests.reduce((total, guest) => {
      return total + (guest.selectedPrice || 0);
    }, 0);
  };

  const calculateDiscount = () => {
    if (bookingData.isHotelGuest) {
      return calculateSubtotal() * 0.1;
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time || !bookingData.firstName || !bookingData.email || !bookingData.phone) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: calculateTotal(),
          treatments: bookingData.guests
            .filter((g) => g.treatment)
            .map((g) => ({
              guestName: g.guestName,
              treatmentName: g.treatment?.name,
              duration: g.selectedDuration,
              price: g.selectedPrice,
            })),
          date: bookingData.date,
          time: bookingData.time,
          customer: {
            firstName: bookingData.firstName,
            lastName: bookingData.lastName,
            email: bookingData.email,
            phone: bookingData.phone,
          },
          notes: bookingData.notes,
          isHotelGuest: bookingData.isHotelGuest,
          discount: calculateDiscount(),
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setCurrentStep('confirmation');
      }
    } catch {
      setCurrentStep('confirmation');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepIndex = (step: BookingStep) => steps.findIndex((s) => s.id === step);
  const activeGuest = bookingData.guests.find((g) => g.id === activeGuestId);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="pt-32 pb-8 bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-[var(--font-montserrat)] text-gold text-sm tracking-[0.3em] mb-4">
              RESERVE YOUR
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-6">
              Spa Experience
            </h1>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-6 bg-white border-b sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-[var(--font-montserrat)] text-sm transition-all ${
                        getStepIndex(currentStep) >= idx
                          ? 'bg-gold text-white'
                          : 'bg-cream text-charcoal/50'
                      }`}
                    >
                      {getStepIndex(currentStep) > idx ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`ml-3 font-[var(--font-montserrat)] text-sm hidden md:block ${
                        getStepIndex(currentStep) >= idx
                          ? 'text-charcoal'
                          : 'text-charcoal/50'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 mx-4 text-charcoal/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className={`mx-auto px-6 ${currentStep === 'treatment' ? 'max-w-7xl' : 'max-w-5xl'}`}>
            
            {/* STEP 1: Treatment & Time Selection */}
            {currentStep === 'treatment' && (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="text-center mb-8">
                    <h2 className="font-display text-3xl text-charcoal mb-2">
                      Select Treatments
                    </h2>
                    <p className="font-[var(--font-montserrat)] text-charcoal/60 text-sm">
                      Add treatments for each guest in your party
                    </p>
                  </div>

                  {/* Guest Selection Cards */}
                  <div className="bg-white rounded-xl shadow-md p-5 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal flex items-center gap-2">
                        <Users className="w-4 h-4 text-gold" />
                        Who's getting pampered?
                      </h3>
                      <button
                        onClick={addGuest}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold text-white font-[var(--font-montserrat)] text-sm font-medium hover:bg-gold-dark shadow-md hover:shadow-lg transition-all hover:scale-105"
                      >
                        <Plus className="w-4 h-4" />
                        Add Guest
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {bookingData.guests.map((guest, index) => {
                        const isActive = activeGuestId === guest.id;
                        const hasSelection = guest.treatment !== null;
                        
                        return (
                          <div
                            key={guest.id}
                            onClick={() => setActiveGuestId(guest.id)}
                            className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg scale-[1.02]'
                                : hasSelection
                                ? 'bg-green-50 border-2 border-green-200 hover:border-green-300'
                                : 'bg-cream/50 border-2 border-transparent hover:border-gold/30 hover:bg-cream'
                            }`}
                          >
                            {/* Status indicator */}
                            {hasSelection && !isActive && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                            
                            {/* Guest number badge */}
                            <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                              isActive ? 'bg-black text-white' : 'bg-charcoal text-white'
                            }`}>
                              {index + 1}
                            </div>

                            <div className="pt-2">
                              {/* Editable name */}
                              <input
                                type="text"
                                value={guest.guestName}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  updateGuestName(guest.id, e.target.value);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className={`font-display text-lg font-semibold bg-transparent border-b border-transparent w-full outline-none ${
                                  isActive 
                                    ? 'text-white placeholder-white/70 hover:border-white/50 focus:border-white' 
                                    : 'text-charcoal placeholder-charcoal/50 hover:border-gold/50 focus:border-gold'
                                }`}
                                placeholder="Enter name"
                              />
                              
                              {/* Treatment status */}
                              <div className={`mt-2 text-xs font-[var(--font-montserrat)] ${
                                isActive ? 'text-white/80' : hasSelection ? 'text-green-600' : 'text-charcoal/50'
                              }`}>
                                {hasSelection ? (
                                  <div className="flex flex-col gap-0.5">
                                    <span className="flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" />
                                      {guest.treatment?.name}
                                    </span>
                                    <span className={`text-[10px] ${isActive ? 'text-white/60' : 'text-charcoal/40'}`}>
                                      {guest.selectedDuration}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Select a treatment below
                                  </span>
                                )}
                              </div>

                              {/* Price if selected */}
                              {hasSelection && (
                                <div className={`mt-2 font-display text-lg ${
                                  isActive ? 'text-white' : 'text-gold'
                                }`}>
                                  ฿{guest.selectedPrice.toLocaleString()}
                                </div>
                              )}
                            </div>

                            {/* Remove button */}
                            {bookingData.guests.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeGuest(guest.id);
                                }}
                                className={`absolute bottom-3 right-3 p-1.5 rounded-full transition-colors ${
                                  isActive 
                                    ? 'text-white/70 hover:text-white hover:bg-white/20' 
                                    : 'text-charcoal/30 hover:text-red-500 hover:bg-red-50'
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Selecting for indicator */}
                    {activeGuest && (
                      <div className="mt-4 pt-4 border-t border-cream flex items-center gap-2">
                        <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                        <span className="font-[var(--font-montserrat)] text-sm text-charcoal/70">
                          Now selecting treatment for <strong className="text-gold">{activeGuest.guestName}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Search and Filter */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                      <input
                        type="text"
                        placeholder="Search treatments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-cream rounded-full font-[var(--font-montserrat)] text-sm focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-full font-[var(--font-montserrat)] text-xs whitespace-nowrap transition-all ${
                        selectedCategory === 'all'
                          ? 'bg-charcoal text-white'
                          : 'bg-cream text-charcoal hover:bg-charcoal/10'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full font-[var(--font-montserrat)] text-xs whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? 'bg-charcoal text-white'
                            : 'bg-cream text-charcoal hover:bg-charcoal/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Treatment Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {treatments
                      .filter((t) => {
                        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
                        return matchesSearch && matchesCategory;
                      })
                      .map((treatment) => {
                        const isSignature = treatment.notes.toLowerCase().includes('signature');
                        const isSelectedForActiveGuest = activeGuest?.treatment?.id === treatment.id;
                        
                        return (
                          <button
                            key={treatment.id}
                            onClick={() => handleTreatmentSelect(treatment)}
                            className={`group text-left bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                              isSelectedForActiveGuest ? 'border-gold ring-2 ring-gold/20' : 'border-transparent hover:border-gold/50'
                            }`}
                          >
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden">
                              <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url('${treatment.image}')` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                              
                              {isSelectedForActiveGuest && (
                                <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                                  <div className="bg-gold text-white rounded-full p-3">
                                    <Check className="w-6 h-6" />
                                  </div>
                                </div>
                              )}
                              
                              <div className="absolute top-3 left-3">
                                <span className="bg-white/90 backdrop-blur-sm text-charcoal font-[var(--font-montserrat)] text-[10px] px-2 py-1 rounded-full">
                                  {treatment.category}
                                </span>
                              </div>
                              
                              {isSignature && (
                                <div className="absolute top-3 right-3">
                                  <span className="bg-gold text-white font-[var(--font-montserrat)] text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                  </span>
                                </div>
                              )}

                              <div className="absolute bottom-3 right-3">
                                <span className="bg-gold text-white font-display text-lg px-3 py-1 rounded-sm">
                                  ฿{treatment.price.split(' /')[0]}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-display text-lg text-charcoal mb-1 group-hover:text-gold transition-colors line-clamp-1">
                                {treatment.name}
                              </h3>
                              
                              <div className="flex items-center gap-2 text-charcoal/50 mb-2">
                                <Clock className="w-3 h-3" />
                                <span className="font-[var(--font-montserrat)] text-xs">
                                  {treatment.duration}
                                </span>
                                {hasDurationOptions(treatment) && (
                                  <span className="ml-auto bg-gold/10 text-gold text-[10px] font-[var(--font-montserrat)] px-2 py-0.5 rounded-full">
                                    Multiple options
                                  </span>
                                )}
                              </div>

                              <p className="font-[var(--font-montserrat)] text-xs text-charcoal/60 line-clamp-2">
                                {treatment.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Cart Sidebar with Date/Time */}
                <div className={`lg:w-96 ${showCart || guestsWithTreatments.length > 0 ? 'block' : 'hidden lg:block'}`}>
                  <div className="bg-white rounded-lg shadow-lg p-6 sticky top-32">
                    <div className="flex items-center gap-2 mb-6">
                      <ShoppingBag className="w-5 h-5 text-gold" />
                      <h3 className="font-display text-xl text-charcoal">
                        Your Booking
                      </h3>
                    </div>

                    {guestsWithTreatments.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-charcoal/20 mx-auto mb-3" />
                        <p className="font-[var(--font-montserrat)] text-sm text-charcoal/50">
                          Select treatments for your guests
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Selected Treatments */}
                        <div className="space-y-3 mb-6">
                          {guestsWithTreatments.map((guest) => (
                            <div key={guest.id} className="bg-cream/50 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-1">
                                <div>
                                  <p className="font-[var(--font-montserrat)] text-xs text-gold">
                                    {guest.guestName}
                                  </p>
                                  <p className="font-display text-sm text-charcoal">
                                    {guest.treatment?.name}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeTreatmentFromGuest(guest.id)}
                                  className="p-1 text-charcoal/40 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-[var(--font-montserrat)] text-xs text-charcoal/50">
                                  {guest.selectedDuration}
                                </span>
                                <span className="font-display text-base text-gold">
                                  ฿{guest.selectedPrice.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Subtotal */}
                        <div className="border-t border-cream pt-4 mb-6">
                          <div className="flex justify-between">
                            <span className="font-[var(--font-montserrat)] text-sm text-charcoal/70">
                              Subtotal
                            </span>
                            <span className="font-display text-lg text-charcoal">
                              ฿{calculateSubtotal().toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Date Selection */}
                        <div className="mb-5">
                          <h4 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gold" />
                            Select Date
                          </h4>
                          <div className="grid grid-cols-4 gap-2">
                            {availableDates.slice(0, 8).map((date) => (
                              <button
                                key={date}
                                type="button"
                                onClick={() => setBookingData((prev) => ({ ...prev, date }))}
                                className={`p-2 text-center font-[var(--font-montserrat)] text-xs rounded-lg transition-colors ${
                                  bookingData.date === date
                                    ? 'bg-gold text-white'
                                    : 'bg-cream hover:bg-gold/20'
                                }`}
                              >
                                <div className="text-[10px] opacity-70">
                                  {format(new Date(date), 'EEE')}
                                </div>
                                <div className="font-medium">{format(new Date(date), 'd')}</div>
                              </button>
                            ))}
                          </div>
                          {/* Show more dates option */}
                          <details className="mt-2">
                            <summary className="text-xs text-gold cursor-pointer font-[var(--font-montserrat)]">
                              Show more dates
                            </summary>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              {availableDates.slice(8).map((date) => (
                                <button
                                  key={date}
                                  type="button"
                                  onClick={() => setBookingData((prev) => ({ ...prev, date }))}
                                  className={`p-2 text-center font-[var(--font-montserrat)] text-xs rounded-lg transition-colors ${
                                    bookingData.date === date
                                      ? 'bg-gold text-white'
                                      : 'bg-cream hover:bg-gold/20'
                                  }`}
                                >
                                  <div className="text-[10px] opacity-70">
                                    {format(new Date(date), 'EEE')}
                                  </div>
                                  <div className="font-medium">{format(new Date(date), 'd')}</div>
                                </button>
                              ))}
                            </div>
                          </details>
                        </div>

                        {/* Time Selection */}
                        <div className="mb-6">
                          <h4 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gold" />
                            Select Time
                          </h4>
                          <div className="grid grid-cols-4 gap-2">
                            {availableTimes.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setBookingData((prev) => ({ ...prev, time }))}
                                className={`p-2 font-[var(--font-montserrat)] text-xs rounded-lg transition-colors ${
                                  bookingData.time === time
                                    ? 'bg-gold text-white'
                                    : 'bg-cream hover:bg-gold/20'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selected Date/Time Summary */}
                        {bookingData.date && bookingData.time && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                            <div className="flex items-center gap-2 text-green-700">
                              <Check className="w-4 h-4" />
                              <span className="font-[var(--font-montserrat)] text-sm">
                                {format(new Date(bookingData.date), 'EEE, MMM d')} at {bookingData.time}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Continue Button */}
                        <button
                          onClick={handleProceedToDetails}
                          disabled={!canProceedToDetails}
                          className="w-full bg-gold hover:bg-gold-dark disabled:bg-charcoal/20 disabled:cursor-not-allowed text-white font-[var(--font-montserrat)] text-sm py-4 rounded-full transition-colors flex items-center justify-center gap-2"
                        >
                          {!bookingData.date || !bookingData.time ? (
                            'Select date & time'
                          ) : (
                            <>
                              Continue to Payment
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile Cart Button */}
                {guestsWithTreatments.length > 0 && (
                  <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden z-40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-[var(--font-montserrat)] text-sm text-charcoal/70">
                        {guestsWithTreatments.length} treatment{guestsWithTreatments.length > 1 ? 's' : ''}
                      </span>
                      <span className="font-display text-lg text-gold">
                        ฿{calculateSubtotal().toLocaleString()}
                      </span>
                    </div>
                    {bookingData.date && bookingData.time ? (
                      <button
                        onClick={handleProceedToDetails}
                        className="w-full bg-gold hover:bg-gold-dark text-white font-[var(--font-montserrat)] text-sm py-4 rounded-full transition-colors flex items-center justify-center gap-2"
                      >
                        Continue • {format(new Date(bookingData.date), 'MMM d')} at {bookingData.time}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <p className="text-center font-[var(--font-montserrat)] text-xs text-charcoal/50">
                        Select date & time in the booking panel above
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Details & Payment */}
            {currentStep === 'details' && (
              <form onSubmit={handlePayment}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Forms */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Appointment Summary */}
                    <div className="bg-gold/5 border border-gold/20 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-display text-xl text-charcoal">
                              {format(new Date(bookingData.date), 'EEEE, MMMM d, yyyy')}
                            </p>
                            <p className="font-[var(--font-montserrat)] text-sm text-gold">
                              {bookingData.time} • {guestsWithTreatments.length} treatment{guestsWithTreatments.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('treatment')}
                          className="text-sm text-gold hover:text-gold-dark font-[var(--font-montserrat)]"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-2">
                        <User className="w-6 h-6 text-gold" />
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={bookingData.firstName}
                            onChange={(e) => setBookingData((prev) => ({ ...prev, firstName: e.target.value }))}
                            className="w-full p-3 border border-cream rounded-lg font-[var(--font-montserrat)] text-sm focus:border-gold transition-colors"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={bookingData.lastName}
                            onChange={(e) => setBookingData((prev) => ({ ...prev, lastName: e.target.value }))}
                            className="w-full p-3 border border-cream rounded-lg font-[var(--font-montserrat)] text-sm focus:border-gold transition-colors"
                            placeholder="Doe"
                          />
                        </div>
                        <div>
                          <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={bookingData.email}
                            onChange={(e) => setBookingData((prev) => ({ ...prev, email: e.target.value }))}
                            className="w-full p-3 border border-cream rounded-lg font-[var(--font-montserrat)] text-sm focus:border-gold transition-colors"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={bookingData.phone}
                            onChange={(e) => setBookingData((prev) => ({ ...prev, phone: e.target.value }))}
                            className="w-full p-3 border border-cream rounded-lg font-[var(--font-montserrat)] text-sm focus:border-gold transition-colors"
                            placeholder="+66 XX XXX XXXX"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-2">
                            Special Requests (Optional)
                          </label>
                          <textarea
                            value={bookingData.notes}
                            onChange={(e) => setBookingData((prev) => ({ ...prev, notes: e.target.value }))}
                            className="w-full p-3 border border-cream rounded-lg font-[var(--font-montserrat)] text-sm h-24 resize-none focus:border-gold transition-colors"
                            placeholder="Any allergies, preferences, or special requests..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hotel Guest Discount */}
                    <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-lg p-6 border border-gold/20">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingData.isHotelGuest}
                          onChange={(e) => setBookingData((prev) => ({ ...prev, isHotelGuest: e.target.checked }))}
                          className="w-5 h-5 mt-1 rounded border-gold text-gold focus:ring-gold"
                        />
                        <div>
                          <p className="font-display text-lg text-charcoal">
                            Royal Phuket City Hotel Guest
                          </p>
                          <p className="font-[var(--font-montserrat)] text-sm text-charcoal/60">
                            Check this box to receive 10% off your booking. Please present your room key or booking confirmation at the spa.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Right Column - Summary */}
                  <div>
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
                      <h3 className="font-display text-xl text-charcoal mb-6">
                        Booking Summary
                      </h3>

                      {/* Treatments List */}
                      <div className="space-y-3 mb-6 pb-6 border-b border-cream">
                        {guestsWithTreatments.map((guest) => (
                          <div key={guest.id} className="flex justify-between">
                            <div>
                              <p className="font-[var(--font-montserrat)] text-xs text-gold">
                                {guest.guestName}
                              </p>
                              <p className="font-[var(--font-montserrat)] text-sm text-charcoal">
                                {guest.treatment?.name}
                              </p>
                              <p className="font-[var(--font-montserrat)] text-xs text-charcoal/50">
                                {guest.selectedDuration}
                              </p>
                            </div>
                            <span className="font-[var(--font-montserrat)] text-sm text-charcoal">
                              ฿{guest.selectedPrice.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Date & Time */}
                      <div className="mb-6 pb-6 border-b border-cream">
                        <div className="flex items-center gap-2 text-charcoal/70 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-[var(--font-montserrat)] text-sm">
                            {format(new Date(bookingData.date), 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-charcoal/70">
                          <Clock className="w-4 h-4" />
                          <span className="font-[var(--font-montserrat)] text-sm">
                            {bookingData.time}
                          </span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between">
                          <span className="font-[var(--font-montserrat)] text-sm text-charcoal/70">
                            Subtotal
                          </span>
                          <span className="font-[var(--font-montserrat)] text-sm text-charcoal">
                            ฿{calculateSubtotal().toLocaleString()}
                          </span>
                        </div>
                        {bookingData.isHotelGuest && (
                          <div className="flex justify-between text-green-600">
                            <span className="font-[var(--font-montserrat)] text-sm">
                              Hotel Guest Discount (10%)
                            </span>
                            <span className="font-[var(--font-montserrat)] text-sm">
                              -฿{calculateDiscount().toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-cream">
                          <span className="font-display text-xl text-charcoal">
                            Total
                          </span>
                          <span className="font-display text-2xl text-gold">
                            ฿{calculateTotal().toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-cream/50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-gold" />
                          <span className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal">
                            Secure Payment
                          </span>
                        </div>
                        <p className="font-[var(--font-montserrat)] text-xs text-charcoal/60">
                          Credit cards, debit cards, and QR payment accepted via PaySolution.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full bg-gold hover:bg-gold-dark disabled:bg-charcoal/30 disabled:cursor-not-allowed text-white font-[var(--font-montserrat)] text-sm py-4 rounded-full transition-colors flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <span className="animate-spin">⟳</span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              Pay ฿{calculateTotal().toLocaleString()}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('treatment')}
                          className="w-full text-charcoal/60 hover:text-charcoal font-[var(--font-montserrat)] text-sm py-2 transition-colors"
                        >
                          ← Back to Treatments
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: Confirmation */}
            {currentStep === 'confirmation' && (
              <div className="max-w-xl mx-auto text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="font-display text-3xl text-charcoal mb-4">
                  Booking Confirmed!
                </h2>
                <p className="font-[var(--font-montserrat)] text-charcoal/70 mb-8">
                  Thank you for your booking. A confirmation email has been sent to{' '}
                  <strong>{bookingData.email}</strong>.
                </p>

                <div className="bg-white rounded-lg shadow-md p-6 text-left mb-8">
                  <h3 className="font-display text-xl text-charcoal mb-4">
                    Booking Details
                  </h3>
                  
                  <div className="space-y-4">
                    {guestsWithTreatments.map((guest) => (
                      <div key={guest.id} className="flex justify-between pb-2 border-b border-cream">
                        <div>
                          <p className="font-[var(--font-montserrat)] text-xs text-gold">
                            {guest.guestName}
                          </p>
                          <p className="font-[var(--font-montserrat)] text-sm text-charcoal">
                            {guest.treatment?.name}
                          </p>
                          <p className="font-[var(--font-montserrat)] text-xs text-charcoal/50">
                            {guest.selectedDuration}
                          </p>
                        </div>
                        <span className="font-[var(--font-montserrat)] text-sm text-charcoal">
                          ฿{guest.selectedPrice.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2 text-charcoal/70">
                      <Calendar className="w-4 h-4" />
                      <span className="font-[var(--font-montserrat)] text-sm">
                        {bookingData.date && format(new Date(bookingData.date), 'EEEE, MMMM d, yyyy')} at {bookingData.time}
                      </span>
                    </div>

                    {bookingData.isHotelGuest && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-[var(--font-montserrat)] text-sm">Hotel Discount Applied</span>
                        <span className="font-[var(--font-montserrat)] text-sm">-10%</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-2">
                      <span className="font-display text-lg text-charcoal">Total Paid</span>
                      <span className="font-display text-xl text-gold">
                        ฿{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/')}
                  className="bg-gold hover:bg-gold-dark text-white font-[var(--font-montserrat)] text-sm px-8 py-3 rounded-full transition-colors"
                >
                  Return Home
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Bottom padding for mobile cart button */}
        {currentStep === 'treatment' && guestsWithTreatments.length > 0 && (
          <div className="h-24 lg:hidden" />
        )}
      </main>
      <Footer />

      {/* Duration Selection Modal */}
      {durationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDurationModal(null)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            {/* Header with image */}
            <div className="relative h-32 overflow-hidden">
              <img 
                src={durationModal.treatment.image} 
                alt={durationModal.treatment.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                onClick={() => setDurationModal(null)}
                className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-gold text-xs font-[var(--font-montserrat)] uppercase tracking-wider">
                  {durationModal.treatment.category}
                </p>
                <h3 className="text-white font-display text-xl">
                  {durationModal.treatment.name}
                </h3>
              </div>
            </div>

            {/* Duration Options */}
            <div className="p-6">
              <h4 className="font-[var(--font-montserrat)] text-sm font-medium text-charcoal mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                Select Duration
              </h4>
              
              <div className="space-y-3">
                {parseDurationOptions(durationModal.treatment).map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleDurationSelect(option.duration, option.price)}
                    className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-cream hover:border-gold bg-cream/30 hover:bg-gold/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                        <Clock className="w-5 h-5 text-gold group-hover:text-white" />
                      </div>
                      <span className="font-[var(--font-montserrat)] text-sm text-charcoal">
                        {option.duration}
                      </span>
                    </div>
                    <span className="font-display text-xl text-gold">
                      ฿{option.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-center font-[var(--font-montserrat)] text-xs text-charcoal/50">
                Selecting for: <span className="text-gold font-medium">{bookingData.guests.find(g => g.id === durationModal.guestId)?.guestName}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⟳</div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}

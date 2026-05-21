export interface Treatment {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: string;
  priceValue: number;
  description: string;
  highlights: string[];
  targetGuest: string;
  bestBookingTime: string;
  notes: string;
  image: string;
  isSignature?: boolean;
  isCouple?: boolean;
  priceNote?: string;
}

export interface AddOn {
  id: number;
  name: string;
  duration: string;
  price: number;
  description: string;
  techniques: string[];
  pairsWith: string;
  image: string;
}

export const categories = [
  "Travel Recovery",
  "Skin & Radiance",
  "Couple & Special",
  "Facial Treatments",
  "Classic Thai Heritage",
  "Top-Up / Add-On",
] as const;

export type Category = (typeof categories)[number];

export const spaInfo = {
  name: "Royal Wellness Spa",
  location: "3rd Floor, Royal Phuket City Hotel",
  phone: "090-596-9666",
  whatsapp: "090-596-9666",
  lineUrl: "https://lin.ee/En1ToHH",
  email: "wallop.c@royalwellnessspaphuket.com",
  hours: "Open Daily: 10:00 AM – 11:00 PM",
  brandColors: {
    gold: "#D4B371",
    black: "#000000",
    white: "#FFFFFF",
  },
};

const treatmentImages: Record<string, string> = {
  "Travel Recovery": "/images/Royal Spa 1.jpg",
  "Skin & Radiance": "/images/Royal Spa 2.jpg",
  "Couple & Special": "/images/Royal Spa 3.jpg",
  "Facial Treatments": "/images/Royal Spa 4.jpg",
  "Classic Thai Heritage": "/images/Royal Spa 5.jpg",
  "Top-Up / Add-On": "/images/Royal Spa 6.jpg",
};

const specificImages: Record<number, string> = {
  1: "/images/shutterstock_2452280715_resize.jpg",
  2: "/images/shutterstock_2364665635_resize.jpg",
  3: "/images/Treatment/Voyage Revival.jpg",
  4: "/images/Treatment/Wander Relief.jpg",
  5: "/images/Treatment/Active Body Revival.jpg",
  6: "/images/shutterstock_2589885543_resize.jpg",
  7: "/images/Treatment/Royal Glow Ritual.jpg",
  8: "/images/Treatment/Silk Radiance Ritual.jpg",
  9: "/images/Treatment/Harmony Retreat.jpg",
  10: "/images/shutterstock_2530376767_resize.jpg",
  11: "/images/Royal Spa 4.jpg",
  12: "/images/Treatment/Royal Signature Facial.jpg",
  13: "/images/Royal Spa 5.jpg",
  14: "/images/Treatment/Aroma Relaxation Massage.jpg",
  15: "/images/Treatment/Thai Herbal Compress Therapy.jpg",
  16: "/images/Royal Spa 7.jpg",
  17: "/images/Royal Spa 8.jpg",
  18: "/images/Treatment/Thai Herbal Compress Therapy.jpg",
  19: "/images/Royal Spa 10.jpg",
};

export const treatments: Treatment[] = [
  // ===== Travel Recovery (5 treatments) =====
  {
    id: 1,
    name: "Office Syndrome Relief",
    category: "Travel Recovery",
    duration: "60 / 90 / 120 min",
    price: "฿990 / ฿1,890 / ฿1,980",
    priceValue: 990,
    description: "Deep release of neck, shoulder and back muscles, combined with scalp massage and warm eye compress to relieve work fatigue and restore lightness to body and mind.",
    highlights: [
      "Neck & Shoulder Release",
      "Scalp Circulation",
      "Warm Eye Compress",
      "Relaxing Aromatherapy",
      "Mind Balancing",
      "Deep Back Release (120min only)",
    ],
    targetGuest: "Office workers / desk-bound / screen-tired / stress relief",
    bestBookingTime: "Night before checkout",
    notes: "",
    image: specificImages[1] || treatmentImages["Travel Recovery"],
  },
  {
    id: 2,
    name: "Posture Revival",
    category: "Travel Recovery",
    duration: "90 / 120 min",
    price: "฿1,800 / ฿1,980",
    priceValue: 1800,
    description: "Full-body posture-recovery treatment designed for the modern worker. Deeply releases back and shoulder muscles, balances the hips and lower back, and uses stretching to restore graceful posture.",
    highlights: [
      "Deep Back & Shoulder Release",
      "Hip and Lower-back Relaxation",
      "Supportive Stretching",
    ],
    targetGuest: "Office workers / desk-bound / screen-tired / stress relief",
    bestBookingTime: "Weekend",
    notes: "",
    image: specificImages[2] || treatmentImages["Travel Recovery"],
  },
  {
    id: 3,
    name: "Voyage Reset",
    category: "Travel Recovery",
    duration: "90 / 120 min",
    price: "฿1,980 / ฿2,070",
    priceValue: 1980,
    description: "Restores the body after long travel using lymphatic drainage to reduce swelling and fatigue, combined with warm eye compress to reset freshness and energy.",
    highlights: [
      "Foot Awakening Ritual",
      "Leg Circulation and Nourishment",
      "Lymphatic Drainage",
      "Warm Eye Compress",
    ],
    targetGuest: "Long-haul travelers / jet lag / body recalibration",
    bestBookingTime: "After check-in, before first night's sleep",
    notes: "",
    image: specificImages[3] || treatmentImages["Travel Recovery"],
  },
  {
    id: 4,
    name: "Wander Therapy",
    category: "Travel Recovery",
    duration: "90 / 120 min",
    price: "฿1,440 / ฿1,530",
    priceValue: 1440,
    description: "Deep recovery for the lower body, releasing tight fascia and using restorative stretching to bring back lightness and flexibility — fresh legs and feet for the next day's exploring.",
    highlights: [
      "Lower-body Recovery and Rebalancing",
      "Myofascial Reset",
      "Mobility Restore Stretch",
    ],
    targetGuest: "Sightseers / heavy-walking travelers / leg and foot care / after long days",
    bestBookingTime: "Last night of the trip",
    notes: "",
    image: specificImages[4] || treatmentImages["Travel Recovery"],
  },
  {
    id: 5,
    name: "Active Body Repair",
    category: "Travel Recovery",
    duration: "90 / 120 min",
    price: "฿2,160 / ฿2,250",
    priceValue: 2160,
    description: "The ultimate recovery for active travelers and athletes. Warm-oil massage combined with deep tissue work and stretching to release peak tension and accelerate muscle recovery.",
    highlights: [
      "Foot Activation",
      "Warm-oil Muscle Prep",
      "Deep Tissue on Hips / Hamstrings / Calves",
      "Mobility Restore Stretch",
      "Head Reset (closing)",
    ],
    targetGuest: "Athletes / fitness enthusiasts / deep muscle recovery / tension release",
    bestBookingTime: "After workout",
    notes: "",
    image: specificImages[5] || treatmentImages["Travel Recovery"],
  },

  // ===== Skin & Radiance (2 treatments) =====
  {
    id: 6,
    name: "Sunkiss Recovery",
    category: "Skin & Radiance",
    duration: "120 min",
    price: "฿2,790",
    priceValue: 2790,
    description: "Deep skin and body recovery after sun exposure. Begins with organic exfoliation, then rebalances core muscles with botanical-oil massage to restore hydration and complete relaxation.",
    highlights: [
      "Organic Body Scrub",
      "Core Muscle Rebalancing",
      "Botanical-oil Hydration",
      "Relaxing Aromatherapy",
      "Professional Head Reset",
      "Warm Eye Compress",
    ],
    targetGuest: "Outdoor activity / post-sun recovery / hydration restore",
    bestBookingTime: "After outdoor activities",
    notes: "",
    image: specificImages[6] || treatmentImages["Skin & Radiance"],
  },
  {
    id: 7,
    name: "Royal Glow Ritual",
    category: "Skin & Radiance",
    duration: "150 min",
    price: "฿3,960",
    priceValue: 3960,
    description: "The ultimate full-spectrum body-and-skin ritual. Combines aromatherapy massage with a facial treatment for radiant, lifted skin — head-to-toe rejuvenation. Bought separately the components total ฿5,480; bundled here for ฿3,960.",
    highlights: [
      "Organic Body Scrub",
      "Core Muscle Rebalancing",
      "Nourishing Aromatherapy Massage",
      "Royal Glow Recovery Facial (deep cleanse / enzyme exfoliation / hydration mask / firming face massage)",
      "Warm Eye Compress",
    ],
    targetGuest: "Accumulated fatigue / full body-and-mind reset / life-energy reset",
    bestBookingTime: "Special occasion / night before departure",
    notes: "Signature",
    isSignature: true,
    image: specificImages[7] || treatmentImages["Skin & Radiance"],
  },

  // ===== Couple & Special (3 treatments) =====
  {
    id: 8,
    name: "Silk Radiance Ritual",
    category: "Couple & Special",
    duration: "120 min",
    price: "฿4,990",
    priceValue: 4990,
    description: "Shared retreat in a private Couple Suite. Begins with a body scrub for silk-smooth skin, then nourishing massage and scalp work to create a special memory and restore radiance to skin and spirit.",
    highlights: [
      "Organic Body Scrub",
      "Botanical-oil Hydration",
      "Relaxing Aromatherapy",
      "Head Reset",
      "Warm Eye Compress",
      "Performed together in Couple Suite",
    ],
    targetGuest: "Couples and honeymooners / special occasions / private spa suite",
    bestBookingTime: "Special evening",
    notes: "Couple Suite required",
    isCouple: true,
    priceNote: "per couple",
    image: specificImages[8] || treatmentImages["Couple & Special"],
  },
  {
    id: 9,
    name: "Harmony Retreat",
    category: "Couple & Special",
    duration: "90 / 120 min",
    price: "฿3,960 / ฿4,140",
    priceValue: 3960,
    description: "Shared body-recovery experience for couples. Focuses on rebalancing the lower body with fascial release and stretching to unlock fatigue together.",
    highlights: [
      "Lower-body Recovery and Rebalancing",
      "Myofascial Reset",
      "Mobility Restore Stretch",
      "Performed together in Couple Suite",
    ],
    targetGuest: "Couples and honeymooners / special occasions / private spa suite",
    bestBookingTime: "Relaxed evening",
    notes: "Couple Suite required",
    isCouple: true,
    priceNote: "per couple",
    image: specificImages[9] || treatmentImages["Couple & Special"],
  },
  {
    id: 10,
    name: "Blossom Bridal",
    category: "Couple & Special",
    duration: "120 min",
    price: "฿3,200",
    priceValue: 3200,
    description: "The ultimate preparation for a special day. Complete with deep core rebalancing for graceful posture, plus head reset and radiance mask for glowing, lifted skin.",
    highlights: [
      "Upper-body Reset",
      "Deep Core Rebalancing",
      "Performance Head Reset",
      "Radiance Glow Mask",
    ],
    targetGuest: "Brides / brides-to-be / pre-event skin prep",
    bestBookingTime: "Night before the event",
    notes: "Couple Suite available",
    isCouple: true,
    priceNote: "per person (or ฿6,200 per couple)",
    image: specificImages[10] || treatmentImages["Couple & Special"],
  },

  // ===== Facial Treatments (2 treatments) =====
  {
    id: 11,
    name: "Sunkiss Facial",
    category: "Facial Treatments",
    duration: "30 / 60 min",
    price: "฿690 / ฿1,490",
    priceValue: 690,
    description: "Emergency facial recovery after sun exposure. Cold compress paired with aloe-based mask soothes skin instantly, restoring hydration and repairing the skin barrier.",
    highlights: [
      "Cold Compress",
      "Herbal & Aloe Soothing Mask",
      "Hydration Essence + Barrier-repair Moisturizer",
    ],
    targetGuest: "Outdoor activity / post-sun recovery / hydration restore",
    bestBookingTime: "After outdoor activities",
    notes: "",
    image: specificImages[11] || treatmentImages["Facial Treatments"],
  },
  {
    id: 12,
    name: "Royal Signature Facial",
    category: "Facial Treatments",
    duration: "30 / 60 min",
    price: "฿690 / ฿1,490",
    priceValue: 690,
    description: "Bespoke facial treatment focused on your chosen goal — detox, brightening or hydration — combined with lymphatic massage for healthy, radiant skin.",
    highlights: [
      "Client-chosen Focus (Detox & Deep Cleanse / Brightening / Hydration)",
      "Lymphatic Face Massage",
      "High-quality Products Selected per Skin Type",
      "Skin Assessment Before Treatment",
    ],
    targetGuest: "Everyone / deep relaxation / mind-body balance",
    bestBookingTime: "Anytime",
    notes: "",
    image: specificImages[12] || treatmentImages["Facial Treatments"],
  },

  // ===== Classic Thai Heritage (3 treatments) =====
  {
    id: 13,
    name: "Royal Thai Balance",
    category: "Classic Thai Heritage",
    duration: "60 / 90 min",
    price: "฿900 / ฿1,350",
    priceValue: 900,
    description: "Elevated traditional Thai massage. Acupressure and stretching combined with joint mobility work to awaken circulation and restore complete balance.",
    highlights: [
      "Traditional Thai Full-body Stretching",
      "Acupressure Points",
      "Joint Mobility",
    ],
    targetGuest: "Everyone / deep relaxation / mind-body balance",
    bestBookingTime: "Anytime",
    notes: "",
    image: specificImages[13] || treatmentImages["Classic Thai Heritage"],
  },
  {
    id: 14,
    name: "Aroma Relaxation Massage",
    category: "Classic Thai Heritage",
    duration: "60 / 90 min",
    price: "฿1,100 / ฿1,980",
    priceValue: 1100,
    description: "Treatment with premium essential oils paired with gentle massage techniques to stimulate circulation and release tension — deep relaxation across every sense.",
    highlights: [
      "Aromatherapy Oil Massage",
      "Full-body Relaxation",
      "Circulation",
      "Premium-grade Essential Oils",
    ],
    targetGuest: "Everyone / deep relaxation / mind-body balance",
    bestBookingTime: "Anytime",
    notes: "",
    image: specificImages[14] || treatmentImages["Classic Thai Heritage"],
  },
  {
    id: 15,
    name: "Thai Herbal Compress Therapy",
    category: "Classic Thai Heritage",
    duration: "60 / 90 min",
    price: "฿1,440 / ฿1,890",
    priceValue: 1440,
    description: "Heat therapy from fresh herbal compresses paired with Thai massage to release deep muscle tension. Warmth from the compress activates circulation and relieves accumulated fatigue.",
    highlights: [
      "Fresh Herbal Compress",
      "Deep Muscle Release",
      "Circulation Activation",
    ],
    targetGuest: "Everyone / deep relaxation / mind-body balance",
    bestBookingTime: "Anytime",
    notes: "",
    image: specificImages[15] || treatmentImages["Classic Thai Heritage"],
  },
];

// ===== Top-Up / Add-On (4 add-ons, all 15 minutes) =====
export const addOns: AddOn[] = [
  {
    id: 16,
    name: "Foot Boost",
    duration: "15 min",
    price: 350,
    description: "Reflexology pressure-point technique stimulating key points to balance internal organs, awakening freshness and restoring balance.",
    techniques: [
      "Reflexology Pressure-point Technique",
      "Internal Organ Balancing",
      "Freshness Awakening",
    ],
    pairsWith: "All foot / leg treatments",
    image: specificImages[16] || treatmentImages["Top-Up / Add-On"],
  },
  {
    id: 17,
    name: "Head Reset",
    duration: "15 min",
    price: 320,
    description: "Releases accumulated tension with massage focused on the occipital region and neck, easing mental fatigue and resetting the mind.",
    techniques: [
      "Occipital Region Massage",
      "Neck Tension Release",
      "Mental Fatigue Relief",
      "Mind Reset",
    ],
    pairsWith: "Office Syndrome Relief / Voyage Reset / facial treatments",
    image: specificImages[17] || treatmentImages["Top-Up / Add-On"],
  },
  {
    id: 18,
    name: "Thai Herbal Compress",
    duration: "15 min",
    price: 390,
    description: "Elevates treatment with heat from fresh herbal compresses applied to tight muscle points, relieving pain and deepening relaxation.",
    techniques: [
      "Fresh Herbal Compress Heat Therapy",
      "Tight Muscle Point Application",
      "Pain Relief",
      "Deep Relaxation Enhancement",
    ],
    pairsWith: "All massage treatments",
    image: specificImages[18] || treatmentImages["Top-Up / Add-On"],
  },
  {
    id: 19,
    name: "Screen Relief Treatment",
    duration: "15 min",
    price: 350,
    description: "Eye and brain recovery from screen use. Warm eye compress combined with temple and scalp massage to ease eye strain and release accumulated stress.",
    techniques: [
      "Warm Eye Compress",
      "Temple Massage",
      "Scalp Massage",
      "Eye Strain Relief",
      "Stress Release",
    ],
    pairsWith: "Office Syndrome Relief / facial treatments",
    image: specificImages[19] || treatmentImages["Top-Up / Add-On"],
  },
];

export const getTreatmentById = (id: number): Treatment | undefined => {
  return treatments.find((t) => t.id === id);
};

export const getTreatmentsByCategory = (category: Category): Treatment[] => {
  return treatments.filter((t) => t.category === category);
};

export const getSignatureTreatments = (): Treatment[] => {
  return treatments.filter((t) => t.isSignature);
};

export const getAddOns = (): AddOn[] => {
  return addOns;
};

export const getAllTreatmentsWithAddOns = (): (Treatment | AddOn)[] => {
  return [...treatments, ...addOns];
};

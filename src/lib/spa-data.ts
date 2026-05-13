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
  lineUrl: "https://lin.ee/En1ToHH",
  hours: "Daily 10:00 – 22:00",
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
  3: "/images/shutterstock_2167201991_resize.jpg",
  4: "/images/shutterstock_2452786083_resize.jpg",
  5: "/images/Royal Wellness Spa 1.jpg",
  6: "/images/shutterstock_2589885543_resize.jpg",
  7: "/images/Royal Spa 2.jpg",
  8: "/images/Royal Spa 3.jpg",
  9: "/images/shutterstock_1874692903_resize.jpg",
  10: "/images/shutterstock_2530376767_resize.jpg",
  11: "/images/Royal Spa 4.jpg",
  12: "/images/shutterstock_232040092_resize.jpg",
  13: "/images/Royal Spa 5.jpg",
  14: "/images/shutterstock_1062047603_resize.jpg",
  15: "/images/Royal Spa 6.jpg",
  16: "/images/Royal Spa 7.jpg",
  17: "/images/Royal Spa 8.jpg",
  18: "/images/Royal Spa 9.jpg",
  19: "/images/Royal Spa 10.jpg",
};

export const treatments: Treatment[] = [
  // Travel Recovery (5 treatments)
  {
    id: 1,
    name: "Office Syndrome Relief",
    category: "Travel Recovery",
    duration: "60 / 90 / 120 min",
    price: "฿990 / ฿1,890 / ฿1,980",
    priceValue: 990,
    description: "Full recovery for desk workers and long-stay guests — targeting neck, shoulder, scalp, and eyes with warm compress techniques not found at competitors.",
    highlights: [
      "Neck & Shoulder Release",
      "Deep Scalp Circulation Therapy",
      "Warm Eye Compress",
      "Relaxing Aroma Ritual",
      "Mind Calm Integration",
      "Deep Back Release (120 min)",
    ],
    targetGuest: "Long-stay guests",
    bestBookingTime: "Night before check-out",
    notes: "Core offering for hotel guests",
    image: specificImages[1] || treatmentImages["Travel Recovery"],
  },
  {
    id: 2,
    name: "Posture Revival",
    category: "Travel Recovery",
    duration: "90 / 120 min",
    price: "฿1,800 / ฿1,980",
    priceValue: 1800,
    description: "Full posture reset for remote workers and WFH guests — includes hip and lower back release with assisted stretching unavailable at competing spas.",
    highlights: [
      "Deep Back & Shoulder Release",
      "Hip & Lower Back Relaxation",
      "Assisted Stretching",
    ],
    targetGuest: "Remote workers / WFH guests",
    bestBookingTime: "Weekends",
    notes: "Core offering for hotel guests",
    image: specificImages[2] || treatmentImages["Travel Recovery"],
  },
  {
    id: 3,
    name: "Voyage Revival",
    category: "Travel Recovery",
    duration: "90 / 120 min",
    price: "฿1,980 / ฿2,070",
    priceValue: 1980,
    description: "Designed for long-haul travellers — combines foot revival, leg circulation, lymphatic drainage, and warm eye compress in one session.",
    highlights: [
      "Foot Awakening Ritual",
      "Circulation Boost Leg Flow",
      "Lymph Flow Activation",
      "Warm Eye Compress",
    ],
    targetGuest: "Long-haul travellers",
    bestBookingTime: "After check-in, before first night's sleep",
    notes: "Core offering for hotel guests",
    image: specificImages[3] || treatmentImages["Travel Recovery"],
  },
  {
    id: 4,
    name: "Wander Relief",
    category: "Travel Recovery",
    duration: "90 / 120 min",
    price: "฿1,440 / ฿1,530",
    priceValue: 1440,
    description: "Full lower body recovery for guests who have walked extensively — specialised myofascial release and mobility stretching unavailable at local competitors.",
    highlights: [
      "Lower Body Alignment & Recovery",
      "Myofascial Reset",
      "Mobility Restore Stretch",
    ],
    targetGuest: "High-activity tourists",
    bestBookingTime: "Final night of trip",
    notes: "Core offering for hotel guests",
    image: specificImages[4] || treatmentImages["Travel Recovery"],
  },
  {
    id: 5,
    name: "Active Body Revival",
    category: "Travel Recovery",
    duration: "90 / 120 min",
    price: "฿2,160 / ฿2,250",
    priceValue: 2160,
    description: "The most comprehensive sport recovery on the menu — warm oil muscle prep, deep tissue for athletes, and assisted stretching close with a Head Reset.",
    highlights: [
      "Foot Activation",
      "Warm Oil Muscle Preparation",
      "Deep Tissue — Glutes / Hamstrings / Calves",
      "Mobility Restore Stretch",
      "Head Reset (closing)",
    ],
    targetGuest: "Athletes / Active travellers",
    bestBookingTime: "After exercise",
    notes: "Core offering for hotel guests",
    image: specificImages[5] || treatmentImages["Travel Recovery"],
  },

  // Skin & Radiance (2 treatments)
  {
    id: 6,
    name: "Sunkiss Recovery",
    category: "Skin & Radiance",
    duration: "120 min",
    price: "฿2,790",
    priceValue: 2790,
    description: "Deep skin restoration for guests after sun exposure — organic exfoliation, botanical oil infusion, and muscle rebalancing in one session.",
    highlights: [
      "Organic Body Polish",
      "Core Muscle Rebalancing",
      "Nourishing Skin Infusion with Botanical Oils",
      "Aroma Relaxation",
      "Professional Head Reset",
      "Warm Eye Compress",
    ],
    targetGuest: "Sun-exposed leisure guests",
    bestBookingTime: "After outdoor sightseeing",
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
    description: "Signature full-body and facial ritual — body scrub, aroma massage, and a complete Sculpting Lift Facial in one session. Purchasing separately costs ฿5,480; Royal Glow Ritual delivers both for ฿3,960.",
    highlights: [
      "Organic Body Polish",
      "Core Muscle Rebalancing",
      "Nourishing Aromatherapy Massage",
      "Royal Glow Recovery Facial",
      "Deep Cleansing & Enzyme Exfoliation",
      "Hydration Mask & Sculpting Lift Massage",
      "Warm Eye Compress",
    ],
    targetGuest: "All guests seeking full body + facial",
    bestBookingTime: "Special occasion / day before departure",
    notes: "Signature",
    isSignature: true,
    image: specificImages[7] || treatmentImages["Skin & Radiance"],
  },

  // Couple & Special (3 treatments)
  {
    id: 8,
    name: "Silk Radiance Ritual",
    category: "Couple & Special",
    duration: "120 min",
    price: "฿4,990",
    priceValue: 4990,
    description: "A shared skin renewal experience for couples in a private suite — organic polish and botanical oil infusion side by side.",
    highlights: [
      "Organic Body Polish",
      "Nourishing Skin Infusion — Botanical Oils",
      "Aroma Relaxation",
      "Head Reset",
      "Warm Eye Compress",
      "Performed simultaneously in Couple Suite",
    ],
    targetGuest: "Couples / Honeymoon / Anniversary",
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
    description: "A restorative lower body treatment for couples — myofascial release and mobility stretching together in the Couple Suite.",
    highlights: [
      "Lower Body Alignment & Recovery",
      "Myofascial Reset",
      "Mobility Restore Stretch",
      "Performed simultaneously in Couple Suite",
    ],
    targetGuest: "Couples",
    bestBookingTime: "Relaxation evening",
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
    price: "฿3,200 / ฿6,200",
    priceValue: 3200,
    description: "Pre-wedding preparation treatment — relaxation, deep core rebalancing, and a Radiance Glow Mask for a luminous, camera-ready complexion.",
    highlights: [
      "Upper Body Reset",
      "Deep Core Rebalancing",
      "Performance Head Reset",
      "Radiance Glow Mask",
    ],
    targetGuest: "Bride / Pre-wedding / Special occasions",
    bestBookingTime: "Night before the event",
    notes: "Couple Suite required",
    isCouple: true,
    priceNote: "per person (฿6,200 per couple)",
    image: specificImages[10] || treatmentImages["Couple & Special"],
  },

  // Facial Treatments (2 treatments)
  {
    id: 11,
    name: "Sunkiss Facial",
    category: "Facial Treatments",
    duration: "30 / 60 min",
    price: "฿690 / ฿1,490",
    priceValue: 690,
    description: "Targeted cooling and soothing facial for guests with sun-damaged skin — pairs naturally with Sunkiss Recovery.",
    highlights: [
      "Cooling Compress",
      "Aloe & Botanical Soothing Mask",
      "Hydration Essence + Repair Moisturiser",
    ],
    targetGuest: "Guests with heavy sun exposure",
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
    description: "The only facial on the menu where guests choose their own focus — Detox, Brightening, or Hydration — creating a personalised experience unavailable at competitors.",
    highlights: [
      "Customisable focus — Detox & Deep Cleanse",
      "Or Brightening & Radiance",
      "Or Hydration & Nourishment",
      "Lymphatic Drainage Facial Massage",
      "High-quality products matched to skin type",
    ],
    targetGuest: "Guests wanting a personalised facial",
    bestBookingTime: "Any time",
    notes: "",
    image: specificImages[12] || treatmentImages["Facial Treatments"],
  },

  // Classic Thai Heritage (3 treatments)
  {
    id: 13,
    name: "Royal Thai Balance",
    category: "Classic Thai Heritage",
    duration: "60 / 90 min",
    price: "฿900 / ฿1,350",
    priceValue: 900,
    description: "Traditional Thai therapy elevated with joint mobility work — no oil, full-body stretch and acupressure.",
    highlights: [
      "Full-body Thai Stretch",
      "Acupressure",
      "Joint Mobility Work",
    ],
    targetGuest: "All guests",
    bestBookingTime: "Any time",
    notes: "Traditional methods",
    image: specificImages[13] || treatmentImages["Classic Thai Heritage"],
  },
  {
    id: 14,
    name: "Aroma Relaxation Massage",
    category: "Classic Thai Heritage",
    duration: "60 / 90 min",
    price: "฿1,100 / ฿1,980",
    priceValue: 1100,
    description: "Deep full-body relaxation with premium aromatherapy oils — hotel-quality oil selection above the standard of local competitors.",
    highlights: [
      "Aromatherapy Oil Massage",
      "Full-body Relaxation",
      "Circulation Boost",
      "Premium Essential Oils",
    ],
    targetGuest: "All guests",
    bestBookingTime: "Any time",
    notes: "Traditional methods",
    image: specificImages[14] || treatmentImages["Classic Thai Heritage"],
  },
  {
    id: 15,
    name: "Thai Herbal Compress Therapy",
    category: "Classic Thai Heritage",
    duration: "60 / 90 min",
    price: "฿1,440 / ฿1,890",
    priceValue: 1440,
    description: "Traditional herbal compress with freshly prepared balls — deep heat penetration beyond standard oil massage.",
    highlights: [
      "Warm Herbal Compress (prepared fresh)",
      "Deep Muscle Release",
      "Circulation Stimulation",
    ],
    targetGuest: "All guests / Deep muscle relief",
    bestBookingTime: "Any time",
    notes: "Traditional methods",
    image: specificImages[15] || treatmentImages["Classic Thai Heritage"],
  },
];

export const addOns: AddOn[] = [
  {
    id: 16,
    name: "Foot Boost",
    duration: "15 min",
    price: 350,
    techniques: [
      "Warm Welcome Touch",
      "Reflex Point Stimulation (Solar Plexus, Kidney Zone, Digestive Zone)",
      "Finishing Relaxation",
    ],
    pairsWith: "All foot / leg treatments",
    image: specificImages[16] || treatmentImages["Top-Up / Add-On"],
  },
  {
    id: 17,
    name: "Head Reset",
    duration: "15 min",
    price: 320,
    techniques: [
      "Gentle Scalp Warm-up",
      "Base-of-Skull Pressure Release",
      "Deep Scalp Massage",
      "Neck Tension Release",
    ],
    pairsWith: "Office Syndrome Relief / Voyage Revival / Facial treatments",
    image: specificImages[17] || treatmentImages["Top-Up / Add-On"],
  },
  {
    id: 18,
    name: "Thai Herbal Compress",
    duration: "15 min",
    price: 390,
    techniques: [
      "Warm Herbal Compress Preparation",
      "Gentle Pressing Along Tension Areas",
      "Rhythmic Application",
      "Light Finishing Massage",
    ],
    pairsWith: "All massage treatments",
    image: specificImages[18] || treatmentImages["Top-Up / Add-On"],
  },
  {
    id: 19,
    name: "Screen Relief Treatment",
    duration: "15 min",
    price: 350,
    techniques: [
      "Warm Eye Compress Application",
      "Scalp Reset Techniques",
      "Gentle Temple Relaxation Massage",
      "Finishing Relaxation Strokes",
    ],
    pairsWith: "Office Syndrome Relief / Facial treatments",
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

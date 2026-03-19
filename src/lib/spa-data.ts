export interface Treatment {
  id: number;
  name: string;
  alternateNames: string[];
  category: string;
  idealFor: string[];
  duration: string;
  price: string;
  priceValue: number;
  description: string;
  highlights: string[];
  notes: string;
  flow: string[];
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
  2: "/images/shutterstock_2452280721_resize.jpg",
  3: "/images/shutterstock_2497508867_resize.jpg",
  4: "/images/shutterstock_2520861525_resize.jpg",
  5: "/images/Royal Spa 7.jpg",
  6: "/images/Royal Spa 8.jpg",
  7: "/images/Royal Spa 9.jpg",
  8: "/images/Royal Spa 10.jpg",
  9: "/images/Royal Spa 11.jpg",
  10: "/images/Royal Spa 12.jpg",
  11: "/images/Royal Spa 13.jpg",
  12: "/images/Royal Wellness Spa 1.jpg",
  13: "/images/Royal Wellness Spa 2.jpg",
  14: "/images/Royal Wellness Spa 3.jpg",
  15: "/images/Royal Wellness Spa 4.jpg",
  16: "/images/Royal Wellness Spa 5.jpg",
  17: "/images/Royal Wellness Spa 6.jpg",
  18: "/images/Royal Wellness Spa 7.jpg",
  19: "/images/Royal Wellness Spa 8.jpg",
  20: "/images/Royal Wellness Spa 9.jpg",
  21: "/images/Royal Wellness Spa 10.jpg",
  22: "/images/shutterstock_232040092_resize.jpg",
  23: "/images/shutterstock_2364665635_resize.jpg",
  24: "/images/shutterstock_2452786083_resize.jpg",
};

export const treatments: Treatment[] = [
  {
    id: 1,
    name: "Digital Detox Recovery",
    alternateNames: ["Digital Detox Head Recovery", "Urban Screen Recovery"],
    category: "Travel Recovery",
    idealFor: ["Digital nomads", "Remote workers", "Screen fatigue sufferers"],
    duration: "45 / 90 / 120 min",
    price: "890 / 2,090 / 2,490",
    priceValue: 890,
    description: "Targets neck, shoulders, upper back, and scalp tension from prolonged screen time. Restores mental clarity and relieves eye strain.",
    highlights: ["Neck & shoulder therapy", "Head & scalp relaxation", "Warm eye compress", "Gentle back release"],
    notes: "45 min = head-focused entry; 90/120 min = full recovery",
    flow: [
      "Head & Scalp Relaxation",
      "Neck & Shoulder Release",
      "Warm Eye Compress",
      "Relaxing Aroma Breathing Ritual",
      "Deep Scalp Circulation Therapy",
      "Mind Calm Integration"
    ],
    image: specificImages[1]
  },
  {
    id: 2,
    name: "Urban Posture Reset",
    alternateNames: ["Remote Worker Reset", "Sitting Lifestyle Recovery"],
    category: "Travel Recovery",
    idealFor: ["Remote workers", "Office lifestyle", "Long sitting hours"],
    duration: "90 / 120 min",
    price: "2,090 / 2,490",
    priceValue: 2090,
    description: "Releases back, hip, and shoulder tension from prolonged sitting. Restores posture, mobility, and re-energizes tired muscles.",
    highlights: ["Deep back & shoulder release", "Hip & lower back relaxation", "Gentle stretching", "Circulation stimulation"],
    notes: "Closely related to Digital Detox Recovery—can upsell",
    flow: [],
    image: specificImages[2]
  },
  {
    id: 3,
    name: "Jet Lag Recovery Ritual",
    alternateNames: ["Royal Jet Lag Recovery Ritual", "After Flight Recovery"],
    category: "Travel Recovery",
    idealFor: ["Long-haul travelers", "Jet lag recovery", "Post-flight fatigue"],
    duration: "90 / 120 min",
    price: "2,190 / 2,590",
    priceValue: 2190,
    description: "Restores the body after long flights via circulation support, lymphatic flow, and full-body relaxation.",
    highlights: ["Foot awakening ritual", "Circulation boost leg flow", "Lymph flow activation", "Back & shoulder release", "Aroma relaxation", "Warm eye compress"],
    notes: "Can add Breathing Reset add-on",
    flow: [
      "Foot Awakening Ritual (10 min)",
      "Circulation Boost Leg Flow (20 min)",
      "Lymph Flow Activation (15 min)",
      "Back & Shoulder Release (25 min)",
      "Aroma Relaxation (10 min)",
      "Warm Eye Compress (10 min)"
    ],
    image: specificImages[3]
  },
  {
    id: 4,
    name: "Urban Walking Recovery",
    alternateNames: ["Balance & Realign Recovery", "Phuket Old Town Recovery", "Lower Body Recovery"],
    category: "Travel Recovery",
    idealFor: ["City tourists", "Sightseeing travelers", "Walking Street visitors"],
    duration: "90 / 120 min",
    price: "2,090 / 2,490",
    priceValue: 2090,
    description: "Relieves tension in hips, legs, and feet from long sightseeing days. Restores lower body alignment, balance, and energy.",
    highlights: ["Lower body alignment & recovery", "Myofascial reset", "Mobility restore stretch"],
    notes: "Related to Foot Recovery Boost add-on (15 min)",
    flow: [
      "Lower Body Alignment & Recovery",
      "Myofascial Reset",
      "Mobility Restore Stretch"
    ],
    image: specificImages[4]
  },
  {
    id: 5,
    name: "Active Body Recovery",
    alternateNames: ["Active Muscle Recovery", "Athlete Recovery Therapy", "Sport Recovery Ritual", "Performance Muscle Recovery"],
    category: "Travel Recovery",
    idealFor: ["Gym & fitness", "Muay Thai practitioners", "Sports activities", "Active travelers"],
    duration: "90 / 120 min",
    price: "2,290 / 2,790",
    priceValue: 2290,
    description: "Warming recovery for active guests. Releases muscle fatigue, restores mobility, and supports natural recovery after physical activity.",
    highlights: ["Foot activation", "Warm oil muscle preparation", "Deep muscle release", "Mobility restore stretch", "Head reset"],
    notes: "Highest-priced recovery menu",
    flow: [
      "Foot Activation (5 min)",
      "Warm Oil Muscle Preparation (10 min)",
      "Deep Muscle Release (30 min)",
      "Mobility Restore Stretch (10 min)",
      "Head Reset (5 min)"
    ],
    image: specificImages[5]
  },
  {
    id: 6,
    name: "Royal Grounding Recovery Ritual",
    alternateNames: ["Signature Foot & Full Recovery Ritual"],
    category: "Travel Recovery",
    idealFor: ["Long walkers", "Travelers", "Lower-body fatigue"],
    duration: "45 / 90 min",
    price: "790 / 1,790",
    priceValue: 790,
    description: "Spa's signature foot therapy. Restores circulation, releases deep leg tension, and rebalances the body from the ground up.",
    highlights: ["Circulation activation & hip mobility", "Lower body deep tissue therapy", "Therapeutic foot reflexology", "Shoulder flow opening", "Arm & hand relaxation", "Head relaxation therapy"],
    notes: "Best entry point for foot-focused guests",
    flow: [
      "Circulation Activation & Hip Mobility (10 min)",
      "Lower Body Deep Tissue Therapy (25 min)",
      "Therapeutic Foot Reflexology (20 min)",
      "Shoulder Flow Opening (15 min)",
      "Arm & Hand Relaxation (10 min)",
      "Head Relaxation Therapy (10 min)"
    ],
    image: specificImages[6]
  },
  {
    id: 7,
    name: "After-Sun Skin Recovery",
    alternateNames: ["Sun Recovery Skin Ritual", "After-Sun Revitalizing Ritual", "Tropical Skin Revival"],
    category: "Skin & Radiance",
    idealFor: ["Tourists", "Sun-exposed travelers", "Leisure vacation guests"],
    duration: "120 min",
    price: "2,990",
    priceValue: 2990,
    description: "Restores skin from sun exposure and travel stress using organic oils and botanical ingredients. Deeply hydrates and revitalizes.",
    highlights: ["Organic body polish", "Core muscle rebalancing", "Nourishing skin infusion", "Aroma relaxation", "Professional head reset", "Warm eye compress"],
    notes: "Alternative names: Sun-Kissed Skin Recovery; Radiant Skin Renewal Ritual",
    flow: [
      "Organic Body Polish",
      "Core Muscle Rebalancing",
      "Nourishing Skin Infusion",
      "Aroma Relaxation",
      "Professional Head Reset",
      "Warm Eye Compress"
    ],
    image: specificImages[7]
  },
  {
    id: 8,
    name: "Royal Glow Renewal Ritual",
    alternateNames: ["Royal Radiance Renewal", "Golden Glow Rejuvenation", "Ultimate Glow Renewal"],
    category: "Skin & Radiance",
    idealFor: ["All guests seeking full-body + facial renewal"],
    duration: "150 min",
    price: "3,890",
    priceValue: 3890,
    description: "Ultimate signature ritual combining body and facial renewal. Restores youthful energy, radiant skin, and deep relaxation.",
    highlights: ["Organic body polish", "Core muscle rebalancing", "Nourishing aromatherapy massage", "Royal Glow Recovery Facial", "Warm eye compress"],
    notes: "SIGNATURE treatment — flagship upsell",
    flow: [
      "Organic Body Polish",
      "Core Muscle Rebalancing",
      "Nourishing Aromatherapy Massage",
      "Royal Glow Recovery Facial (Deep Cleansing, Exfoliation, Hydration Mask, Sculpting Lift Massage)",
      "Warm Eye Compress"
    ],
    image: specificImages[8]
  },
  {
    id: 9,
    name: "Royal Radiance Body Ritual",
    alternateNames: ["Golden Glow Body Ritual", "Silk Skin Revitalizing Ritual"],
    category: "Couple & Special",
    idealFor: ["Urban tourists", "Guests seeking skin rejuvenation"],
    duration: "120 min",
    price: "5,400",
    priceValue: 5400,
    description: "Luxurious couple-priced skin renewal combining exfoliation, nourishing massage, and aromatherapy for smoother, brighter skin.",
    highlights: ["Organic body polish", "Core muscle rebalancing", "Nourishing skin infusion", "Aroma relaxation", "Professional head reset", "Warm eye compress"],
    notes: "Per couple pricing",
    flow: [
      "Organic Body Polish",
      "Core Muscle Rebalancing",
      "Nourishing Skin Infusion",
      "Aroma Relaxation",
      "Professional Head Reset",
      "Warm Eye Compress"
    ],
    image: specificImages[9]
  },
  {
    id: 10,
    name: "Traveler's Couple Reset",
    alternateNames: ["Royal Couple Renewal", "Couple Rebalance Ritual", "Couple Urban Recovery", "Traveler Couple Retreat"],
    category: "Couple & Special",
    idealFor: ["Couples after travel", "Sightseeing couples", "Leisure travelers"],
    duration: "90 / 120 min",
    price: "4,090 / 4,890",
    priceValue: 4090,
    description: "Restorative shared experience releasing accumulated travel tension, restoring lower body energy, and promoting couple relaxation.",
    highlights: ["Lower body alignment & recovery", "Myofascial reset", "Mobility restore stretch"],
    notes: "Per couple pricing",
    flow: [
      "Lower Body Alignment & Recovery",
      "Myofascial Reset",
      "Mobility Restore Stretch"
    ],
    image: specificImages[10]
  },
  {
    id: 11,
    name: "Bridal Radiance Preparation Ritual",
    alternateNames: ["Wedding Day Radiance Ritual", "Bridal Glow Preparation", "Royal Bridal Renewal", "Bridal Calm & Glow Ritual"],
    category: "Couple & Special",
    idealFor: ["Pre-wedding", "Special occasions", "Photo/event preparation"],
    duration: "120 min",
    price: "3,200 / 6,200",
    priceValue: 3200,
    description: "Calming pre-wedding ritual releasing neck & shoulder tension, restoring posture, and revitalizing skin for a natural glow.",
    highlights: ["Upper body reset", "Deep core rebalancing", "Aroma relaxation", "Performance head reset", "Warm eye compress", "Radiance glow mask"],
    notes: "3,200/person or 6,200/couple",
    flow: [
      "Upper Body Reset",
      "Deep Core Rebalancing",
      "Aroma Relaxation",
      "Performance Head Reset",
      "Warm Eye Compress",
      "Radiance Glow Mask"
    ],
    image: specificImages[11]
  },
  {
    id: 12,
    name: "Urban Detox Facial",
    alternateNames: ["Pollution Defense Therapy"],
    category: "Facial Treatments",
    idealFor: ["City travelers", "Pollution-exposed guests"],
    duration: "30 / 60 min",
    price: "590 / 1,690",
    priceValue: 590,
    description: "Removes pollution, PM2.5, and excess oil. Detoxifies pores and restores a fresh, balanced complexion.",
    highlights: ["Gentle cleansing", "Mild exfoliation", "Charcoal mask", "Lymphatic facial massage", "Balancing serum", "Moisturizing protection"],
    notes: "",
    flow: [],
    image: specificImages[12]
  },
  {
    id: 13,
    name: "After-Sun Recovery Facial",
    alternateNames: ["Tropical Skin Soothing Therapy"],
    category: "Facial Treatments",
    idealFor: ["Sun-exposed travelers", "Tropical climate guests"],
    duration: "30 / 60 min",
    price: "590 / 1,690",
    priceValue: 590,
    description: "Calms skin stressed by tropical sun. Reduces redness, cools the skin, and restores the skin barrier.",
    highlights: ["Gentle cleansing", "Cooling compress", "Aloe/botanical soothing mask", "Relaxing facial massage", "Hydration essence", "Repair moisturizer"],
    notes: "Pairs well with Urban Skin Recovery body treatment",
    flow: [],
    image: specificImages[13]
  },
  {
    id: 14,
    name: "Hydration Boost Facial",
    alternateNames: ["Deep Moisture Therapy"],
    category: "Facial Treatments",
    idealFor: ["Dehydrated skin", "All travelers"],
    duration: "30 / 60 min",
    price: "590 / 1,690",
    priceValue: 590,
    description: "Deeply replenishes lost moisture and revives tired skin. Improves elasticity and softness.",
    highlights: ["Gentle cleansing", "Soft exfoliation", "Hydrating essence infusion", "Relaxing facial massage", "Hydration mask", "Moisture lock serum"],
    notes: "",
    flow: [],
    image: specificImages[14]
  },
  {
    id: 15,
    name: "Radiant Vitamin C Facial",
    alternateNames: ["Glow & Brightening Therapy"],
    category: "Facial Treatments",
    idealFor: ["Dull skin", "Guests seeking brightening"],
    duration: "30 / 60 min",
    price: "590 / 1,690",
    priceValue: 590,
    description: "Brightens dull skin and restores luminous glow using Vitamin C. Improves skin tone clarity and natural radiance.",
    highlights: ["Gentle cleansing", "Enzyme exfoliation", "Vitamin C serum infusion", "Facial massage", "Brightening mask", "Glow finishing cream"],
    notes: "",
    flow: [],
    image: specificImages[15]
  },
  {
    id: 16,
    name: "Jet Lag Recovery Facial",
    alternateNames: ["Traveler Skin Reset Therapy"],
    category: "Facial Treatments",
    idealFor: ["Long-haul travelers", "Post-flight fatigue"],
    duration: "30 / 60 min",
    price: "590 / 1,690",
    priceValue: 590,
    description: "Restores hydration and vitality lost during flights. Reduces puffiness, tired eyes, and dull skin.",
    highlights: ["Gentle cleansing", "Hydration essence", "Relaxing facial massage", "Cooling eye mask", "Hydrating recovery mask", "Moisture lock serum"],
    notes: "Pairs with Jet Lag Recovery Ritual body treatment",
    flow: [],
    image: specificImages[16]
  },
  {
    id: 17,
    name: "Royal Wellness Signature Facial",
    alternateNames: ["Ultimate Rejuvenation Ritual"],
    category: "Facial Treatments",
    idealFor: ["All guests seeking premium facial"],
    duration: "90 min",
    price: "2,790",
    priceValue: 2790,
    description: "Signature facial ritual combining advanced massage, botanical nourishment, and deep hydration. Improves firmness, circulation, and natural radiance.",
    highlights: ["Welcome aromatherapy breathing", "Gentle cleansing", "Enzyme exfoliation", "Royal lifting facial massage", "Nourishing collagen mask", "Neck & shoulder relaxation", "Intensive serum infusion", "Moisture lock finishing cream"],
    notes: "SIGNATURE facial — flagship upsell",
    flow: [
      "Welcome Aromatherapy Breathing",
      "Gentle Cleansing",
      "Enzyme Exfoliation",
      "Royal Lifting Facial Massage",
      "Nourishing Collagen Mask",
      "Neck & Shoulder Relaxation",
      "Intensive Serum Infusion",
      "Moisture Lock Finishing Cream"
    ],
    image: specificImages[17]
  },
  {
    id: 18,
    name: "Royal Thai Balance",
    alternateNames: [],
    category: "Classic Thai Heritage",
    idealFor: ["All guests"],
    duration: "60 / 90 min",
    price: "1,290 / 1,690",
    priceValue: 1290,
    description: "Traditional Thai stretching and pressure techniques to improve flexibility, release muscle tension, and restore natural body balance.",
    highlights: ["Full-body Thai stretch", "Acupressure", "Joint mobility work"],
    notes: "",
    flow: [],
    image: specificImages[18]
  },
  {
    id: 19,
    name: "Aroma Relaxation Massage",
    alternateNames: [],
    category: "Classic Thai Heritage",
    idealFor: ["All guests"],
    duration: "60 / 90 min",
    price: "1,390 / 1,790",
    priceValue: 1390,
    description: "Soothing full-body massage using aromatic essential oils to promote deep relaxation, improve circulation, and relieve everyday tension.",
    highlights: ["Aromatherapy oil massage", "Full-body relaxation", "Circulation boost"],
    notes: "",
    flow: [],
    image: specificImages[19]
  },
  {
    id: 20,
    name: "Thai Herbal Compress Therapy",
    alternateNames: ["Thai Herbal Heat Therapy"],
    category: "Classic Thai Heritage",
    idealFor: ["All guests"],
    duration: "60 / 90 min",
    price: "1,590 / 1,990",
    priceValue: 1590,
    description: "Traditional Thai massage combined with warm herbal compress to relieve muscle stiffness, stimulate circulation, and promote deep relaxation.",
    highlights: ["Warm herbal compress", "Deep muscle release", "Circulation stimulation"],
    notes: "Top-up 15-min version: 390 THB",
    flow: [],
    image: specificImages[20]
  },
  {
    id: 21,
    name: "Foot Recovery Boost",
    alternateNames: ["Reflex Foot Refresh"],
    category: "Top-Up / Add-On",
    idealFor: ["Walkers", "Travelers", "Fatigue relief"],
    duration: "15 min",
    price: "350",
    priceValue: 350,
    description: "Focused reflexology boost to relieve foot fatigue, stimulate circulation, and restore lightness to tired legs.",
    highlights: ["Warm welcome touch", "Foot warm-up", "Reflex point stimulation", "Finishing relaxation"],
    notes: "Add-on to any lower-body treatment",
    flow: [],
    image: specificImages[21]
  },
  {
    id: 22,
    name: "Head Reset Therapy",
    alternateNames: ["Deep Scalp & Neck Relaxation"],
    category: "Top-Up / Add-On",
    idealFor: ["Mental stress", "Long screen hours"],
    duration: "15 min",
    price: "320",
    priceValue: 320,
    description: "Focused head and neck therapy releasing tension from mental stress and screen use. Stimulates scalp circulation and calms the nervous system.",
    highlights: ["Gentle scalp warm-up", "Base-of-skull pressure release", "Deep scalp massage", "Neck tension release"],
    notes: "Add-on to any treatment",
    flow: [],
    image: specificImages[22]
  },
  {
    id: 23,
    name: "Thai Herbal Heat Therapy",
    alternateNames: ["Thai Herbal Compress Enhancement"],
    category: "Top-Up / Add-On",
    idealFor: ["Muscle stiffness", "General relaxation enhancement"],
    duration: "15 min",
    price: "390",
    priceValue: 390,
    description: "Traditional Thai herbal compress to deepen muscle relaxation and stimulate circulation during any treatment.",
    highlights: ["Warm herbal compress preparation", "Gentle pressing along tension areas", "Rhythmic herbal compress application", "Light finishing massage"],
    notes: "Enhancement for any massage",
    flow: [],
    image: specificImages[23]
  },
  {
    id: 24,
    name: "Screen Relief Treatment",
    alternateNames: ["Digital Eye Relief", "Warm Eye Compress Add-On"],
    category: "Top-Up / Add-On",
    idealFor: ["Digital nomads", "Remote workers", "Screen fatigue"],
    duration: "15 min",
    price: "350",
    priceValue: 350,
    description: "Relieves eye strain and mental fatigue from screen use using warm eye compress therapy and gentle scalp reset.",
    highlights: ["Warm eye compress application", "Scalp reset techniques", "Gentle temple relaxation massage", "Finishing relaxation strokes"],
    notes: "Can pair with any head/neck treatment",
    flow: [],
    image: specificImages[24]
  }
];

export const getTreatmentsByCategory = (category: Category): Treatment[] => {
  return treatments.filter(t => t.category === category);
};

export const getTreatmentById = (id: number): Treatment | undefined => {
  return treatments.find(t => t.id === id);
};

export const getSignatureTreatments = (): Treatment[] => {
  return treatments.filter(t => t.notes.toLowerCase().includes('signature'));
};

export const spaInfo = {
  name: "Royal Wellness Spa",
  tagline: "Massage & Spa",
  location: "3rd Floor",
  hours: "10AM - 11PM",
  description: "Indulge in a tranquil spa experience designed to restore balance to both body and mind. With expert massage techniques and premium aromatic oils, our spa offers a serene escape that leaves you feeling refreshed, relaxed, and completely renewed.",
  address: "Phuket, Thailand",
  phone: "+66 XX XXX XXXX",
  email: "info@royalwellnessspa.com"
};

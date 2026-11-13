export interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  isSlider?: boolean;
  createdAt?: string | Date;
}

export interface ProductItem {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  imageKitFileId?: string;
  images?: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  features?: string[];
  tags?: string[];
  details?: {
    duration?: string;
    type?: string;
    supervision?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode?: string;
    country?: string;
  };
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "cod" | "bank_transfer" | "card";
  paymentStatus: "pending" | "paid";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export const DEFAULT_GALLERY_IMAGES: GalleryItem[] = [
  {
    _id: "def_1",
    title: "Inpatient Recovery Suites",
    category: "Rooms",
    description: "Comfortable, quiet and climate-controlled private rooms designed for deep rest and dignity.",
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
    isSlider: true,
  },
  {
    _id: "def_2",
    title: "Psychiatric & Clinical Consultation",
    category: "Psychiatry",
    description: "Confidential one-on-one evaluations with consultant psychiatrists and clinical psychologists.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    isSlider: true,
  },
  {
    _id: "def_3",
    title: "Medically Supervised Detox Station",
    category: "Detox",
    description: "24/7 nursing and medical vital signs monitoring during acute withdrawal phases.",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
    isSlider: true,
  },
  {
    _id: "def_4",
    title: "Group Therapy & Coping Skills Session",
    category: "Therapy",
    description: "Structured relapse-prevention groups, peer recovery circles, and cognitive behavioral therapy.",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    isSlider: true,
  },
  {
    _id: "def_5",
    title: "Healing Gardens & Quiet Reflection Grounds",
    category: "Environment",
    description: "Peaceful green courtyards, shaded sitting areas, and spaces for contemplation and prayer.",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
    isSlider: true,
  },
  {
    _id: "def_6",
    title: "Hygienic Dining & Nutritional Support",
    category: "Wellness",
    description: "Wholesome, dietitian-planned daily meals that replenish physical energy during rehabilitation.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    isSlider: false,
  },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    _id: "prod_1",
    title: "Comprehensive Inpatient Detoxification Program (30 Days)",
    slug: "inpatient-detox-program-30-days",
    description: "Full residential medical detox program under 24/7 physician and consultant psychiatrist supervision. Includes private room accommodation, medical withdrawal stabilization, daily vital checks, psychiatric reviews, and nutritious meals.",
    price: 3200,
    originalPrice: 3800,
    category: "Rehab Programs",
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewsCount: 38,
    featured: true,
    tags: ["Inpatient", "Detox", "Supervised"],
    details: {
      duration: "30 Days Inpatient",
      type: "Medical Detox & Rehab",
      supervision: "24/7 Doctors & Psychiatrists"
    },
    createdAt: new Date("2026-01-01"),
  },
  {
    _id: "prod_2",
    title: "Senior Consultant Psychiatrist Initial Evaluation",
    slug: "senior-consultant-psychiatrist-evaluation",
    description: "Confidential in-depth 60-minute psychiatric clinical diagnosis and personalized treatment planning with our consultant psychiatrist. Covers mood disorders, anxiety, addiction severity, and medical prescription management.",
    price: 250,
    category: "Psychiatric Care",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 50,
    rating: 5.0,
    reviewsCount: 64,
    featured: true,
    tags: ["Psychiatry", "Consultation", "Doctor"],
    details: {
      duration: "60 Minutes",
      type: "Clinical Evaluation",
      supervision: "Dr. Sarah Ahmed"
    },
    createdAt: new Date("2026-01-02"),
  },
  {
    _id: "prod_3",
    title: "Cognitive Behavioral Therapy (CBT) Package (6 Sessions)",
    slug: "cbt-therapy-package-6-sessions",
    description: "Evidence-based one-on-one psychological counseling package with senior clinical psychologists. Focused on root trigger identification, stress resilience, relapse prevention, and cognitive restructuring.",
    price: 720,
    originalPrice: 900,
    category: "Psychotherapy",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 30,
    rating: 4.8,
    reviewsCount: 29,
    featured: true,
    tags: ["Psychology", "Therapy", "CBT"],
    details: {
      duration: "6 Sessions (50 mins each)",
      type: "Clinical Psychology",
      supervision: "Dr. James Mitchell"
    },
    createdAt: new Date("2026-01-03"),
  },
  {
    _id: "prod_4",
    title: "Neuro-Nutrition & Brain Recovery Wellness Pack",
    slug: "neuro-nutrition-brain-recovery-pack",
    description: "Doctor-approved multi-micronutrient, Omega-3 high-EPA, and restorative amino acid complex designed to replenish neurotransmitters and reduce physical cravings during early recovery.",
    price: 110,
    category: "Supplements & Care",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 45,
    rating: 4.9,
    reviewsCount: 19,
    featured: false,
    tags: ["Supplements", "Wellness", "Nutrition"],
    details: {
      duration: "30-Day Supply",
      type: "Nutritional Supplement",
      supervision: "Clinical Dietitian Reviewed"
    },
    createdAt: new Date("2026-01-04"),
  },
];

export interface FacilitySlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  alt: string;
}

export const FACILITY_SLIDES: FacilitySlide[] = [
  {
    id: "recovery-suites",
    tag: "Accommodation",
    title: "Private Inpatient Recovery Suites",
    subtitle: "Quiet, hotel-grade private rooms designed for restful healing and 24/7 clinical safety.",
    description:
      "Each suite is a calm, single-occupancy space with natural light, private bathroom facilities and direct nursing access, so residents can rest without noise or disruption.",
    highlights: [
      "Private en-suite rooms with 24/7 nursing rounds",
      "Supervised visitor policy and family accommodation",
      "Daily housekeeping and dietitian-led meal service",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1600&q=80",
    alt: "Private inpatient recovery suite with a neatly prepared bed and soft natural light",
  },
  {
    id: "detox-unit",
    tag: "Clinical Care",
    title: "24/7 Supervised Detoxification Unit",
    subtitle: "Continuous physician and nursing monitoring for safe, comfortable withdrawal management.",
    description:
      "Our medically managed detox unit is staffed around the clock, with continuous observation, comfort protocols and rapid escalation pathways for any clinical change.",
    highlights: [
      "Continuous vital-signs and withdrawal scoring",
      "On-call physician and consultant psychiatrist",
      "Medically managed comfort and hydration protocols",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80",
    alt: "Bright, medically equipped hospital corridor leading to the supervised detoxification unit",
  },
  {
    id: "psychiatry-suites",
    tag: "Psychiatry",
    title: "Confidential Psychiatric Suites",
    subtitle: "Private, sound-insulated consultation rooms for personalized dual-diagnosis assessment.",
    description:
      "Consultations take place in discreet, sound-insulated rooms designed to protect dignity and privacy, supported by a full psychiatric assessment and medication review.",
    highlights: [
      "Sound-insulated, single-occupancy consultation rooms",
      "Dual-diagnosis assessment and medication review",
      "Completely confidential records and controlled access",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80",
    alt: "Consultant psychiatrist speaking with a patient in a private consultation suite",
  },
  {
    id: "therapy-lounges",
    tag: "Therapy",
    title: "Counseling & Group Therapy Lounges",
    subtitle: "Warm, natural-lit spaces dedicated to CBT, trauma recovery, and family counseling.",
    description:
      "Group and one-to-one sessions run in warm, naturally lit lounges with flexible seating, giving residents room to speak openly and reconnect with family in a supported setting.",
    highlights: [
      "CBT, DBT and trauma-informed group sessions",
      "Family counselling and relapse-prevention planning",
      "Natural-lit lounges with quiet breakout corners",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80",
    alt: "Comfortable therapy lounge set up for a small group counselling session",
  },
  {
    id: "healing-gardens",
    tag: "Environment",
    title: "Serene Healing Gardens",
    subtitle: "Secure, landscaped outdoor walkways promoting mindfulness, calm, and physical restoration.",
    description:
      "Supervised gardens and courtyards give residents a safe, green space for gentle walking, prayer and quiet reflection away from the clinical environment.",
    highlights: [
      "Secure, supervised landscaped walkways",
      "Dedicated prayer and quiet reflection areas",
      "Daily guided mindfulness and gentle movement",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80",
    alt: "Green landscaped healing garden with shaded walkways and quiet seating",
  },
  {
    id: "wellness-dining",
    tag: "Wellness",
    title: "Mind-Body Wellness & Dining Lounge",
    subtitle: "Nutritional therapy, guided meditation, and structured daily wellness routines.",
    description:
      "Shared dining and wellness spaces anchor the daily routine, combining dietitian-planned nutrition with meditation, sleep hygiene and structured social connection.",
    highlights: [
      "Dietitian-planned, nutritionally balanced meals",
      "Guided meditation and sleep-hygiene routines",
      "Supervised dining lounge for social connection",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    alt: "Calm dining and wellness lounge with shared tables and warm lighting",
  },
];

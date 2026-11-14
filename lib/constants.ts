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

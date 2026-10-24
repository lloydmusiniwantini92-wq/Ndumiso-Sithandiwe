export interface JourneyItem {
  id: number;
  date: string;
  subtitle?: string;
  image: string;
  text: string;
  likes: number;
}

export interface LookbookItem {
  id: string;
  lookNumber: string;
  category: 'ladies' | 'gentlemen';
  image: string;
  title: string;
  subtitle: string;
  stylingNote: string;
}

export const weddingEventConfig = {
  coupleNames: 'Ndumiso & Sithandiwe',
  dateDisplay: 'December 30, 2026',
  dateISO: '2026-12-30T14:00:00+02:00',
  rsvpDeadline: 'November 30th, 2026',
  venueName: 'Lakeside Events Centre',
  venueAddress: 'Along Plumtree Road (14km from CBD, past Mbokodo)',
  venueCity: 'Bulawayo, Zimbabwe',
  ceremonyTime: '2:00 PM',
  receptionTime: '5:00 PM',
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=Lakeside+Events+Centre+Plumtree+Road+Bulawayo+Zimbabwe&t=&z=13&ie=UTF8&iwloc=&output=embed',
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Lakeside+Events+Centre+Plumtree+Road+Bulawayo+Zimbabwe',
};

export const journeyData: JourneyItem[] = [
  {
    id: 1,
    date: '2021',
    image: '/photos/couple-standing-smile.jpg',
    text: 'A spark over shared plates and endless conversation. Our story began under a crescent moon.',
    likes: 45,
  },
  {
    id: 2,
    date: 'July 2023',
    image: '/photos/couple-back-to-back.jpg',
    text: 'Sun-drenched memories and waves of joy. Adventures became our language and laughter our home.',
    likes: 62,
  },
  {
    id: 3,
    date: 'December 2024',
    subtitle: 'The Question',
    image: '/photos/couple-embrace-ring.jpg',
    text: 'Underneath the stars and amidst blooming roses, he asked forever. And she said yes.',
    likes: 128,
  },
  {
    id: 4,
    date: 'November 2025',
    subtitle: 'The Engagement',
    image: '/photos/couple-gazing-smile.jpg',
    text: 'Surrounded by our closest friends and family, we toasted to the future and danced until dawn.',
    likes: 184,
  },
  {
    id: 5,
    date: 'December 30, 2026',
    subtitle: 'Tying The Knot',
    image: '/photos/couple-embrace-tender.jpg',
    text: 'The day two souls become one at Lakeside Events in Bulawayo. A celebration of love, commitment, and a lifetime of shared dreams.',
    likes: 240,
  },
];

export const carouselImages: string[] = [
  '/photos/couple-embrace-ring.jpg',
  '/photos/couple-embrace-direct.jpg',
  '/photos/couple-embrace-tender.jpg',
  '/photos/couple-gazing-smile.jpg',
  '/photos/couple-standing-smile.jpg',
  '/photos/couple-back-to-back.jpg',
  '/photos/couple-seated-standing.jpg',
];

export const avantGardeTransitions = [
  // 1. The Architectural Monolith: Imposing slow push-in from a massive scale with vertical settling
  {
    name: 'Monolith',
    initial: { opacity: 0, scale: 1.22, y: '-6%' },
    animate: {
      opacity: 0.88,
      scale: 1,
      y: '0%',
      transition: { duration: 2.6, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.94,
      y: '4%',
      transition: { duration: 1.6, ease: [0.7, 0, 0.84, 0] },
    },
  },

  // 2. The Horizontal Editorial Curtain: Razor-sharp clip-path wipe from left to right
  {
    name: 'Curtain',
    initial: { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)', scale: 1.08 },
    animate: {
      opacity: 0.88,
      clipPath: 'inset(0% 0% 0% 0%)',
      scale: 1,
      transition: {
        clipPath: { duration: 2.2, ease: [0.77, 0, 0.175, 1] },
        opacity: { duration: 0.8 },
        scale: { duration: 3.5, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      clipPath: 'inset(0% 0% 0% 100%)',
      transition: { duration: 1.6, ease: [0.77, 0, 0.175, 1] },
    },
  },

  // 3. The Diagonal Blade: Avant-garde 45° angular polygon slice
  {
    name: 'Blade',
    initial: { opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', scale: 1.12 },
    animate: {
      opacity: 0.88,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      scale: 1,
      transition: {
        clipPath: { duration: 2.4, ease: [0.65, 0, 0.35, 1] },
        opacity: { duration: 0.8 },
        scale: { duration: 3.5, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.92,
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
  },

  // 4. The Gravity Drop: Imposing downward kinetic descent with torque snap
  {
    name: 'Gravity',
    initial: { opacity: 0, y: '-15%', rotate: -2, scale: 1.1 },
    animate: {
      opacity: 0.88,
      y: '0%',
      rotate: 0,
      scale: 1,
      transition: { duration: 2.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: '8%',
      rotate: 1.2,
      transition: { duration: 1.6, ease: 'easeInOut' },
    },
  },

  // 5. The Center Pillar Shutter: Expanding outwards from central aperture
  {
    name: 'Shutter',
    initial: { opacity: 0, clipPath: 'inset(0% 50% 0% 50%)', scale: 1.15 },
    animate: {
      opacity: 0.88,
      clipPath: 'inset(0% 0% 0% 0%)',
      scale: 1,
      transition: {
        clipPath: { duration: 2.4, ease: [0.85, 0, 0.15, 1] },
        opacity: { duration: 0.8 },
        scale: { duration: 3.5, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      clipPath: 'inset(50% 0% 50% 0%)',
      transition: { duration: 1.5, ease: [0.85, 0, 0.15, 1] },
    },
  },

  // 6. The Lateral Cinema Track: High-contrast horizontal pan gliding from the east
  {
    name: 'Track',
    initial: { opacity: 0, x: '15%', scale: 1.08 },
    animate: {
      opacity: 0.88,
      x: '0%',
      scale: 1,
      transition: { duration: 2.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      x: '-12%',
      scale: 0.94,
      transition: { duration: 1.6, ease: 'easeInOut' },
    },
  },

  // 7. The Royal Iris: Dramatic circular spotlight blossoming around the couple's faces
  {
    name: 'Iris',
    initial: { opacity: 0, clipPath: 'circle(0% at 50% 20%)', scale: 1.18 },
    animate: {
      opacity: 0.88,
      clipPath: 'circle(150% at 50% 20%)',
      scale: 1,
      transition: {
        clipPath: { duration: 2.5, ease: [0.76, 0, 0.24, 1] },
        opacity: { duration: 0.8 },
        scale: { duration: 3.5, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 1.6, ease: 'easeInOut' },
    },
  },
];

export const ladiesInspiration: LookbookItem[] = [
  {
    id: 'lady-1',
    lookNumber: '01',
    category: 'ladies',
    image: '/dresscode/lady_1.png',
    title: 'Couture Evening Gown',
    subtitle: 'Floor-length with gold accents',
    stylingNote: 'Flowing floor-length black silhouette paired with warm gold clutch and sculptural earrings.',
  },
  {
    id: 'lady-2',
    lookNumber: '02',
    category: 'ladies',
    image: '/dresscode/lady_2.png',
    title: 'Satin Off-Shoulder Gown',
    subtitle: 'Structured elegance & silver',
    stylingNote: 'Dramatic off-the-shoulder satin bodice complimented by fine silver and diamond jewelry.',
  },
  {
    id: 'lady-3',
    lookNumber: '03',
    category: 'ladies',
    image: '/dresscode/lady_3.png',
    title: 'Architectural Column Cut',
    subtitle: 'Minimalist chic & gold cuffs',
    stylingNote: 'Clean asymmetrical draped neckline in matte black crepe with statement gold wrist cuffs.',
  },
  {
    id: 'lady-4',
    lookNumber: '04',
    category: 'ladies',
    image: '/dresscode/lady_4.png',
    title: 'Sculptural Mermaid Gown',
    subtitle: 'Tiered ruffles & statement cut',
    stylingNote: 'High-fashion cascading architectural ruffles in midnight black with delicate gold drops.',
  },
];

export const gentsInspiration: LookbookItem[] = [
  {
    id: 'gent-1',
    lookNumber: '01',
    category: 'gentlemen',
    image: '/dresscode/gent_1.png',
    title: 'Peak Lapel Tuxedo',
    subtitle: 'Crisp white shirt & silk bowtie',
    stylingNote: 'Classic bespoke black tuxedo with satin peak lapels, white pleated shirt, and black bowtie.',
  },
  {
    id: 'gent-2',
    lookNumber: '02',
    category: 'gentlemen',
    image: '/dresscode/gent_2.png',
    title: 'Tailored Black Suit',
    subtitle: 'White shirt & formal necktie',
    stylingNote: 'Sharp modern-fit black suit paired with a crisp white collar shirt and sleek black silk tie.',
  },
  {
    id: 'gent-3',
    lookNumber: '03',
    category: 'gentlemen',
    image: '/dresscode/gent_3.png',
    title: 'Velvet Dinner Jacket',
    subtitle: 'Rich texture & classic bowtie',
    stylingNote: 'Plush black velvet dinner jacket with satin lapels, formal white dress shirt, and bowtie.',
  },
  {
    id: 'gent-4',
    lookNumber: '04',
    category: 'gentlemen',
    image: '/dresscode/gent_4.png',
    title: 'Contemporary Evening Cut',
    subtitle: 'Band-collar formal tailoring',
    stylingNote: 'Impeccably tailored black evening suit with a clean modern band-collar silhouette.',
  },
];

export const colorPalette = [
  {
    name: 'Obsidian Black',
    role: 'Main Garment (Required)',
    hex: '#0A0A0A',
    border: '#E8D3B9',
  },
  {
    name: 'Champagne Gold',
    role: "Ladies' Accessories",
    hex: '#D4AF37',
    border: '#E8D3B9',
  },
  {
    name: 'Sterling Silver',
    role: "Ladies' Accessories",
    hex: '#C8CDD0',
    border: '#C8CDD0',
  },
  {
    name: 'Crisp White',
    role: "Gentlemen's Shirt",
    hex: '#FAF8F5',
    border: '#E8D3B9',
  },
];

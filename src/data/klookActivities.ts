export type CategoryId =
  | 'all'
  | 'attractions'
  | 'theme-parks'
  | 'tours'
  | 'day-trips'
  | 'transport';

export type CurrencyCode = 'SGD' | 'MYR' | 'USD';

export type DurationBucket = 'under-3h' | 'half-day' | 'full-day';

export interface PackageOption {
  id: string;
  name: string;
  subtitle: string;
  priceSgd: number;
  originalPriceSgd?: number;
}

export interface Activity {
  id: string;
  title: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  location: string;
  image: string;
  imageAlt: string;
  rating: number;
  reviewsCount: number;
  bookedLabel: string;
  priceSgd: number;
  originalPriceSgd?: number;
  tag?: string;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  skipTheLine: boolean;
  duration: DurationBucket;
  durationLabel: string;
  summary: string;
  highlights: string[];
  included: string[];
  redemptionInfo: string;
  packages: PackageOption[];
}

export interface CategoryTab {
  id: CategoryId;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const HERO_IMAGE = '/src/assets/images/hero_kl_skyline_1795062345238.jpg';

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { symbol: string; rateFromSgd: number; label: string }
> = {
  SGD: { symbol: 'S$', rateFromSgd: 1, label: 'SGD' },
  MYR: { symbol: 'RM', rateFromSgd: 3.32, label: 'MYR' },
  USD: { symbol: 'US$', rateFromSgd: 0.74, label: 'USD' },
};

export function formatPrice(amountSgd: number, currency: CurrencyCode): string {
  const { symbol, rateFromSgd } = CURRENCY_CONFIG[currency];
  const converted = amountSgd * rateFromSgd;
  return `${symbol} ${converted.toFixed(2)}`;
}

export const CATEGORY_TABS: CategoryTab[] = [
  { id: 'all', label: 'All experiences' },
  { id: 'attractions', label: 'Attractions & tickets' },
  { id: 'theme-parks', label: 'Theme parks' },
  { id: 'tours', label: 'Tours & sightseeing' },
  { id: 'day-trips', label: 'Day trips' },
  { id: 'transport', label: 'Transport & passes' },
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'petronas-twin-towers',
    title: 'Petronas Twin Towers Observation Deck & Skybridge Ticket',
    category: 'attractions',
    categoryLabel: 'Attractions',
    location: 'KLCC',
    image: '/src/assets/images/kl_petronas_towers_1795062344875.jpg',
    imageAlt: 'Petronas Twin Towers and Skybridge in Kuala Lumpur against clear blue sky',
    rating: 4.8,
    reviewsCount: 14280,
    bookedLabel: '100K+ booked',
    priceSgd: 34.5,
    originalPriceSgd: 41.0,
    tag: 'Bestseller',
    instantConfirmation: true,
    freeCancellation: false,
    skipTheLine: true,
    duration: 'under-3h',
    durationLabel: '1 hr 30 mins',
    summary:
      'Step onto the world’s highest two-storey skybridge on Levels 41 and 42 before ascending to the 86th-floor Observation Deck for sweeping 360-degree views across Kuala Lumpur.',
    highlights: [
      'Walk across the iconic Skybridge connecting Tower 1 and Tower 2 at 170 meters above ground',
      'Ride high-speed elevators to the Level 86 Observation Deck at 370 meters',
      'Explore interactive digital exhibits detailing the towers’ engineering and spire architecture',
    ],
    included: [
      'Timed-entry admission to Skybridge (Level 41/42) & Observation Deck (Level 86)',
      'Guided group escort throughout the 45-minute tower experience',
      'Mobile e-ticket QR scan at Lower Ground Concourse',
    ],
    redemptionInfo: 'Present mobile QR voucher at Petronas Twin Towers Concourse counter 15 minutes before slot.',
    packages: [
      {
        id: 'petronas-adult',
        name: 'Adult Admission (Non-Malaysian)',
        subtitle: 'Ages 13–60 · Timed entry slot',
        priceSgd: 34.5,
        originalPriceSgd: 41.0,
      },
      {
        id: 'petronas-child',
        name: 'Child Admission (Non-Malaysian)',
        subtitle: 'Ages 3–12 · Timed entry slot',
        priceSgd: 18.2,
        originalPriceSgd: 22.0,
      },
      {
        id: 'petronas-sunset',
        name: 'Golden Hour Sunset Slot + KLCC Transfer',
        subtitle: '17:30–19:00 entry · Hotel drop-off included',
        priceSgd: 48.0,
        originalPriceSgd: 56.0,
      },
    ],
  },
  {
    id: 'aquaria-klcc',
    title: 'Aquaria KLCC Admission Ticket',
    category: 'attractions',
    categoryLabel: 'Attractions',
    location: 'KLCC',
    image: '/src/assets/images/kl_aquaria_klcc_1795062345320.jpg',
    imageAlt: 'Visitors walking through the underwater glass tunnel at Aquaria KLCC with rays overhead',
    rating: 4.8,
    reviewsCount: 28940,
    bookedLabel: '200K+ booked',
    priceSgd: 21.8,
    originalPriceSgd: 25.5,
    tag: 'Instant entry',
    instantConfirmation: true,
    freeCancellation: true,
    skipTheLine: true,
    duration: 'under-3h',
    durationLabel: '2 hours',
    summary:
      'Discover over 5,000 aquatic and land creatures beneath Kuala Lumpur Convention Centre, anchored by a 90-meter transparent underwater tunnel teeming with sand tiger sharks and giant stingrays.',
    highlights: [
      'Stroll through the 90-meter Living Ocean tunnel on a moving travelator',
      'Watch scheduled feeding sessions at the Flooded Forest and Coral Reef zones',
      'Touch bamboo sharks and horseshoe crabs at the interactive Gene Pool',
    ],
    included: [
      'Full-day admission to all Aquaria KLCC exhibition zones',
      'Direct QR code entry without queuing at the ticketing booth',
      'Access to scheduled marine feeding shows',
    ],
    redemptionInfo: 'Scan mobile Klook voucher directly at Aquaria KLCC main turnstiles.',
    packages: [
      {
        id: 'aquaria-adult',
        name: 'Standard Adult Admission',
        subtitle: 'Ages 13–59 · Open-dated within 30 days',
        priceSgd: 21.8,
        originalPriceSgd: 25.5,
      },
      {
        id: 'aquaria-child',
        name: 'Child Admission',
        subtitle: 'Ages 3–12 · Valid all day',
        priceSgd: 16.4,
        originalPriceSgd: 19.5,
      },
      {
        id: 'aquaria-family',
        name: 'Family Bundle (2 Adults + 2 Children)',
        subtitle: 'Save 18% vs single tickets',
        priceSgd: 69.0,
        originalPriceSgd: 84.0,
      },
    ],
  },
  {
    id: 'sunway-lagoon',
    title: 'Sunway Lagoon Theme Park 1-Day Admission Ticket',
    category: 'theme-parks',
    categoryLabel: 'Theme parks',
    location: 'Bandar Sunway',
    image: '/src/assets/images/kl_sunway_lagoon_1795062345399.jpg',
    imageAlt: 'Sunway Lagoon multi-park water slides and surf wave pool surrounded by palm trees',
    rating: 4.7,
    reviewsCount: 34120,
    bookedLabel: '300K+ booked',
    priceSgd: 52.9,
    originalPriceSgd: 64.0,
    tag: '6 parks in 1',
    instantConfirmation: true,
    freeCancellation: true,
    skipTheLine: true,
    duration: 'full-day',
    durationLabel: 'Full day (10:00–18:00)',
    summary:
      'Spend a full day across six themed worlds including Water Park, Amusement Park, Wildlife Park, Extreme Park, Scream Park, and Nickelodeon Lost Lagoon just 25 minutes from central KL.',
    highlights: [
      'Experience Vuvuzela—one of the world’s largest vortex water rides—and the Surf Beach wave pool',
      'Explore over 90 rides and attractions across six interconnected adventure parks',
      'Cool off at Nickelodeon Lost Lagoon with family-friendly splash zones and jungle trails',
    ],
    included: [
      '1-day unlimited entry to all 6 Sunway Lagoon parks (excluding pay-per-ride activities)',
      'Skip-the-counter wristband exchange via dedicated Klook kiosk',
    ],
    redemptionInfo: 'Redeem e-voucher at Sunway Lagoon Main Entrance ticketing counters 1–5.',
    packages: [
      {
        id: 'sunway-adult',
        name: '1-Day Admission (Adult)',
        subtitle: 'Ages 13+ · All 6 parks access',
        priceSgd: 52.9,
        originalPriceSgd: 64.0,
      },
      {
        id: 'sunway-express',
        name: '1-Day Admission + Quack Xpress Fast Lane',
        subtitle: 'Priority lane on 20+ popular rides',
        priceSgd: 78.5,
        originalPriceSgd: 92.0,
      },
    ],
  },
  {
    id: 'batu-caves-tour',
    title: 'Batu Caves, Ramayana Cave & Cultural Half-Day Tour',
    category: 'tours',
    categoryLabel: 'Tours',
    location: 'Gombak',
    image: '/src/assets/images/kl_batu_caves_1795062345553.jpg',
    imageAlt: 'Rainbow stairs and golden Lord Murugan statue at Batu Caves Kuala Lumpur',
    rating: 4.8,
    reviewsCount: 9640,
    bookedLabel: '50K+ booked',
    priceSgd: 19.5,
    originalPriceSgd: 25.0,
    instantConfirmation: true,
    freeCancellation: true,
    skipTheLine: false,
    duration: 'half-day',
    durationLabel: '4 hours',
    summary:
      'Climb the vibrant 272 rainbow steps beneath the towering 42.7-meter golden statue of Lord Murugan with an English-speaking guide, paired with stops at Royal Selangor and batik craft ateliers.',
    highlights: [
      'Ascend the iconic 272 multicolored staircase into the 400-million-year-old limestone Cathedral Cave',
      'Learn Hindu temple traditions and local mythology from a licensed Malaysian guide',
      'Visit a traditional Malaysian batik workshop and Royal Selangor pewter gallery',
    ],
    included: [
      'Round-trip air-conditioned coach transfer from central Kuala Lumpur hotels',
      'English-speaking cultural guide',
      'Bottled drinking water',
    ],
    redemptionInfo: 'Hotel lobby pick-up between 08:45–09:15 (morning) or 13:45–14:15 (afternoon).',
    packages: [
      {
        id: 'batu-shared',
        name: 'Shared Half-Day Morning Tour',
        subtitle: 'Includes KL city center hotel pick-up',
        priceSgd: 19.5,
        originalPriceSgd: 25.0,
      },
      {
        id: 'batu-private',
        name: 'Private Car Charter (Up to 4 Pax)',
        subtitle: 'Flexible departure · Dedicated driver-guide',
        priceSgd: 68.0,
        originalPriceSgd: 82.0,
      },
    ],
  },
  {
    id: 'kl-tower-skydeck',
    title: 'KL Tower (Menara Kuala Lumpur) Sky Deck & Sky Box Ticket',
    category: 'attractions',
    categoryLabel: 'Attractions',
    location: 'Bukit Nanas',
    image: '/src/assets/images/kl_tower_skydeck_1795062345265.jpg',
    imageAlt: 'Panoramic golden hour skyline view of Kuala Lumpur from KL Tower glass Sky Deck',
    rating: 4.7,
    reviewsCount: 18450,
    bookedLabel: '100K+ booked',
    priceSgd: 14.9,
    originalPriceSgd: 18.5,
    instantConfirmation: true,
    freeCancellation: true,
    skipTheLine: true,
    duration: 'under-3h',
    durationLabel: '1 hr 30 mins',
    summary:
      'Take in unobstructed vistas of the Petronas Twin Towers from 300 meters up on the open-air Sky Deck and step into the cantilevered glass Sky Box jutting out over the city skyline.',
    highlights: [
      'Stand inside the transparent glass Sky Box suspended 300 meters above Bukit Nanas Forest Reserve',
      'Capture the best unobstructed photographs of the Petronas Twin Towers in the skyline',
      'Upgrade to Tower Walk 100 for a harnessed perimeter walk around the tower edge',
    ],
    included: [
      'Admission to Observation Deck (276m) or Sky Deck + Sky Box (300m)',
      'Instant digital voucher verification',
    ],
    redemptionInfo: 'Exchange mobile voucher at KL Tower Upper Ground Floor ticketing counter.',
    packages: [
      {
        id: 'kltower-obs',
        name: 'Indoor Observation Deck Only',
        subtitle: '276m enclosed panoramic deck',
        priceSgd: 14.9,
        originalPriceSgd: 18.5,
      },
      {
        id: 'kltower-skydeck',
        name: 'Open-Air Sky Deck + Sky Box + Observation Deck',
        subtitle: 'Includes 1 Sky Box photo session',
        priceSgd: 29.8,
        originalPriceSgd: 36.0,
      },
    ],
  },
  {
    id: 'genting-highlands-skyway',
    title: 'Genting Highlands Awana SkyWay Cable Car & Day Trip',
    category: 'day-trips',
    categoryLabel: 'Day trips',
    location: 'Genting Highlands',
    image: '/src/assets/images/kl_genting_skyway_1795062345700.jpg',
    imageAlt: 'Red gondola cable car gliding over misty green rainforest mountains to Genting Highlands',
    rating: 4.8,
    reviewsCount: 22110,
    bookedLabel: '150K+ booked',
    priceSgd: 12.6,
    originalPriceSgd: 15.0,
    tag: 'Cool mountain escape',
    instantConfirmation: true,
    freeCancellation: true,
    skipTheLine: true,
    duration: 'full-day',
    durationLabel: 'Flexible · 10 min ride',
    summary:
      'Glide 620 meters up over 130-million-year-old tropical rainforest aboard the Awana SkyWay gondola, with a complimentary stop at the cliffside Chin Swee Caves Temple en route to Resorts World Genting.',
    highlights: [
      'Soar above misty mountain ridges in a standard or glass-floor gondola',
      'Disembark free at Chin Swee Station to explore the 9-storey pagoda and giant Buddha statue',
      'Seamless access to SkyAvenue mall, Genting SkyWorlds Theme Park, and Premium Outlets',
    ],
    included: [
      'Two-way Awana SkyWay cable car ride (Standard or Glass Floor)',
      'Complimentary intermediate stop at Chin Swee Caves Temple',
    ],
    redemptionInfo: 'Scan Klook QR code directly at Awana Station Level 4 boarding gates.',
    packages: [
      {
        id: 'genting-roundtrip',
        name: 'Round-Trip Standard Gondola',
        subtitle: 'Direct QR scan · Flexible time slot',
        priceSgd: 12.6,
        originalPriceSgd: 15.0,
      },
      {
        id: 'genting-glass',
        name: 'Round-Trip Glass Floor Gondola + Coach from KL Sentral',
        subtitle: 'Includes return express coach from KL Sentral',
        priceSgd: 28.4,
        originalPriceSgd: 34.0,
      },
    ],
  },
  {
    id: 'malacca-unesco-day-tour',
    title: 'Historical Malacca UNESCO Heritage Full-Day Tour from KL',
    category: 'day-trips',
    categoryLabel: 'Day trips',
    location: 'Melaka',
    image: '/src/assets/images/kl_malacca_heritage_1795062344744.jpg',
    imageAlt: 'Historic terracotta red Stadthuys buildings along Melaka River promenade with riverboats',
    rating: 4.7,
    reviewsCount: 8340,
    bookedLabel: '40K+ booked',
    priceSgd: 36.0,
    originalPriceSgd: 45.0,
    instantConfirmation: true,
    freeCancellation: true,
    skipTheLine: false,
    duration: 'full-day',
    durationLabel: '9 hours',
    summary:
      'Journey south from Kuala Lumpur to the UNESCO-listed port city of Malacca. Walk Dutch Square’s iconic terracotta Stadthuys, climb St. Paul’s Hill, browse Jonker Walk, and savor authentic Nyonya Peranakan cuisine.',
    highlights: [
      'Explore Dutch Square, Christ Church, and the 16th-century A Famosa Portuguese fortress',
      'Enjoy a traditional Peranakan lunch included in the full-day itinerary',
      'Stroll along the scenic Melaka River murals and antique shops on Jonker Street',
    ],
    included: [
      'Round-trip air-conditioned coach from Kuala Lumpur city hotels',
      'Traditional Nyonya lunch at a heritage restaurant',
      'Licensed English-speaking tour guide',
    ],
    redemptionInfo: 'Pick-up at 08:30 from Kuala Lumpur Golden Triangle / Bukit Bintang hotels.',
    packages: [
      {
        id: 'malacca-group',
        name: 'Join-In Full-Day Heritage Tour (with Lunch)',
        subtitle: 'Departs daily at 08:30 · Hotel pick-up',
        priceSgd: 36.0,
        originalPriceSgd: 45.0,
      },
      {
        id: 'malacca-cruise',
        name: 'Full-Day Tour + Melaka River Cruise Ticket',
        subtitle: 'Includes 45-min scenic riverboat ride',
        priceSgd: 46.5,
        originalPriceSgd: 56.0,
      },
    ],
  },
  {
    id: 'kl-night-skyline-tour',
    title: 'KL Hop-On Hop-Off City Sightseeing & Twilight Lights Tour',
    category: 'tours',
    categoryLabel: 'Tours',
    location: 'KL Sentral & Bukit Bintang',
    image: '/src/assets/images/hero_kl_skyline_1795062345238.jpg',
    imageAlt: 'Illuminated Kuala Lumpur city skyline at twilight featuring Petronas Twin Towers and KL Tower',
    rating: 4.6,
    reviewsCount: 7190,
    bookedLabel: '30K+ booked',
    priceSgd: 18.0,
    originalPriceSgd: 22.5,
    instantConfirmation: true,
    freeCancellation: true,
    skipTheLine: false,
    duration: 'under-3h',
    durationLabel: '2 hrs 30 mins / 24h pass',
    summary:
      'Cruise past 23 iconic Kuala Lumpur landmarks aboard an open-top double-decker bus, or hop on the evening KL City of Lights route to see the Petronas Towers, Saloma Link, and Istana Negara illuminated after dark.',
    highlights: [
      'Unlimited rides across 23 curated stops including KLCC, Chinatown, and Little India',
      'Open-air upper deck seating ideal for golden hour and night skyline photography',
      'Live English audio commentary highlighting Kuala Lumpur architecture and history',
    ],
    included: [
      '24-hour or 48-hour Hop-On Hop-Off pass OR 2-hour KL City of Lights night tour',
      'Onboard audio commentary guide',
    ],
    redemptionInfo: 'Board at Stop 1 (Sungei Wang Plaza, Bukit Bintang) or any marked HOHO bus stop.',
    packages: [
      {
        id: 'hoho-night',
        name: 'KL City of Lights Night Tour (20:00)',
        subtitle: '2-hour non-stop illuminated city circuit',
        priceSgd: 18.0,
        originalPriceSgd: 22.5,
      },
      {
        id: 'hoho-24h',
        name: '24-Hour Hop-On Hop-Off Day Pass',
        subtitle: 'Unlimited stops along City & Garden routes',
        priceSgd: 20.5,
        originalPriceSgd: 25.0,
      },
    ],
  },
  {
    id: 'klia-ekspres-pass',
    title: 'KLIA Ekspres Airport Train Ticket & KL City Attraction Pass',
    category: 'transport',
    categoryLabel: 'Transport',
    location: 'KL Sentral ↔ KLIA / KLIA2',
    image: '/src/assets/images/kl_petronas_towers_1795062344875.jpg',
    imageAlt: 'Modern Kuala Lumpur city center connected by KLIA Ekspres high-speed transit',
    rating: 4.9,
    reviewsCount: 41850,
    bookedLabel: '500K+ booked',
    priceSgd: 14.2,
    originalPriceSgd: 16.5,
    tag: '28 mins non-stop',
    instantConfirmation: true,
    freeCancellation: true,
    skipTheLine: true,
    duration: 'under-3h',
    durationLabel: '28 mins ride',
    summary:
      'Bypass Kuala Lumpur traffic with Malaysia’s fastest airport rail link—connecting KLIA Terminal 1 & 2 straight to KL Sentral in just 28 minutes with free onboard 5G Wi-Fi.',
    highlights: [
      'Non-stop 28-minute high-speed journey from KLIA T1 to KL Sentral',
      'Walk straight to the automated boarding gates using your Klook QR code',
      'Trains depart every 15–20 minutes throughout the day with generous luggage racks',
    ],
    included: [
      'Single or Round-Trip KLIA Ekspres e-ticket',
      'Complimentary onboard Wi-Fi and luggage storage',
    ],
    redemptionInfo: 'Scan QR code directly at the purple KLIA Ekspres fare gates—no counter exchange needed.',
    packages: [
      {
        id: 'klia-oneway',
        name: 'One-Way Express Ticket (KLIA T1/T2 ↔ KL Sentral)',
        subtitle: 'Valid for 30 days from purchase · Direct QR gate entry',
        priceSgd: 14.2,
        originalPriceSgd: 16.5,
      },
      {
        id: 'klia-roundtrip',
        name: 'Round-Trip Express Ticket (KLIA T1/T2 ↔ KL Sentral)',
        subtitle: 'Save 12% on return airport transfer',
        priceSgd: 26.8,
        originalPriceSgd: 33.0,
      },
    ],
  },
];

export const KL_FAQS: FaqItem[] = [
  {
    question: 'How do Klook mobile e-vouchers work in Kuala Lumpur?',
    answer:
      'Most Kuala Lumpur attractions—including Aquaria KLCC, KLIA Ekspres, and Awana SkyWay—support direct QR code entry at the turnstiles. Simply open your confirmed voucher on your phone and scan at the gate without printing paper tickets.',
  },
  {
    question: 'When is the best time to book Petronas Twin Towers tickets?',
    answer:
      'Petronas Twin Towers slots operate with strict hourly capacities and frequently sell out 3–5 days in advance, especially for late afternoon and sunset times (17:00–19:00). Note that the towers are closed on Mondays except on selected public holidays.',
  },
  {
    question: 'What is the dress code for Batu Caves?',
    answer:
      'Batu Caves is an active Hindu shrine. Visitors are asked to cover knees and shoulders when ascending the rainbow stairs into the temple cavern; lightweight sarongs are available to rent at the base entrance if needed.',
  },
  {
    question: 'Can I switch currency between Singapore Dollars (S$) and Malaysian Ringgit (RM)?',
    answer:
      'Yes. Use the currency selector in the Kuala Lumpur destination toolbar above to toggle live pricing between SGD (S$), MYR (RM), and USD (US$).',
  },
];

// Absolute origin used for links in outgoing email. Vercel injects
// VERCEL_PROJECT_PRODUCTION_URL automatically; SITE_URL overrides it (e.g.
// once a custom domain is attached).
export function siteUrl(): string {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

// The one code printed on every invitation card. Lives here (not in
// guests.ts) so Edge middleware can read it without pulling in the
// server-only guest list.
export const INVITATION_CODE = "JM1126";

export const wedding = {
  brideFirst: "Marjorie",
  brideLast: "Dela Cruz",
  groomFirst: "Joseph",
  groomLast: "Santos",
  hashtag: "#JM1126",
  brand: "JM Airways",
  tagline: "Flight to Forever",
  flightNumber: "JM1126",
  seat: "26A",
  gate: "Forever Hall",
  destinationVenue: "Mariel's Garden",
  shortDate: "November 26, 2026",
  shortDateCompact: "NOV 26, 2026",
  // ISO with PH timezone offset (+08:00)
  date: "2026-11-26T15:00:00+08:00",
  ceremonyTime: "3:00 PM",
  boardingTime: "02:30 PM",
  rsvpCloseDate: "November 1, 2026",
  dressCode: "Formal Attire",

  // Where the guests fly from / to on every boarding pass in the site.
  origin: "Today",
  destination: "Forever",

  // Wedding colour motif, shown as swatches beside the dress code.
  motif: [
    { name: "Silver Gray", hex: "#b9bec6" },
    { name: "Dusty Blue", hex: "#8398b7" },
    { name: "Navy Blue", hex: "#1c2940" },
    { name: "Warm Gray", hex: "#b3a89b" },
  ],

  // Attire guidance by role — shown under the motif swatches.
  attire: {
    image: "/images/attire-guide.jpg",
    palette: "Dusty Blue · Navy Blue · Silvery or Gray",
    roles: [
      { role: "Principal Sponsors", guidance: "Gray or silver gray", hex: "#b9bec6" },
      { role: "Secondary Sponsors", guidance: "Dusty blue", hex: "#8398b7" },
      { role: "Guests", guidance: "Any shades of blue or warm gray", hex: "#6f86a8" },
    ],
  },

  story: [
    {
      year: "2024",
      code: "PEN - MNL",
      title: "Penang - Manila",
      body: "We first met beneath a mall lamppost—its glow timid beside the brilliance of her smile. That smile made the flowers on her skirt bloom, and with each chocolate kiss, my heart melted a little more. From that night's sweetness to today's promise, our love has been a confection of laughter, light, and kisses that taste like forever.",
      city: "Penang MY to Manila PHL",
    },
    {
      year: "2025",
      code: "MNL - HAN",
      title: "Manila - Hanoi",
      body: "Four days apart, and I was left holding sweet kisses that melted like chocolate—bittersweet, playful, and proof that even distance can't dim the smile that first lit my world.",
      city: "Manila PHL to Hanoi VNM",
    },
    {
      year: "2026",
      code: "HAN - DMK",
      title: "Hanoi - Bangkok",
      body: "On the shore, with waves whispering to the sand, the breeze carried my half-nervous words: “Would you do me the honor of accompanying me?” More than a question, it was a promise wrapped in laughter and the daring spark of a journey together.",
      city: "Hanoi VNM to Bangkok THA",
    },
    {
      year: "2026",
      code: "∞",
      title: "Bangkok - Tagaytay · The Start of our Forever",
      body: "On November 26, the day of our promise, our vows will rise like music to the hearts of our loved ones. And as we embark on this journey—our hearts forever intertwined—it shall be not just a beginning, but the eternal embrace of our “forever.”",
      city: "Our Landing Place",
    },
  ],

  // Route shown above the two venue cards in "Where we land".
  route: { from: "Laguna", to: "Cavite" },

  ceremony: {
    title: "Ceremony",
    time: "3:00 PM",
    venue: "Mariel's Garden",
    address: "1881 Amuyong-Kaytitinga Road, Barangay Kaytitinga I, Alfonso, Cavite",
    dressCode: "Formal Attire",
    mapsUrl: "https://maps.google.com/?q=Mariel's+Garden+Alfonso+Cavite",
    // TODO: replace with a real photo of Mariel's Garden (drop it in public/images/).
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80",
  },
  reception: {
    title: "Reception",
    time: "5:30 PM",
    venue: "Mariel's Pavilion",
    address: "1881 Amuyong-Kaytitinga Road, Barangay Kaytitinga I, Alfonso, Cavite",
    dressCode: "Formal cocktail attire",
    mapsUrl: "https://maps.google.com/?q=Mariel's+Garden+Alfonso+Cavite",
    // TODO: replace with a real photo of Mariel's Pavilion (drop it in public/images/).
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=80",
  },

  schedule: [
    { time: "2:30 PM", title: "Guest Arrival", note: "Welcome drinks at the garden foyer" },
    { time: "3:00 PM", title: "Ceremony Begins", note: "Please be seated by 2:50 PM" },
    { time: "4:30 PM", title: "Photo Session", note: "Family & wedding party photos" },
    { time: "5:30 PM", title: "Cocktail Hour", note: "Garden terrace" },
    { time: "7:00 PM", title: "Reception & Dinner", note: "Speeches, dinner, first dance" },
    { time: "11:30 PM", title: "Send-off", note: "Sparkler exit — drive safe!" },
  ],

  // TODO: replace every "TBA" below with the real names before launch.
  party: {
    parents: {
      groom: {
        label: "Parents of the Groom",
        names: ["TBA — Father of the Groom", "TBA — Mother of the Groom"],
      },
      bride: {
        label: "Parents of the Bride",
        names: ["TBA — Father of the Bride", "TBA — Mother of the Bride"],
      },
    },
    principalSponsors: [
      { name: "TBA", partner: "TBA" },
      { name: "TBA", partner: "TBA" },
      { name: "TBA", partner: "TBA" },
    ],
    secondarySponsors: [
      { task: "Candle", names: ["TBA", "TBA"] },
      { task: "Veil", names: ["TBA", "TBA"] },
      { task: "Cord", names: ["TBA", "TBA"] },
      { task: "Ring Bearer", names: ["TBA"] },
      { task: "Coin Bearer", names: ["TBA"] },
      { task: "Bible Bearer", names: ["TBA"] },
      { task: "Flower Girls", names: ["TBA", "TBA"] },
    ],
  },

  gallery: [
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552", alt: "Engagement portrait" },
    { src: "https://images.unsplash.com/photo-1525772764200-be829a350797", alt: "Holding hands" },
    { src: "https://images.unsplash.com/photo-1606800052052-a08af7148866", alt: "Beach sunset" },
    { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", alt: "Garden walk" },
    { src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff", alt: "Studio shot" },
    { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed", alt: "Candid laughter" },
  ],

  // Background music. Empty = the player is off entirely. To enable it,
  // drop an mp3 in public/audio/ and set this to e.g. "/audio/song.mp3".
  music: "",

  prenup: {
    coverImage: "/images/prenup-cover.jpg",
    videoUrl: "/video/save-the-date.mp4",
    duration: "1:02",
    tagline: "Our Journey to Forever",
  },

  travel: [
    {
      name: "Mariel's Garden — On-site",
      distance: "On-site (check availability with venue)",
      note: "Mention 'Santos-Dela Cruz Wedding' when inquiring about on-site accommodation.",
      link: "#",
    },
  ],

  registry: [
    {
      title: "GCash",
      handle: "Marjorie D. — 09XX-XXX-1126",
      note: "Quick & easy — just scan our QR at the reception entrance.",
      // TODO: swap for the real GCash QR image (drop it in public/images/).
      qr: "",
    },
    {
      title: "Bank Transfer",
      handle: "BPI 1234-5678-90 — Joseph Santos",
      note: "For larger gifts or international guests.",
      qr: "",
    },
    {
      title: "Honeymoon Fund",
      handle: "honeymoon.marjorieandjoseph.com",
      note: "Help us explore Japan in spring 2027. Every peso means a memory.",
      qr: "",
    },
  ],

  faq: [
    {
      q: "What's the dress code?",
      a: "Formal attire in our motif — dusty blue, navy blue, silvery or gray. Principal sponsors in gray or silver gray, secondary sponsors in dusty blue, and guests in any shade of blue or warm gray. Please avoid pure white or ivory, those are reserved for the bride!",
    },
    {
      q: "Can I bring a plus-one?",
      a: "Your invitation will indicate the number of seats reserved for you. Out of love (and venue capacity), we kindly ask you to honor that count.",
    },
    {
      q: "Are kids welcome?",
      a: "We adore your little ones but our reception is an adults-only affair. Children of the immediate family are of course welcome.",
    },
    {
      q: "Is there parking?",
      a: "Yes — Mariel's Garden has ample parking on-site. Valet is available from 2:00 PM onward.",
    },
    {
      q: "What if I have a dietary restriction?",
      a: "Please mention it in the RSVP form below. Our caterer can accommodate vegetarian, vegan, and most allergies with advance notice.",
    },
    {
      q: "Will the ceremony be livestreamed?",
      a: "Yes! We'll email the link to all RSVP'd guests on the morning of the wedding for friends and family who can't be there in person.",
    },
  ],

  social: {
    instagram: "@marjorie.j.santos",
    facebook: "#",
    tiktok: "#",
    youtube: "#",
    spotifyPlaylist: "#",
  },

  contact: {
    email: "joseph.loves.jorie@gmail.com",
  },

  // Everyone who gets notified when an RSVP lands. Override with the
  // RSVP_NOTIFY_EMAIL env var (comma-separated) without editing code.
  // Add "joseph.loves.jorie@gmail.com" back here when the couple should
  // start receiving them too.
  notifyEmails: [
    "turayalemmuel@gmail.com",
  ],

  quote: {
    text: "With you beside me, every path becomes home.",
    author: "For two travelers in love",
    image:
      "https://images.unsplash.com/photo-1525772764200-be829a350797?w=2000&q=85",
  },

  stats: [
    { value: "2,847", label: "Days together" },
    { value: "47", label: "Cities visited" },
    { value: "1", label: "Question asked" },
    { value: "∞", label: "Yet to come" },
  ],
};

export type WeddingConfig = typeof wedding;

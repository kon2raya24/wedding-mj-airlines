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
  brideLast: "Teñido",
  groomFirst: "Joseph",
  groomLast: "Castañeda",
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

  // Attire guidance by group. `image` is the illustrated line-up for the
  // group (public/images/attire); `swatches` are the chips shown above it.
  attire: {
    palette: "Dusty Blue · Navy Blue · Silvery or Gray",
    groups: [
      {
        name: "Principal Sponsors",
        cabin: "First Class",
        ladies: "Silver gray long formal dress",
        gentlemen: "Black suit and pants",
        swatches: ["#b9bec6", "#1a1a1a"],
        image: "/images/attire/sponsors.webp",
      },
      {
        name: "Bridesmaids & Groomsmen",
        cabin: "Business",
        ladies: "Dusty blue long formal dress",
        gentlemen: "Gray suit and pants",
        swatches: ["#8398b7", "#7d858f"],
        image: "/images/attire/entourage.webp",
      },
    ],
    guests: {
      cabin: "Economy Plus",
      note:
        "We would love to see you in your best formal or semi-formal attire that suits our color motif below. We kindly ask that you avoid casual wear.",
      image: "/images/attire/guests.webp",
    },
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
    image: "/images/venue-ceremony.jpg",
  },
  reception: {
    title: "Reception",
    time: "5:30 PM",
    venue: "Mariel's Pavilion",
    address: "1881 Amuyong-Kaytitinga Road, Barangay Kaytitinga I, Alfonso, Cavite",
    dressCode: "Formal cocktail attire",
    mapsUrl: "https://maps.google.com/?q=Mariel's+Garden+Alfonso+Cavite",
    image: "/images/venue-reception.jpg",
  },

  schedule: [
    { time: "2:30 PM", title: "Guest Arrival", note: "Welcome drinks at the garden foyer" },
    { time: "3:00 PM", title: "Ceremony Begins", note: "Please be seated by 2:50 PM" },
    { time: "4:30 PM", title: "Photo Session", note: "Family & wedding party photos" },
    { time: "5:30 PM", title: "Cocktail Hour", note: "Garden terrace" },
    { time: "7:00 PM", title: "Reception & Dinner", note: "Speeches, dinner, first dance" },
    { time: "11:30 PM", title: "Send-off", note: "Sparkler exit — drive safe!" },
  ],

  // From the ENTOURAGE LIST tab of the couple's guest-list spreadsheet.
  party: {
    officiant: "Bishop Rence De Guzman",
    parents: {
      groom: {
        label: "Parents of the Groom",
        names: ["Mr. Constantino Castañeda", "Mrs. Teresita Castañeda"],
      },
      bride: {
        label: "Parents of the Bride",
        names: ["Mr. Maximo Teñido", "Mrs. Annalyn Teñido"],
      },
    },
    attendants: [
      { role: "Best Men", names: ["Johncel Castañeda", "Ejay Antonio"] },
      { role: "Maids of Honor", names: ["Monique Teñido", "April Rose Gonzales"] },
    ],
    principalSponsors: [
      { name: "Bishop Rence De Guzman", partner: "Pastora Charmie De Guzman" },
      { name: "Mr. Rafael Fernando", partner: "Mrs. Marites Fernando" },
      { name: "Pastor Ronnie Loja", partner: "Mrs. Nilda Loja" },
      { name: "Mr. Norbert Palma", partner: "Mrs. Nida Palma" },
      { name: "Mr. Almario Susano", partner: "Mrs. Mhalen Susano" },
    ],
    secondarySponsors: [
      { task: "Candle", names: ["Karl De Guzman", "Mary Lhen Susano"] },
      { task: "Veil", names: ["Justine Castañeda", "Anna Marie Torres-Ligo", "Mark Gayo", "Princess"] },
      { task: "Cord", names: ["Joshua Rodelas", "Kayla Zamudio", "Joshua Moreno", "Regine Ibañez"] },
      { task: "Bible Bearer", names: ["Alwyn Alfonso"] },
      { task: "Coin Bearer", names: ["Jash Andrei Tolentino"] },
      { task: "Ring Bearer", names: ["Zane Emmanuel Capunitan"] },
    ],
  },

  gallery: [
    { src: "/images/gallery-1.jpg", alt: "By the lake", stamp: "THE LAKE" },
    { src: "/images/gallery-2.jpg", alt: "Hands in the air", stamp: "TAKE OFF" },
    { src: "/images/gallery-3.jpg", alt: "A quiet moment", stamp: "THE VEIL" },
    { src: "/images/gallery-4.jpg", alt: "On the bamboo raft", stamp: "THE RAFT" },
    { src: "/images/gallery-5.jpg", alt: "Songs at golden hour", stamp: "GOLDEN HOUR" },
    { src: "/images/gallery-6.jpg", alt: "Where it started", stamp: "WHERE IT BEGAN" },
  ],

  // Background music. Empty = the player is off entirely. To enable it,
  // drop an mp3 in public/audio/ and set this to e.g. "/audio/song.mp3".
  music: "",

  prenup: {
    coverImage: "/images/prenup-cover.jpg",
    videoUrl: "/video/save-the-date.mp4",
    // The hero plays videoUrl itself (the full 1080p master) on desktop; this
    // muted 30s 1440px excerpt (~3 MB) is used on phones and data-saver
    // connections. `poster` is the frame shown until either loads.
    loopUrl: "/video/hero-loop.mp4",
    poster: "/images/hero-poster.jpg",
    duration: "1:02",
    tagline: "Our Journey to Forever",
  },

  travel: [
    {
      name: "Mariel's Garden — On-site",
      distance: "On-site (check availability with venue)",
      note: "Mention 'Castañeda-Teñido Wedding' when inquiring about on-site accommodation.",
      link: "#",
    },
  ],

  // Each card flips to reveal its QR. `qr` is an image in public/images;
  // leave it empty and the site generates a QR from `handle` instead.
  registry: [
    {
      title: "GCash",
      handle: "MA*****E T. — 0956 654 ••••",
      note: "Quickest option — scan and send.",
      qr: "/images/qr-gcash.jpg",
    },
    {
      title: "GoTyme",
      handle: "Marjorie Tenido — ••••• 4509",
      note: "Bank transfer via InstaPay.",
      qr: "/images/qr-gotyme.jpg",
    },
    {
      title: "MariBank",
      handle: "Joseph Castaneda — ••••3018",
      note: "Bank transfer via InstaPay.",
      qr: "/images/qr-maribank.jpg",
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
      a: "We absolutely adore your little ones! However, to help us create the celebration we have envisioned, we kindly ask that only children whose names are specifically included on the invitation join us. Thank you so much for your understanding and for helping us keep our celebration adults-only.",
    },
    {
      q: "Is there parking?",
      a: "Yes — Mariel's Garden has ample parking on-site.",
    },
    {
      q: "Can I take photos during the ceremony?",
      a: "Absolutely! We'd love for you to capture little moments and memories throughout our special day. Since our ceremony is semi-unplugged, feel free to take photos and short videos from your seat and share in the joy of the moment. We simply ask that you remain mindful of our professional photographers and videographers — please avoid stepping into the aisle, blocking their view, or using flash during the ceremony. This way, everyone can capture and enjoy our special journey together. 🤍",
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
    image: "/images/quote.jpg",
  },

  stats: [
    { value: "2,847", label: "Days together" },
    { value: "47", label: "Cities visited" },
    { value: "1", label: "Question asked" },
    { value: "∞", label: "Yet to come" },
  ],
};

export type WeddingConfig = typeof wedding;

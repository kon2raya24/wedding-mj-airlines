import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Inter } from "next/font/google";
import { wedding, siteUrl } from "@/lib/config";
import "./globals.css";

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const serif = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const title = `${wedding.groomFirst} & ${wedding.brideFirst} — ${wedding.shortDate}`;
const description = `Join us as we say "I do." ${wedding.shortDate} at ${wedding.destinationVenue}.`;

// Share card: app/opengraph-image.jpg (1200×630 JPEG, kept under 300 KB so
// WhatsApp, Viber and iMessage accept it) is picked up automatically;
// metadataBase makes its URL absolute. The card was rendered from the
// former app/opengraph-image.tsx route (see git history) — re-render there
// if the names or date change.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: wedding.brand,
    type: "website",
    locale: "en_PH",
    // No og:url on purpose: Facebook folds every URL that declares the same
    // canonical into one cached object, so a stale scrape of the root would
    // also swallow fresh variants. Without it each shared URL is scraped on
    // its own.
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${script.variable} ${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

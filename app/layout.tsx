import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Inter } from "next/font/google";
import { wedding } from "@/lib/config";
import Nav from "@/components/Nav";
import Petals from "@/components/Petals";
import MusicToggle from "@/components/MusicToggle";
import CursorPlane from "@/components/CursorPlane";
import LoginGate from "@/components/LoginGate";
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

export const metadata: Metadata = {
  title: `${wedding.brideFirst} & ${wedding.groomFirst} — ${wedding.shortDate}`,
  description: `Join us as we say "I do." ${wedding.shortDate} in Manila.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${script.variable} ${serif.variable} ${sans.variable}`}>
      <body>
        <LoginGate>
          <Nav />
          <Petals />
          <CursorPlane />
          {children}
          <MusicToggle />
        </LoginGate>
      </body>
    </html>
  );
}

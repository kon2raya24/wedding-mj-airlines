import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Inter } from "next/font/google";
import { cookies } from "next/headers";
import { wedding } from "@/lib/config";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";
import { AuthProvider } from "@/components/AuthProvider";
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
  title: `${wedding.groomFirst} & ${wedding.brideFirst} — ${wedding.shortDate}`,
  description: `Join us as we say "I do." ${wedding.shortDate} at ${wedding.destinationVenue}.`,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  return (
    <html lang="en" className={`${script.variable} ${serif.variable} ${sans.variable}`}>
      <body>
        <AuthProvider initialSession={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}

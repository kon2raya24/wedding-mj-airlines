import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import MusicToggle from "@/components/MusicToggle";
import BackToTop from "@/components/BackToTop";
import AltitudeMeter from "@/components/AltitudeMeter";
import Glow from "@/components/Glow";
import SmoothScroll from "@/components/SmoothScroll";
import BoardingCurtain, { BOARDED_COOKIE } from "@/components/BoardingCurtain";
import CursorPlane from "@/components/CursorPlane";
import Dock from "@/components/Dock";
import Spotlight from "@/components/Spotlight";
import HeroPointer from "@/components/HeroPointer";
import { AuthProvider } from "@/components/AuthProvider";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/login");
  const firstVisit = !cookieStore.get(BOARDED_COOKIE);

  return (
    <AuthProvider initialSession={session}>
      <Glow />
      <BoardingCurtain active={firstVisit} />
      <SmoothScroll />
      <Nav />
      <CursorPlane />
      {children}
      <Dock />
      <Spotlight />
      <HeroPointer />
      {/* Seat-back style flight HUD: altitude climbs with scroll. */}
      <div
        className="glass fixed bottom-6 left-6 z-40 hidden md:block rounded-full px-4 py-2"
        aria-hidden
      >
        <AltitudeMeter light />
      </div>
      <BackToTop />
      <MusicToggle />
    </AuthProvider>
  );
}

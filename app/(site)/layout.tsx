import Nav from "@/components/Nav";
import Petals from "@/components/Petals";
import MusicToggle from "@/components/MusicToggle";
import CursorPlane from "@/components/CursorPlane";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <Petals />
      <CursorPlane />
      {children}
      <MusicToggle />
    </>
  );
}

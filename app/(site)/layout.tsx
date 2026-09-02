import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Petals from "@/components/Petals";
import MusicToggle from "@/components/MusicToggle";
import CursorPlane from "@/components/CursorPlane";
import { AuthProvider } from "@/components/AuthProvider";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await decodeSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) redirect("/login");

  return (
    <AuthProvider initialSession={session}>
      <Nav />
      <Petals />
      <CursorPlane />
      {children}
      <MusicToggle />
    </AuthProvider>
  );
}

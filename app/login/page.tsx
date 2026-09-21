import { cookies } from "next/headers";
import { wedding } from "@/lib/config";
import { findGuest } from "@/lib/guests";
import { SESSION_COOKIE, encodeSession } from "@/lib/session";
import LoginForm from "@/components/LoginForm";
import Porthole from "@/components/Porthole";

export type CheckInResult =
  | { error: string }
  | { ok: true; firstName: string; to: string };

async function checkIn(formData: FormData): Promise<CheckInResult> {
  "use server";
  const firstName = String(formData.get("firstName") ?? "");
  const lastName = String(formData.get("lastName") ?? "");
  const code = String(formData.get("code") ?? "");
  const next = String(formData.get("next") ?? "/");

  const guest = await findGuest(firstName, lastName, code);
  if (!guest) {
    return { error: "We couldn't find that reservation. Check the spelling of your name and the code on your invitation." };
  }

  const token = await encodeSession(guest);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // 30 days. Wedding is months away; this is fine for our threat model.
    maxAge: 60 * 60 * 24 * 30,
  });

  // Checked in — but hand the destination back rather than redirecting from
  // here, so the guest gets the takeoff before the site loads. `next` is still
  // sanitised on this side of the wire; the client only ever gets a path we
  // already vetted.
  return { ok: true, firstName: guest.firstName, to: safeNext(next) };
}

// Only accept absolute paths on our own origin. Reject schemes, hosts,
// and protocol-relative URLs like "//evil.com/..." which `startsWith("/")`
// would otherwise let through.
function safeNext(next: string): string {
  if (!next || !next.startsWith("/")) return "/";
  if (next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; open?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? "/";

  // The window greets every guest who is not checked in yet — this page is
  // only ever reached while they are signed out, so it is not something they
  // sit through repeatedly. Decided on the server so the very first paint is
  // already the cover, with no flash of the form behind it. `?open=1` is the
  // no-JS path: the same page with the cover suppressed, and it is where the
  // cover's own link points.
  const sealed = !sp.open;
  const openHref =
    next === "/" ? "/login?open=1" : `/login?open=1&next=${encodeURIComponent(next)}`;

  return (
    <>
      <Porthole active={sealed} openHref={openHref} />
      <LoginForm
        next={next}
        brideFirst={wedding.brideFirst}
        groomFirst={wedding.groomFirst}
        flightNumber={wedding.flightNumber}
        shortDateCompact={wedding.shortDateCompact}
        gate={wedding.gate}
        origin={wedding.origin}
        destination={wedding.destination}
        venue={wedding.destinationVenue}
        ceremonyTime={wedding.ceremonyTime}
        videoUrl={wedding.prenup.videoUrl}
        lightVideoUrl={wedding.prenup.loopUrl}
        poster={wedding.prenup.poster}
        action={checkIn}
      />
    </>
  );
}

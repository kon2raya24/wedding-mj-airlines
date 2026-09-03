import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { wedding } from "@/lib/config";
import { findGuest } from "@/lib/guests";
import { SESSION_COOKIE, encodeSession } from "@/lib/session";
import LoginForm from "@/components/LoginForm";

async function checkIn(formData: FormData): Promise<{ error?: string }> {
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

  redirect(safeNext(next));
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
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  return (
    <LoginForm
      next={sp.next ?? "/"}
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
  );
}

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  checkAdminPassword,
  isAdminConfigured,
  isAdminCookieValid,
  mintAdminCookieValue,
} from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { readRsvps } from "@/lib/rsvp-store";
import { guests } from "@/lib/guests";
import { guestKey } from "@/lib/rsvp-types";
import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

async function adminLogin(formData: FormData): Promise<{ error?: string }> {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (!isAdminConfigured()) {
    return { error: "Admin is not configured. Set ADMIN_PASSWORD in your environment." };
  }
  const rl = rateLimit(`admin-login:${await clientIp()}`);
  if (!rl.allowed) {
    return { error: `Too many attempts — try again in ${rl.retryAfterSec}s.` };
  }
  if (!(await checkAdminPassword(password))) {
    return { error: "Incorrect password." };
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, await mintAdminCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  redirect("/admin");
}

async function adminLogout(): Promise<void> {
  "use server";
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  redirect("/admin");
}

async function refreshAdmin(): Promise<void> {
  "use server";
  revalidatePath("/admin");
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const ok = await isAdminCookieValid(cookieStore.get(ADMIN_COOKIE)?.value);

  if (!ok) {
    return <AdminLogin action={adminLogin} configured={isAdminConfigured()} />;
  }

  const rsvps = await readRsvps();
  // The invitation code is shared, so join on the guest's name instead.
  const byName = new Map(
    rsvps.map((r) => [guestKey(r.firstName, r.lastName), r]),
  );
  const rows = guests.map((g) => {
    const r = byName.get(guestKey(g.firstName, g.lastName)) ?? null;
    return { guest: g, rsvp: r };
  });

  return (
    <AdminDashboard
      rows={rows}
      totalGuests={guests.length}
      totalRsvps={rsvps.length}
      onLogout={adminLogout}
      onRefresh={refreshAdmin}
    />
  );
}

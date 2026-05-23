import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  checkAdminPassword,
  expectedAdminCookieValue,
  isAdminConfigured,
  isAdminCookieValid,
} from "@/lib/admin-auth";
import { readRsvps } from "@/lib/rsvp-store";
import { guests } from "@/lib/guests";
import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";

async function adminLogin(formData: FormData): Promise<{ error?: string }> {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (!isAdminConfigured()) {
    return { error: "Admin is not configured. Set ADMIN_PASSWORD in your environment." };
  }
  if (!checkAdminPassword(password)) {
    return { error: "Incorrect password." };
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, await expectedAdminCookieValue(), {
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
  // Index by code for joining with the guest list
  const byCode = new Map(rsvps.map((r) => [r.code.toUpperCase(), r]));
  const rows = guests.map((g) => {
    const r = byCode.get(g.code.toUpperCase()) ?? null;
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

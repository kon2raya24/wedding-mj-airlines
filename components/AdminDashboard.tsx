"use client";

import { useMemo, useState, useTransition } from "react";
import type { Guest } from "@/lib/guests";
import type { RsvpEntry } from "@/lib/rsvp-store";

type Row = { guest: Guest; rsvp: RsvpEntry | null };

export default function AdminDashboard({
  rows,
  totalGuests,
  totalRsvps,
  onLogout,
  onRefresh,
}: {
  rows: Row[];
  totalGuests: number;
  totalRsvps: number;
  onLogout: () => Promise<void>;
  onRefresh: () => Promise<void>;
}) {
  const [filter, setFilter] = useState<"all" | "yes" | "no" | "pending">("all");
  const [pending, startTransition] = useTransition();

  const totals = useMemo(() => {
    const yes = rows.filter((r) => r.rsvp?.attending === "yes");
    const no = rows.filter((r) => r.rsvp?.attending === "no");
    const seatsConfirmed = yes.reduce((s, r) => s + (r.rsvp?.seatsAttending ?? 0), 0);
    const seatsReserved = rows.reduce((s, r) => s + r.guest.seatsReserved, 0);
    return {
      yes: yes.length,
      no: no.length,
      pending: rows.filter((r) => !r.rsvp).length,
      seatsConfirmed,
      seatsReserved,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "yes") return rows.filter((r) => r.rsvp?.attending === "yes");
    if (filter === "no") return rows.filter((r) => r.rsvp?.attending === "no");
    return rows.filter((r) => !r.rsvp);
  }, [rows, filter]);

  function downloadCsv() {
    const header = [
      "code",
      "firstName",
      "lastName",
      "seatsReserved",
      "attending",
      "seatsAttending",
      "companions",
      "email",
      "note",
      "submittedAt",
    ];
    const lines = rows.map((r) => {
      const v = r.rsvp;
      return [
        r.guest.code,
        r.guest.firstName,
        r.guest.lastName,
        String(r.guest.seatsReserved),
        v?.attending ?? "",
        v?.seatsAttending != null ? String(v.seatsAttending) : "",
        v?.companions?.join("; ") ?? "",
        v?.email ?? "",
        v?.note ?? "",
        v?.submittedAt ?? "",
      ]
        .map(csvField)
        .join(",");
    });
    const csv = [header.join(","), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mj-rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-cream text-navy px-4 sm:px-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-sans uppercase tracking-[0.4em] text-[10px] text-gold">Admin</p>
            <h1 className="font-serif text-3xl sm:text-4xl mt-1">RSVP Manifest</h1>
            <p className="font-sans text-sm text-navy/65 mt-1">
              {totalRsvps} of {totalGuests} guests have responded.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => startTransition(() => onRefresh())}
              className="font-sans uppercase tracking-[0.25em] text-[10px] px-4 py-2 border border-navy/40 hover:bg-navy/5 rounded"
            >
              {pending ? "Refreshing…" : "Refresh"}
            </button>
            <button
              onClick={downloadCsv}
              className="font-sans uppercase tracking-[0.25em] text-[10px] px-4 py-2 bg-navy-deep text-cream hover:bg-gold hover:text-navy rounded"
            >
              Export CSV
            </button>
            <form action={onLogout}>
              <button
                type="submit"
                className="font-sans uppercase tracking-[0.25em] text-[10px] px-4 py-2 border border-navy/40 hover:bg-navy/5 rounded"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Stat label="Attending" value={totals.yes} accent="text-emerald-600" />
          <Stat label="Declined" value={totals.no} accent="text-rouge" />
          <Stat label="Pending" value={totals.pending} accent="text-navy/50" />
          <Stat
            label="Seats confirmed"
            value={`${totals.seatsConfirmed} / ${totals.seatsReserved}`}
            accent="text-gold"
          />
        </section>

        <div className="flex items-center gap-2 mb-4 text-[11px] font-sans uppercase tracking-[0.25em]">
          {(["all", "yes", "no", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded border ${
                filter === f
                  ? "bg-navy-deep text-cream border-navy-deep"
                  : "border-navy/30 text-navy/70 hover:bg-navy/5"
              }`}
            >
              {f === "all" ? "All" : f === "yes" ? "Attending" : f === "no" ? "Declined" : "Pending"}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border border-navy/15 rounded bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-sand/40 text-navy/60 text-[11px] uppercase tracking-[0.2em]">
              <tr>
                <Th>Code</Th>
                <Th>Name</Th>
                <Th className="text-center">Reserved</Th>
                <Th>Status</Th>
                <Th className="text-center">Attending</Th>
                <Th>Companions</Th>
                <Th>Email</Th>
                <Th>Note</Th>
                <Th>Submitted</Th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.guest.code} className="border-t border-navy/10 align-top">
                  <Td className="font-mono text-[12px]">{r.guest.code}</Td>
                  <Td>
                    {r.guest.firstName} {r.guest.lastName}
                  </Td>
                  <Td className="text-center">{r.guest.seatsReserved}</Td>
                  <Td>
                    {r.rsvp ? (
                      r.rsvp.attending === "yes" ? (
                        <Badge color="emerald">Attending</Badge>
                      ) : (
                        <Badge color="rouge">Declined</Badge>
                      )
                    ) : (
                      <Badge color="gray">Pending</Badge>
                    )}
                  </Td>
                  <Td className="text-center">
                    {r.rsvp?.attending === "yes" ? r.rsvp.seatsAttending : "—"}
                  </Td>
                  <Td className="max-w-[180px] truncate" title={r.rsvp?.companions?.join(", ") ?? ""}>
                    {r.rsvp?.companions?.join(", ") || "—"}
                  </Td>
                  <Td className="max-w-[200px] truncate" title={r.rsvp?.email ?? ""}>
                    {r.rsvp?.email || "—"}
                  </Td>
                  <Td className="max-w-[240px] truncate" title={r.rsvp?.note ?? ""}>
                    {r.rsvp?.note || "—"}
                  </Td>
                  <Td className="whitespace-nowrap text-[12px] text-navy/60">
                    {r.rsvp?.submittedAt ? new Date(r.rsvp.submittedAt).toLocaleString() : "—"}
                  </Td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-navy/55 py-10 italic">
                    No guests match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[12px] text-navy/55 leading-relaxed">
          RSVPs persist in Vercel KV when configured (env vars{" "}
          <code className="font-mono text-[11px] bg-sand/50 px-1 rounded">KV_REST_API_URL</code> and{" "}
          <code className="font-mono text-[11px] bg-sand/50 px-1 rounded">KV_REST_API_TOKEN</code>),
          otherwise to a local JSON file in development. On serverless without KV
          they live only in memory + stdout logs.
        </p>
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="bg-white border border-navy/10 rounded p-4">
      <div className="font-sans uppercase tracking-[0.25em] text-[10px] text-navy/55">{label}</div>
      <div className={`font-serif text-2xl sm:text-3xl mt-1 leading-none ${accent}`}>{value}</div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 text-left font-sans font-medium ${className}`}>{children}</th>;
}

function Td({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <td className={`px-3 py-3 ${className}`} title={title}>
      {children}
    </td>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: "emerald" | "rouge" | "gray" }) {
  const styles = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rouge: "bg-rouge/10 text-rouge border-rouge/30",
    gray: "bg-navy/5 text-navy/55 border-navy/20",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-sans uppercase tracking-widest border ${styles[color]}`}>
      {children}
    </span>
  );
}

function csvField(v: string): string {
  if (v == null) return "";
  // Neutralize spreadsheet formula injection: a cell starting with = + - @
  // (or a tab/CR) is treated as a formula by Excel/Sheets. Prefix with a
  // single quote so it's rendered as literal text.
  let s = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  if (/[",\r\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

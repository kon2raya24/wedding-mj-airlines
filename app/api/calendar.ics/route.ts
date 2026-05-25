import { NextResponse } from "next/server";
import { wedding } from "@/lib/config";

// Static ICS dates derived from lib/config. We hard-code Manila (UTC+8)
// formatting so the event lands on the right day in every calendar.

function fmtUtc(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function escapeIcs(s: string): string {
  return s.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
}

export async function GET() {
  const start = new Date(wedding.date);
  // Default duration: 6 hours covers ceremony + reception.
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);
  const now = new Date();
  const uid = `${wedding.flightNumber.toLowerCase()}-${start.getTime()}@josephandmarjorie`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${wedding.brand}//Wedding Invitation//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${fmtUtc(now)}`,
    `DTSTART:${fmtUtc(start)}`,
    `DTEND:${fmtUtc(end)}`,
    `SUMMARY:${escapeIcs(`${wedding.groomFirst} & ${wedding.brideFirst} — Wedding`)}`,
    `DESCRIPTION:${escapeIcs(
      `Flight ${wedding.flightNumber} to Forever. Boarding ${wedding.boardingTime}. Ceremony ${wedding.ceremonyTime}. Dress code: ${wedding.dressCode}.`,
    )}`,
    `LOCATION:${escapeIcs(`${wedding.gate}, ${wedding.destinationVenue}`)}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`${wedding.groomFirst} & ${wedding.brideFirst} — 1 day to go!`)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ];

  return new NextResponse(lines.join("\r\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${wedding.flightNumber.toLowerCase()}-wedding.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

// Loads lib/guest-list.json into the "Guests" tab of the Google Sheet via
// the Apps Script backend. Run with the same env vars the site uses:
//
//   APPS_SCRIPT_URL=... APPS_SCRIPT_TOKEN=... npm run guests:push
//
// Replaces the whole tab, so the sheet ends up matching the file exactly.
import { readFile } from "node:fs/promises";

const url = process.env.APPS_SCRIPT_URL;
const secret = process.env.APPS_SCRIPT_TOKEN;
if (!url || !secret) {
  console.error("Set APPS_SCRIPT_URL and APPS_SCRIPT_TOKEN first.");
  process.exit(1);
}

const list = JSON.parse(await readFile(new URL("../lib/guest-list.json", import.meta.url), "utf8"));
const guests = list.map((g) => ({
  firstName: g.firstName,
  lastName: g.lastName,
  seatsReserved: 1 + g.companions.length,
  companions: g.companions,
}));

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify({ action: "guests.set", guests, secret }),
  redirect: "follow",
});
const text = await res.text();
console.log(res.status, text.slice(0, 300));
if (!res.ok) process.exit(1);

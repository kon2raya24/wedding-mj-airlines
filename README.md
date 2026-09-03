# Marjorie & Joseph — Wedding Website

A modern, single-page wedding website built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. Designed for one-click deploy to Vercel.

## Run locally

```powershell
npm install
npm run dev
# open http://localhost:3000
```

Production mode (`npm run build && npm run start`) needs `SESSION_SECRET`
set in the shell, otherwise the app refuses to sign cookies. Without the
Apps Script env vars the site uses the guest list in `lib/guest-list.json`
and writes RSVPs to `data/rsvps.json` (gitignored) — delete that file to
test the one-answer-per-guest flow again.

## Edit content

Almost everything (names, date, venues, story, schedule, wedding party,
FAQ, registry, attire, hotels) lives in **`lib/config.ts`**. Edit the strings
and the site updates. The guest list is separate: **`lib/guest-list.json`**
(see *Guest check-in* below).

Photos live in `public/images/`. The gallery, venue cards, quote backdrop
and registry/countdown backdrops are all referenced from `lib/config.ts` or
the component that uses them.

### The film

The hero and the login page play the save-the-date film behind everything:

| File | Used for |
| --- | --- |
| `public/video/save-the-date.mp4` | The 1080p master. Plays behind the hero on desktop and in the "Watch the film" overlay with sound. |
| `public/video/hero-loop.mp4` | Muted 30 s, 1440 px excerpt (~3 MB) used on phones and data-saver connections. |
| `public/images/hero-poster.jpg` | 1920 px still shown until the film loads, and the base of the share card. |

Regenerate the loop and the still from a new master with ffmpeg:

```bash
ffmpeg -ss 4 -t 30 -i public/video/save-the-date.mp4 -an -vf scale=1440:-2 \
  -c:v libx264 -crf 29 -preset slow -pix_fmt yuv420p -movflags +faststart public/video/hero-loop.mp4
ffmpeg -ss 6 -i public/video/save-the-date.mp4 -frames:v 1 -q:v 2 public/images/hero-poster.jpg
```

### Share card, icon, fonts

`app/opengraph-image.tsx` renders the 1200×630 card shown when the link is
shared (names, flight line, date, venue) from the same config values, on
top of the poster still. It uses the WOFF fonts in `app/fonts/` so it never
waits on Google Fonts. `app/icon.svg` is the favicon. `app/not-found.tsx` is
the branded 404 for signed-in guests.

### Motion

The site honours `prefers-reduced-motion`: with it on, the boarding
curtain, inertia scroll (Lenis), hero take-off, tilt, parallax, scroll-driven
reveals and the route-map plane all switch off and the layout renders
static. Turn it off in your OS accessibility settings to review the full
experience.

## Sections

1. **Hero** — Full-bleed film, names at editorial scale, "Watch the film", check-in
2. **Dashboard** — Boarding pass (tilts under the pointer), passenger check-in, quick links with gate codes, countdown gate screen
3. **Our Itinerary** — Pinned route map with a plane that flies the legs as you scroll
4. **Quote** — In-flight moment over the golden-hour photo
5. **Where we land** — Ceremony + Reception cards with maps
6. **Departure Board** — Split-flap schedule with a live Manila clock
7. **The Crew** — Pilot cards, air-traffic control, crew badges, sponsor manifest
8. **Postcards** — Full-bleed draggable film strip with lightbox
9. **Accommodations** — Hotel luggage tags
10. **Gift Registry** — Baggage-claim belt with hanging payment tags (QR front, details on flip)
11. **Attire** — Dress code by cabin class with illustrated line-ups (`components/AttireFigures.tsx`)
12. **Travel Info** — Safety-card FAQ
13. **Guest Book** — Airmail postcards
14. **RSVP** — Boarding-pass form; companions are listed by name with a boarding toggle
15. **Footer** — Closing line, socials, flight strip

## The Google Sheet is the whole backend

One spreadsheet plus one Apps Script hold everything — guest list, RSVPs,
guest book and outgoing email. There is **no database, no mail provider, no
API key and no domain to verify**, because the script runs inside your own
Google account: it edits the sheet as you, and sends mail from your Gmail.

Three tabs, each with a header row in row 1 (the `setup` function creates
them for you):

**`Guests`** — your real guest list. This is what check-in reads.

| A | B | C | D |
| --- | --- | --- | --- |
| First name | Last name | Seats reserved | Companions |

Each row is the family **representative** — the person who checks in.
`Companions` names everyone else on that invitation, one per line (or
separated by `;`); the RSVP form lists them with a boarding toggle each, so
guests never type names. `Seats reserved` includes the representative, so it
should equal 1 + the number of companions (the site enforces at least that).

The final list also lives in `lib/guest-list.json`; `npm run guests:push`
loads it into the sheet (needs `APPS_SCRIPT_URL` / `APPS_SCRIPT_TOKEN`). A guest added here can check in within a minute (the list is
cached for 60s).

**`RSVPs`** — written by the site, one row per guest.

| A | B | C | D | E | F | G | H | I |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Submitted at | First name | Last name | Seats reserved | Attending | Seats attending | Companions | Email | Note |

**`Guestbook`**

| A | B | C | D |
| --- | --- | --- | --- |
| Submitted at | Name | From | Message |

## Setup

1. Create a Google Sheet.
2. **Extensions ▸ Apps Script**, and replace `Code.gs` with the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs) from this repo.
3. Change `SECRET` at the top of that file to a long random string.
4. **Run ▸ setup** once and grant the permissions it asks for. This creates
   the three tabs. (Google will warn the app is unverified — it is your own
   script; choose *Advanced ▸ Go to project*.)
5. **Deploy ▸ New deployment ▸ Web app**, with:
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Copy the `/exec` URL.
7. In Vercel set `APPS_SCRIPT_URL` and `APPS_SCRIPT_TOKEN`, then redeploy.

After editing `Code.gs` later, you must **Deploy ▸ Manage deployments ▸
edit ▸ New version** for the live URL to pick up the change.

> The web app URL is reachable by anyone who has it, which is why every
> request carries `APPS_SCRIPT_TOKEN` and the script rejects anything else.
> Treat the URL and token as secrets.

### Email limits

Mail is sent by `MailApp` from your Gmail. A consumer Gmail account allows
about **100 recipients per day**; Google Workspace allows 1,500. Each RSVP
sends up to two messages (the couple's copy, plus the guest's own if they
left an address). `setup` logs your remaining quota.

### One RSVP per guest

The script takes a lock, checks for an existing row, and refuses a second
submission. A returning guest sees their existing answer instead of a blank
form, and a replayed request gets a 409. To let someone re-submit, delete
their row from the `RSVPs` tab.

### If the write fails

The guest sees an error and can retry, rather than a false success screen.
Every submission is also written to the Vercel logs as an `[RSVP]` line, so
nothing is ever truly lost.

## Environment variables

| Variable | Needed for | Notes |
| --- | --- | --- |
| `SESSION_SECRET` | **required in production** | 16+ chars. Signs the guest cookie. |
| `APPS_SCRIPT_URL` | everything | The `/exec` URL from the web-app deployment. |
| `APPS_SCRIPT_TOKEN` | everything | Must match `SECRET` in `Code.gs`. |
| `ADMIN_PASSWORD` | `/admin` | Without it the admin page is disabled. |
| `RSVP_NOTIFY_EMAIL` | emails | Optional, comma-separated. Overrides `notifyEmails` in `lib/config.ts`. |

**Without `APPS_SCRIPT_URL` / `APPS_SCRIPT_TOKEN` the site falls back to a
seed guest list and a local JSON file**, and logs the emails it would have
sent instead of sending them. That fallback exists so `npm run dev` works
with no setup — never rely on it in production.

## Guest check-in

Every invitation carries the **same** code (`INVITATION_CODE` in
`lib/config.ts`). A guest still has to appear by name on the guest list —
`lib/guest-list.json` (or the `Guests` tab when the backend is configured).

Each entry is the family **representative** who checks in, with the
`companions` travelling on that invitation named alongside. Seats are
derived (representative + companions). Companions never type anything: the
representative sees them listed on the RSVP form and just marks who is
boarding. Titles are kept on companions as written; representatives are
stored by plain first and last name (e.g. "Julius Mendoza", "Nida Palma") so
they can type their own names to check in.

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → import the repo
3. Vercel auto-detects Next.js — accept defaults and click Deploy

You'll get a `marjorie-and-joseph.vercel.app` URL. Connect a custom domain in Vercel project settings if you want.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 3, CSS scroll-driven animations for the scroll choreography
- Lenis for inertia scrolling (pointer devices only)
- Google Fonts via `next/font` (Great Vibes, Cormorant Garamond, Inter), plus local WOFF copies for the share card
- Google Apps Script + Google Sheets as the backend

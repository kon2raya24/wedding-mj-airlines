# Marjorie & Joseph — Wedding Website

A modern, single-page wedding website built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. Designed for one-click deploy to Vercel.

## Run locally

```powershell
npm install
npm run dev
# open http://localhost:3000
```

## Edit content

Almost everything (names, date, venues, story, schedule, wedding party, FAQ, registry, hotels) lives in **`lib/config.ts`**. Open that file and edit the strings — the site updates instantly.

To swap photos, edit the `gallery` array in `lib/config.ts` (any URL works). For local images, drop files in `public/images/` and reference them as `/images/your-photo.jpg`.

## Sections

1. **Hero** — Couple names, save-the-date headline
2. **Countdown** — Live D/H/M/S ticker
3. **Our Story** — Timeline of milestones
4. **Event Details** — Ceremony + Reception cards (with map links)
5. **Schedule** — Hour-by-hour day-of timeline
6. **Wedding Party** — Bridesmaids & groomsmen
7. **Gallery** — Click-to-enlarge photo grid
8. **Travel** — Hotel recommendations
9. **Registry** — GCash, bank, honeymoon fund cards
10. **FAQ** — Accordion of common questions
11. **Guest Book** — Wall of well-wishes (in-memory)
12. **RSVP** — Form with confetti success state
13. **Footer** — Hashtag, social, sign-off

## The Google Sheet is the database

One spreadsheet drives the whole site — no separate database. Three tabs,
each with a header row in row 1:

**`Guests`** — your real guest list. This is what check-in reads.

| A | B | C |
| --- | --- | --- |
| First name | Last name | Seats reserved |

`Seats reserved` includes the guest themselves, so `2` means guest + 1
companion. Adding a guest here lets them check in within a minute (the list
is cached for 60s).

**`RSVPs`** — written by the site, one row per response.

| A | B | C | D | E | F | G | H | I |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Submitted at | First name | Last name | Seats reserved | Attending | Seats attending | Companions | Email | Note |

**`Guestbook`** — written by the site.

| A | B | C | D |
| --- | --- | --- | --- |
| Submitted at | Name | From | Message |

You can safely edit these by hand. If a guest needs their RSVP changed,
add a corrected row at the bottom — the later row wins.

### One RSVP per guest

The site refuses a second submission: a guest who returns sees their
existing answer instead of a blank form, and the API rejects a replay with
409. To let someone re-submit, delete their row from the `RSVPs` tab.

### If the sheet write fails

The guest sees an error and can retry, rather than a false success screen.
Every submission is also written to the Vercel logs as an `[RSVP]` line, so
nothing is ever truly lost.

### Emails

Each RSVP sends a boarding-pass email — styled like the site — to the guest
(if they left an address) and to everyone in `notifyEmails` in
`lib/config.ts`. Both include the main guest's name and every companion,
with who is and isn't boarding. Mail failures are logged but never cost the
guest their RSVP.

## Environment variables

| Variable | Needed for | Notes |
| --- | --- | --- |
| `SESSION_SECRET` | **required in production** | 16+ chars. Signs the guest cookie. |
| `GOOGLE_SHEETS_ID` | everything | The long id in the spreadsheet URL. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | everything | `...@....iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | everything | The `private_key` from the service-account JSON. Pasting it with literal `\n` is fine. |
| `ADMIN_PASSWORD` | `/admin` | Without it the admin page is disabled. |
| `RESEND_API_KEY` | emails | From resend.com. |
| `EMAIL_FROM` | emails | e.g. `JM Airways <rsvp@yourdomain.com>`. Must be a Resend-verified domain — the default `onboarding@resend.dev` only delivers to the Resend account owner. |
| `RSVP_NOTIFY_EMAIL` | emails | Optional, comma-separated. Overrides `notifyEmails` in config. |

**Without the Google vars the site falls back to a seed guest list and a
local JSON file** so `npm run dev` works with no credentials. That fallback
is for development — never rely on it in production.

## Google Sheets setup

1. Google Cloud console → new (or existing) project → **enable the Google
   Sheets API**.
2. Create a **service account**, then add a **JSON key** and download it.
3. Open your spreadsheet and **share it with the service account's email
   address as an Editor** — this is the step people miss; without it every
   read and write returns 403.
4. Create the three tabs above with their header rows.
5. Set the three `GOOGLE_*` vars in Vercel and redeploy.

## Guest check-in

Every invitation carries the **same** code (`INVITATION_CODE` in
`lib/config.ts`). A guest still has to appear by name on the `Guests` tab,
which is where each guest's reserved seat count lives.

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → import the repo
3. Vercel auto-detects Next.js — accept defaults and click Deploy

You'll get a `marjorie-and-joseph.vercel.app` URL. Connect a custom domain in Vercel project settings if you want.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 3
- Google Fonts via `next/font` (Great Vibes, Cormorant Garamond, Inter)

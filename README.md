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

## RSVP — where submissions go

Every RSVP is written to **three** places. Each is independent: if one fails
the guest still gets a success screen, and the failure is logged with a
`[RSVP] sheets|notify|confirm failed` line in the Vercel logs.

1. **Storage** — Vercel KV when configured, otherwise a local JSON file in
   dev, otherwise memory + stdout. Keyed by guest, so re-submitting replaces
   that guest's answer rather than adding a duplicate.
2. **Google Sheet** — an append-only log, so a guest who changes their mind
   leaves both rows and you keep the history.
3. **Email** — a notification to the couple, plus a confirmation to the
   guest if they left an address.

### Environment variables

| Variable | Needed for | Notes |
| --- | --- | --- |
| `SESSION_SECRET` | **required in production** | 16+ chars. Signs the guest cookie. |
| `ADMIN_PASSWORD` | `/admin` | Without it the admin page is disabled. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | persistence | Auto-populated by the Vercel KV / Upstash integration. **Without these, RSVPs survive only in the logs.** |
| `RESEND_API_KEY` | emails | From resend.com. |
| `EMAIL_FROM` | emails | e.g. `JM Airways <rsvp@yourdomain.com>`. Must be a Resend-verified domain — the default `onboarding@resend.dev` can only deliver to the Resend account owner. |
| `RSVP_NOTIFY_EMAIL` | emails | Optional. Defaults to `contact.email` in `lib/config.ts`. |
| `GOOGLE_SHEETS_ID` | sheet | The long id in the spreadsheet URL. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | sheet | `...@....iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | sheet | The `private_key` from the service-account JSON. Pasting it with literal `\n` is fine. |
| `GOOGLE_SHEETS_TAB` | sheet | Optional, defaults to `RSVPs`. |

### Google Sheets setup

1. Google Cloud console → new (or existing) project → **enable the Google
   Sheets API**.
2. Create a **service account**, then add a **JSON key** and download it.
3. Open your spreadsheet and **share it with the service account's email
   address as an Editor** — this is the step people miss; without it every
   append returns 403.
4. Name the tab `RSVPs` (or set `GOOGLE_SHEETS_TAB`) and paste this header
   row into row 1:

   ```
   Submitted at | First name | Last name | Seats reserved | Attending | Seats attending | Companions | Email | Note
   ```

5. Set `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL` and
   `GOOGLE_PRIVATE_KEY` in the Vercel project, then redeploy.

If the Google vars are absent the integration no-ops quietly and logs
`[Sheets] not configured` — nothing else breaks.

### Guest check-in

Every invitation carries the **same** code (`INVITATION_CODE` in
`lib/config.ts`). A guest still has to appear by name in `lib/guests.ts`,
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

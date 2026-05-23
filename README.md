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

## RSVP & Guest Book — important

The `/api/rsvp` route currently just `console.log`s submissions and returns `{ ok: true }`. The guest book stores entries in browser memory only. To make these production-ready, pick one:

- **Formspree** — easiest: replace the `fetch("/api/rsvp")` URL in `components/RSVP.tsx` with your Formspree endpoint
- **Resend** — email yourselves on each RSVP; install `resend` and update `app/api/rsvp/route.ts`
- **Supabase / Postgres** — full database; install `@supabase/supabase-js` and persist payloads

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

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

## The Google Sheet is the whole backend

One spreadsheet plus one Apps Script hold everything — guest list, RSVPs,
guest book and outgoing email. There is **no database, no mail provider, no
API key and no domain to verify**, because the script runs inside your own
Google account: it edits the sheet as you, and sends mail from your Gmail.

Three tabs, each with a header row in row 1 (the `setup` function creates
them for you):

**`Guests`** — your real guest list. This is what check-in reads.

| A | B | C |
| --- | --- | --- |
| First name | Last name | Seats reserved |

`Seats reserved` includes the guest themselves, so `2` means guest + 1
companion. A guest added here can check in within a minute (the list is
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

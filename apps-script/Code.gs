/**
 * JM Airways — wedding site backend.
 *
 * This runs as YOU inside your own Google account, so it can read and write
 * the spreadsheet and send mail from your Gmail with no service account, no
 * API key and no domain verification.
 *
 * ── Setup ────────────────────────────────────────────────────────────────
 * 1. Open your spreadsheet → Extensions → Apps Script.
 * 2. Replace everything in Code.gs with this file.
 * 3. Change SECRET below to a long random string of your own.
 * 4. Run `setup` once (Run ▸ setup) and grant the permissions it asks for.
 *    That creates the three tabs with their header rows.
 * 5. Deploy ▸ New deployment ▸ type "Web app"
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Copy the /exec URL it gives you.
 * 6. In Vercel set:
 *      APPS_SCRIPT_URL   = that /exec URL
 *      APPS_SCRIPT_TOKEN = the same SECRET you set below
 *
 * After editing this file you must Deploy ▸ Manage deployments ▸ edit ▸
 * "New version" for the change to take effect on the live URL.
 */

// ⚠️ CHANGE THIS, and set the same value as APPS_SCRIPT_TOKEN in Vercel.
const SECRET = 'change-me-to-a-long-random-string';

const TAB_GUESTS = 'Guests';
const TAB_RSVPS = 'RSVPs';
const TAB_GUESTBOOK = 'Guestbook';

const HEADERS = {};
HEADERS[TAB_GUESTS] = ['First name', 'Last name', 'Seats reserved'];
HEADERS[TAB_RSVPS] = [
  'Submitted at', 'First name', 'Last name', 'Seats reserved',
  'Attending', 'Seats attending', 'Companions', 'Email', 'Note',
];
HEADERS[TAB_GUESTBOOK] = ['Submitted at', 'Name', 'From', 'Message'];

/** Run this once from the editor to create the tabs. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  [TAB_GUESTS, TAB_RSVPS, TAB_GUESTBOOK].forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    const head = HEADERS[name];
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  Logger.log('Tabs ready. Remaining email quota today: %s',
    MailApp.getRemainingDailyQuota());
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    const head = HEADERS[name];
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

/** All data rows (header stripped), padded to `width` columns. */
function rows(name, width) {
  const sh = sheet(name);
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, width).getValues().map(function (r) {
    return r.map(function (c) {
      if (c instanceof Date) return c.toISOString();
      return c === null || c === undefined ? '' : String(c);
    });
  });
}

function key(first, last) {
  return (String(first).trim().toLowerCase() + '|' +
          String(last).trim().toLowerCase());
}

// ── actions ───────────────────────────────────────────────────────────────

function readGuests() {
  return rows(TAB_GUESTS, 3)
    .filter(function (r) { return r[0] || r[1]; })
    .map(function (r) {
      return {
        firstName: r[0].trim(),
        lastName: r[1].trim(),
        seatsReserved: Math.max(1, parseInt(r[2], 10) || 1),
      };
    });
}

function readRsvpRows() {
  return rows(TAB_RSVPS, HEADERS[TAB_RSVPS].length)
    .filter(function (r) { return r[1] || r[2]; });
}

function readGuestbook() {
  return rows(TAB_GUESTBOOK, 4)
    .filter(function (r) { return r[1] && r[3]; })
    .map(function (r) {
      return { submittedAt: r[0], name: r[1], from: r[2], message: r[3] };
    });
}

/**
 * Appends the RSVP and sends the emails, under a lock so two guests
 * submitting at the same moment can't race. Refuses a second submission
 * from the same guest.
 */
function submitRsvp(row, emails) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const guestKey = key(row[1], row[2]);
    const existing = readRsvpRows();
    for (let i = 0; i < existing.length; i++) {
      if (key(existing[i][1], existing[i][2]) === guestKey) {
        return { ok: false, alreadySubmitted: true, row: existing[i] };
      }
    }
    sheet(TAB_RSVPS).appendRow(row);
  } finally {
    lock.releaseLock();
  }

  // Mail is sent after the row is safely written: a delivery problem must
  // never cost the guest their RSVP.
  return { ok: true, mail: sendAll(emails) };
}

function addGuestbook(row) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    sheet(TAB_GUESTBOOK).appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

/** Sends each {to, subject, html}. Returns per-message results. */
function sendAll(emails) {
  if (!emails || !emails.length) return [];
  return emails.map(function (m) {
    try {
      MailApp.sendEmail({
        to: m.to,
        subject: m.subject,
        htmlBody: m.html,
        name: m.fromName || 'JM Airways',
        replyTo: m.replyTo || undefined,
      });
      return { to: m.to, sent: true };
    } catch (err) {
      return { to: m.to, sent: false, error: String(err) };
    }
  });
}

// ── entry point ───────────────────────────────────────────────────────────

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'bad json' });
  }

  if (body.secret !== SECRET) {
    return json({ ok: false, error: 'unauthorized' });
  }

  try {
    switch (body.action) {
      case 'ping':
        return json({ ok: true, quota: MailApp.getRemainingDailyQuota() });
      case 'guests':
        return json({ ok: true, guests: readGuests() });
      case 'rsvps':
        return json({ ok: true, rows: readRsvpRows() });
      case 'rsvp':
        return json(submitRsvp(body.row, body.emails));
      case 'guestbook':
        return json({ ok: true, entries: readGuestbook() });
      case 'guestbook.add':
        return json(addGuestbook(body.row));
      default:
        return json({ ok: false, error: 'unknown action: ' + body.action });
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

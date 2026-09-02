// Resend integration. Skips silently when RESEND_API_KEY isn't set so the
// site stays functional even without the email service wired up.
//
// Two emails go out per RSVP:
//   - a confirmation to the guest (only if they left an address)
//   - a notification to the couple at wedding.contact.email, so they see
//     every response without opening the admin page
import { wedding } from "./config";
import type { RsvpEntry } from "./rsvp-store";
import { formatCompanion } from "./rsvp-types";

// Where the couple get notified. Overridable so they can point it at a
// shared inbox without editing config.
function notifyAddress(): string {
  return process.env.RSVP_NOTIFY_EMAIL || wedding.contact.email;
}

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? `${wedding.brand} <onboarding@resend.dev>`;
}

async function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  // Lazy import keeps the dependency out of the cold-start path when unused.
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

// Notifies the couple that an RSVP landed. Always sent, regardless of
// whether the guest supplied their own address.
export async function sendRsvpNotification(entry: RsvpEntry): Promise<void> {
  const resend = await getResend();
  if (!resend) {
    console.log("[Email] RESEND_API_KEY not set, skipping notification to", notifyAddress());
    return;
  }

  const attending = entry.attending === "yes";
  const who = `${entry.firstName} ${entry.lastName}`;
  const subject = attending
    ? `RSVP: ${who} is boarding (${entry.seatsAttending} of ${entry.seatsReserved})`
    : `RSVP: ${who} can't make it`;

  const rows: [string, string][] = [
    ["Passenger", who],
    ["Attending", attending ? `Yes — ${entry.seatsAttending} of ${entry.seatsReserved} seats` : "No"],
    ["Companions", entry.companions.length ? entry.companions.map(formatCompanion).join(", ") : "—"],
    ["Guest email", entry.email || "—"],
    ["Note", entry.note || "—"],
    ["Submitted", new Date(entry.submittedAt).toLocaleString("en-PH", { timeZone: "Asia/Manila" })],
  ];

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#1c2940;max-width:520px;">
  <h2 style="margin:0 0 4px;font-size:18px;">${escapeHtml(subject)}</h2>
  <p style="margin:0 0 16px;color:#1c2940aa;font-size:13px;">${escapeHtml(wedding.brand)} · Flight ${escapeHtml(wedding.flightNumber)}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td style="padding:6px 12px 6px 0;color:#1c2940aa;white-space:nowrap;vertical-align:top;">${escapeHtml(k)}</td>
      <td style="padding:6px 0;">${escapeHtml(v)}</td>
    </tr>`,
      )
      .join("")}
  </table>
</div>`;

  // Resend resolves with { data, error } instead of rejecting on API
  // errors, so an unverified sender or bad key would otherwise fail
  // completely silently. Surface it to the caller.
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: notifyAddress(),
    replyTo: entry.email || undefined,
    subject,
    html,
  });
  if (error) {
    throw new Error(`Resend rejected the notification: ${error.name} — ${error.message}`);
  }
}

export async function sendRsvpConfirmation(entry: RsvpEntry): Promise<void> {
  if (!entry.email) return;
  const resend = await getResend();
  if (!resend) {
    console.log("[Email] RESEND_API_KEY not set, skipping confirmation for", entry.email);
    return;
  }

  const fromAddr = fromAddress();

  const subject =
    entry.attending === "yes"
      ? `Your boarding pass is confirmed — ${wedding.groomFirst} & ${wedding.brideFirst}, ${wedding.shortDateCompact}`
      : `We received your RSVP — ${wedding.groomFirst} & ${wedding.brideFirst}`;

  const html = renderEmail(entry);

  const { error } = await resend.emails.send({
    from: fromAddr,
    to: entry.email,
    subject,
    html,
  });
  if (error) {
    throw new Error(`Resend rejected the confirmation: ${error.name} — ${error.message}`);
  }
}

function renderEmail(entry: RsvpEntry): string {
  const attending = entry.attending === "yes";
  const companions = entry.companions.length
    ? `<p style="margin:8px 0 0;font-size:14px;color:#1c2940cc;">Companions: ${escapeHtml(entry.companions.map(formatCompanion).join(", "))}</p>`
    : "";
  const note = entry.note
    ? `<p style="margin:16px 0 0;font-size:14px;color:#1c2940cc;"><em>Your note:</em> ${escapeHtml(entry.note)}</p>`
    : "";

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f6efe0;font-family:Georgia, 'Cormorant Garamond', serif;color:#1c2940;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 8px 24px rgba(32,41,60,0.12);">
      <div style="background:#1c2940;color:#f6efe0;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c89b3c;">${wedding.brand}</div>
          <div style="font-family:Georgia,serif;font-size:18px;margin-top:4px;">Boarding Pass · ${attending ? "Confirmed" : "Received"}</div>
        </div>
        <div style="text-align:right;font-family:'Courier New',monospace;font-size:11px;color:#f6efe0cc;letter-spacing:2px;">
          FLT ${escapeHtml(wedding.flightNumber)}<br/>
          ${escapeHtml(wedding.shortDateCompact)}
        </div>
      </div>

      <div style="padding:28px;">
        <p style="margin:0;font-size:20px;">Dear ${escapeHtml(entry.firstName)},</p>
        <p style="margin:12px 0 0;font-size:16px;line-height:1.55;">
          ${
            attending
              ? `We're thrilled you'll be flying with us! Your seat${entry.seatsAttending > 1 ? "s have" : " has"} been reserved.`
              : `Thank you for letting us know. We'll miss you on the day, but we're grateful you took the time to RSVP.`
          }
        </p>

        <div style="margin:24px 0;padding:16px;border:1px dashed #c89b3c66;border-radius:4px;background:#f6efe0;">
          <table style="width:100%;font-size:14px;color:#1c2940;">
            <tr>
              <td style="padding:4px 0;color:#1c2940aa;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-size:11px;">Passenger</td>
              <td style="padding:4px 0;text-align:right;">${escapeHtml(entry.firstName)} ${escapeHtml(entry.lastName)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#1c2940aa;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-size:11px;">Reservation</td>
              <td style="padding:4px 0;text-align:right;font-family:'Courier New',monospace;">${escapeHtml(entry.code)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#1c2940aa;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-size:11px;">Seats reserved</td>
              <td style="padding:4px 0;text-align:right;">${entry.seatsReserved}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#1c2940aa;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-size:11px;">Attending</td>
              <td style="padding:4px 0;text-align:right;">${attending ? `${entry.seatsAttending} of ${entry.seatsReserved}` : "Sadly, no"}</td>
            </tr>
          </table>
          ${companions}
          ${note}
        </div>

        <p style="margin:0;font-size:14px;line-height:1.55;">
          <strong>Date:</strong> ${escapeHtml(wedding.shortDate)}<br/>
          <strong>Boarding:</strong> ${escapeHtml(wedding.boardingTime)}<br/>
          <strong>Ceremony:</strong> ${escapeHtml(wedding.ceremonyTime)}<br/>
          <strong>Destination:</strong> ${escapeHtml(wedding.destinationVenue)}<br/>
          <strong>Dress code:</strong> ${escapeHtml(wedding.dressCode)}
        </p>

        <p style="margin:24px 0 0;font-style:italic;font-size:14px;color:#1c2940aa;">
          Together is our favorite destination. ♡<br/>
          — ${escapeHtml(wedding.groomFirst)} &amp; ${escapeHtml(wedding.brideFirst)}
        </p>
      </div>

      <div style="background:#1c2940;color:#f6efe0cc;padding:14px 28px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-align:center;">
        ${escapeHtml(wedding.hashtag)}
      </div>
    </div>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}

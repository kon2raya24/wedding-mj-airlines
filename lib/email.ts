// Resend integration. Skips silently when RESEND_API_KEY isn't set so the
// site stays functional even without the email service wired up.
import { wedding } from "./config";
import type { RsvpEntry } from "./rsvp-store";

export async function sendRsvpConfirmation(entry: RsvpEntry): Promise<void> {
  if (!entry.email) return;
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not set, skipping confirmation for", entry.email);
    return;
  }

  // Lazy import keeps the dependency out of the cold-start path when unused.
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const fromAddr =
    process.env.EMAIL_FROM ?? `MJ Airways <onboarding@resend.dev>`;

  const subject =
    entry.attending === "yes"
      ? `Your boarding pass is confirmed — ${wedding.brideFirst} & ${wedding.groomFirst}, ${wedding.shortDateCompact}`
      : `We received your RSVP — ${wedding.brideFirst} & ${wedding.groomFirst}`;

  const html = renderEmail(entry);

  try {
    await resend.emails.send({
      from: fromAddr,
      to: entry.email,
      subject,
      html,
    });
  } catch (err) {
    console.warn("[Email] failed to send:", err);
  }
}

function renderEmail(entry: RsvpEntry): string {
  const attending = entry.attending === "yes";
  const companions = entry.companions.length
    ? `<p style="margin:8px 0 0;font-size:14px;color:#0e2a47cc;">Companions: ${escapeHtml(entry.companions.join(", "))}</p>`
    : "";
  const note = entry.note
    ? `<p style="margin:16px 0 0;font-size:14px;color:#0e2a47cc;"><em>Your note:</em> ${escapeHtml(entry.note)}</p>`
    : "";

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f6efe0;font-family:Georgia, 'Cormorant Garamond', serif;color:#0e2a47;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 8px 24px rgba(8,26,46,0.12);">
      <div style="background:#0e2a47;color:#f6efe0;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c89b3c;">MJ Airways</div>
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
          <table style="width:100%;font-size:14px;color:#0e2a47;">
            <tr>
              <td style="padding:4px 0;color:#0e2a47aa;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-size:11px;">Passenger</td>
              <td style="padding:4px 0;text-align:right;">${escapeHtml(entry.firstName)} ${escapeHtml(entry.lastName)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#0e2a47aa;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-size:11px;">Reservation</td>
              <td style="padding:4px 0;text-align:right;font-family:'Courier New',monospace;">${escapeHtml(entry.code)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#0e2a47aa;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-size:11px;">Seats reserved</td>
              <td style="padding:4px 0;text-align:right;">${entry.seatsReserved}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#0e2a47aa;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-size:11px;">Attending</td>
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

        <p style="margin:24px 0 0;font-style:italic;font-size:14px;color:#0e2a47aa;">
          Together is our favorite destination. ♡<br/>
          — ${escapeHtml(wedding.brideFirst)} &amp; ${escapeHtml(wedding.groomFirst)}
        </p>
      </div>

      <div style="background:#0e2a47;color:#f6efe0cc;padding:14px 28px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-align:center;">
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

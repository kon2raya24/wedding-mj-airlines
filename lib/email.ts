// Builds the RSVP emails. It does not send them — the Apps Script backend
// does that from the couple's own Gmail (see apps-script/Code.gs), which is
// why no mail provider, API key or verified domain is needed anywhere.
//
// Two emails go out per RSVP:
//   - a boarding-pass confirmation to the guest (if they left an address)
//   - the same pass to the couple at wedding.notifyEmails, so they see
//     every response without opening the admin page
//
// The markup is deliberately old-fashioned — nested tables, inline styles,
// no flexbox/grid, no web fonts, no external images. That is what actually
// renders in Gmail, Outlook and Apple Mail. The palette and layout mirror
// the site's boarding pass; the script/serif faces degrade to Georgia.
import { wedding } from "./config";
import type { Mail } from "./apps-script";
import type { RsvpEntry } from "./rsvp-types";

// Site palette (tailwind.config.ts)
const NAVY = "#1c2940";
const NAVY_DEEP = "#4c6385";
const CREAM = "#f6efe0";
const SAND = "#e9dcc2";
const GOLD = "#c89b3c";

const SERIF = "Georgia, 'Cormorant Garamond', 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

function notifyAddresses(): string[] {
  const raw = process.env.RSVP_NOTIFY_EMAIL;
  if (raw) return raw.split(",").map((s) => s.trim()).filter(Boolean);
  return wedding.notifyEmails;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

// One "LABEL / value" line inside the pass.
function field(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:0 0 2px;font-family:${SANS};font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${NAVY}8c;">${escapeHtml(label)}</td>
  </tr>
  <tr>
    <td style="padding:0 0 14px;font-family:${SERIF};font-size:16px;color:${NAVY};">${value}</td>
  </tr>`;
}

function companionList(entry: RsvpEntry): string {
  if (!entry.companions.length) {
    return `<span style="color:${NAVY}8c;">Travelling solo</span>`;
  }
  return entry.companions
    .map((c) =>
      c.attending
        ? `<span style="color:${NAVY};">&#9992;&nbsp;${escapeHtml(c.name)}</span>`
        : `<span style="color:${NAVY}8c;">&#10007;&nbsp;${escapeHtml(c.name)} <em style="font-family:${SANS};font-size:11px;">(not boarding)</em></span>`,
    )
    .join(`<br/>`);
}

function motifSwatches(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${wedding.motif
    .map(
      (m) =>
        `<td width="22" height="22" bgcolor="${m.hex}" style="border-radius:11px;font-size:0;line-height:0;">&nbsp;</td><td width="6" style="font-size:0;line-height:0;">&nbsp;</td>`,
    )
    .join("")}</tr></table>`;
}

// The boarding pass itself. `forCouple` swaps the greeting for a summary
// header so the couple can scan a full inbox quickly.
function renderPass(entry: RsvpEntry, forCouple: boolean): string {
  const attending = entry.attending === "yes";
  const fullName = `${entry.firstName} ${entry.lastName}`;

  const headline = forCouple
    ? attending
      ? `${fullName} is boarding`
      : `${fullName} can't make it`
    : attending
      ? `You're on board, ${entry.firstName}!`
      : `Thank you, ${entry.firstName}`;

  const blurb = forCouple
    ? `${escapeHtml(fullName)} just responded via the wedding site.`
    : attending
      ? `Your seat${entry.seatsAttending > 1 ? "s have" : " has"} been reserved. We can't wait to celebrate with you.`
      : `We'll miss you on the day, but thank you for letting us know.`;

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${NAVY_DEEP};">
  <!-- preheader: shown in the inbox preview, hidden in the body -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(headline)} &#8212; ${escapeHtml(wedding.shortDate)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${NAVY_DEEP};">
    <tr><td align="center" style="padding:28px 12px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${CREAM};border-radius:6px;overflow:hidden;">

        <!-- header bar -->
        <tr>
          <td style="background:${NAVY};padding:18px 26px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};">
                  &#9992;&nbsp; ${escapeHtml(wedding.brand)}
                  <div style="font-family:${SANS};font-size:9px;letter-spacing:2px;color:${CREAM}b3;padding-top:4px;">${escapeHtml(wedding.tagline)}</div>
                </td>
                <td align="right" style="font-family:${SANS};font-size:10px;letter-spacing:2px;color:${CREAM}b3;">
                  FLT ${escapeHtml(wedding.flightNumber)}<br/>${escapeHtml(wedding.shortDateCompact)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- route strip -->
        <tr>
          <td style="background:${SAND};padding:16px 26px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${SANS};font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${NAVY}8c;">From</td>
                <td align="center"></td>
                <td align="right" style="font-family:${SANS};font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${NAVY}8c;">To</td>
              </tr>
              <tr>
                <td style="font-family:${SERIF};font-size:26px;color:${NAVY};">${escapeHtml(wedding.origin)}</td>
                <td align="center" style="font-family:${SANS};font-size:16px;color:${GOLD};">&#9992;</td>
                <td align="right" style="font-family:${SERIF};font-size:26px;color:${NAVY};">${escapeHtml(wedding.destination)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- perforation -->
        <tr><td style="font-size:0;line-height:0;border-top:2px dashed ${GOLD}66;">&nbsp;</td></tr>

        <!-- greeting -->
        <tr>
          <td style="padding:26px 26px 6px;">
            <div style="font-family:${SERIF};font-size:28px;font-style:italic;color:${NAVY};">${escapeHtml(headline)}</div>
            <div style="font-family:${SERIF};font-size:15px;line-height:1.6;color:${NAVY}cc;padding-top:8px;">${blurb}</div>
          </td>
        </tr>

        <!-- pass details -->
        <tr>
          <td style="padding:18px 26px 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px dashed ${GOLD}66;border-radius:4px;">
              <tr><td style="padding:18px 20px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${field("Passenger", escapeHtml(fullName))}
                  ${field(
                    "Boarding",
                    attending
                      ? `${entry.seatsAttending} of ${entry.seatsReserved} seat${entry.seatsReserved === 1 ? "" : "s"}`
                      : "Sadly, no",
                  )}
                  ${field("Companions", companionList(entry))}
                  ${entry.note ? field("Note", `<em>${escapeHtml(entry.note)}</em>`) : ""}
                  ${forCouple && entry.email ? field("Reply to", escapeHtml(entry.email)) : ""}
                </table>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- flight info -->
        <tr>
          <td style="padding:20px 26px 6px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${field("Date", escapeHtml(wedding.shortDate))}
              ${field("Boarding time", escapeHtml(wedding.boardingTime))}
              ${field("Ceremony", `${escapeHtml(wedding.ceremonyTime)} &#183; ${escapeHtml(wedding.ceremony.venue)}`)}
              ${field("Reception", `${escapeHtml(wedding.reception.time)} &#183; ${escapeHtml(wedding.reception.venue)}`)}
              ${field("Destination", escapeHtml(wedding.ceremony.address))}
            </table>
          </td>
        </tr>

        <!-- dress code + motif -->
        <tr>
          <td style="padding:0 26px 22px;">
            <div style="font-family:${SANS};font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${NAVY}8c;padding-bottom:4px;">Dress code</div>
            <div style="font-family:${SERIF};font-size:16px;color:${NAVY};padding-bottom:10px;">${escapeHtml(wedding.dressCode)} &#183; ${escapeHtml(wedding.attire.palette)}</div>
            ${motifSwatches()}
          </td>
        </tr>

        <tr>
          <td style="padding:0 26px 24px;">
            <div style="border-top:1px dashed ${NAVY}33;padding-top:16px;font-family:${SANS};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${NAVY}a6;text-align:center;">
              Together is our favorite destination &#9825;
            </div>
          </td>
        </tr>

        <!-- footer bar -->
        <tr>
          <td style="background:${NAVY};padding:14px 26px;text-align:center;font-family:${SANS};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${CREAM}b3;">
            ${escapeHtml(wedding.hashtag)}
          </td>
        </tr>
      </table>

      <div style="font-family:${SANS};font-size:11px;color:${CREAM}99;padding-top:14px;">
        ${escapeHtml(wedding.groomFirst)} &amp; ${escapeHtml(wedding.brideFirst)} &#183; ${escapeHtml(wedding.shortDate)}
      </div>

    </td></tr>
  </table>
</body>
</html>`;
}

// Every message this RSVP should produce: the couple's copy, plus the
// guest's own if they left an address.
export function buildRsvpEmails(entry: RsvpEntry): Mail[] {
  const attending = entry.attending === "yes";
  const who = `${entry.firstName} ${entry.lastName}`;
  const fromName = wedding.brand;

  const mails: Mail[] = [
    {
      to: notifyAddresses().join(","),
      fromName,
      replyTo: entry.email || undefined,
      subject: attending
        ? `RSVP: ${who} is boarding (${entry.seatsAttending} of ${entry.seatsReserved})`
        : `RSVP: ${who} can't make it`,
      html: renderPass(entry, true),
    },
  ];

  if (entry.email) {
    mails.push({
      to: entry.email,
      fromName,
      subject: attending
        ? `Your boarding pass is confirmed — ${wedding.groomFirst} & ${wedding.brideFirst}, ${wedding.shortDateCompact}`
        : `We received your RSVP — ${wedding.groomFirst} & ${wedding.brideFirst}`,
      html: renderPass(entry, false),
    });
  }

  return mails;
}

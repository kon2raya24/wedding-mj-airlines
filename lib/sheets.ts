// Appends every RSVP submission to a Google Sheet.
//
// This is an append-only audit log: unlike the KV store (which keeps one
// current answer per guest), a guest who changes their mind produces a
// second row here, so you can see the full history.
//
// Auth is a Google service account. No extra npm dependency — we sign the
// JWT with node:crypto and call the REST API directly.
//
// Setup:
//   1. Google Cloud console → create a service account → add a JSON key.
//   2. Enable the "Google Sheets API" for that project.
//   3. Share the target spreadsheet with the service account's email
//      address, with Editor access.
//   4. Set the env vars below in Vercel.
//
// Env vars (all required — without them this silently no-ops):
//   GOOGLE_SHEETS_ID              the long id in the sheet's URL
//   GOOGLE_SERVICE_ACCOUNT_EMAIL  ...@...iam.gserviceaccount.com
//   GOOGLE_PRIVATE_KEY            the JSON key's private_key value
//   GOOGLE_SHEETS_TAB             optional, defaults to "RSVPs"
import { createSign } from "node:crypto";
import { formatCompanion, type Companion } from "./rsvp-types";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export const SHEET_HEADERS = [
  "Submitted at",
  "First name",
  "Last name",
  "Seats reserved",
  "Attending",
  "Seats attending",
  "Companions",
  "Email",
  "Note",
];

type SheetRsvp = {
  submittedAt: string;
  firstName: string;
  lastName: string;
  seatsReserved: number;
  attending: "yes" | "no";
  seatsAttending: number;
  companions: Companion[];
  email: string;
  note: string;
};

// Pure — the row layout matches SHEET_HEADERS exactly.
export function rsvpToRow(entry: SheetRsvp): string[] {
  return [
    entry.submittedAt,
    entry.firstName,
    entry.lastName,
    String(entry.seatsReserved),
    entry.attending === "yes" ? "Yes" : "No",
    String(entry.seatsAttending),
    entry.companions.map(formatCompanion).join(", "),
    entry.email,
    entry.note,
  ];
}

export function isSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SHEETS_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Vercel's env UI stores newlines as the two characters \ and n, so the key
// comes back as one line. Restore the real newlines or the PEM won't parse.
function normalisePrivateKey(raw: string): string {
  return raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
}

// Signed JWT → OAuth access token (the service-account flow).
export function buildAssertion(
  clientEmail: string,
  privateKey: string,
  now = Math.floor(Date.now() / 1000),
): string {
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signingInput = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  return `${signingInput}.${b64url(signer.sign(normalisePrivateKey(privateKey)))}`;
}

// Access tokens last an hour; reuse across invocations of a warm lambda.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  const assertion = buildAssertion(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    process.env.GOOGLE_PRIVATE_KEY!,
  );

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    throw new Error(`Google token request failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    // Renew a minute early so a token can't expire mid-request.
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

export async function appendRsvpToSheet(entry: SheetRsvp): Promise<void> {
  if (!isSheetsConfigured()) {
    console.log("[Sheets] not configured, skipping append for", entry.firstName, entry.lastName);
    return;
  }

  const sheetId = process.env.GOOGLE_SHEETS_ID!;
  const tab = process.env.GOOGLE_SHEETS_TAB || "RSVPs";
  const token = await getAccessToken();

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}` +
    `/values/${encodeURIComponent(tab)}!A:I:append` +
    `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [rsvpToRow(entry)] }),
  });

  if (!res.ok) {
    // Drop a stale token so the next attempt re-authenticates.
    if (res.status === 401) cachedToken = null;
    throw new Error(`Google Sheets append failed (${res.status}): ${await res.text()}`);
  }
}

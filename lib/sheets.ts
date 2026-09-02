// Google Sheets client. One spreadsheet is the single source of truth for
// the whole site: the guest list, every RSVP, and the guest book.
//
// Auth is a Google service account. No extra npm dependency — we sign the
// JWT with node:crypto and call the REST API directly.
//
// Setup:
//   1. Google Cloud console → create a service account → add a JSON key.
//   2. Enable the "Google Sheets API" for that project.
//   3. Share the spreadsheet with the service account's email address,
//      with Editor access.
//   4. Set the env vars below in Vercel.
//
// Env vars (all three required — without them the site falls back to local
// dev data, see lib/guests.ts):
//   GOOGLE_SHEETS_ID              the long id in the sheet's URL
//   GOOGLE_SERVICE_ACCOUNT_EMAIL  ...@...iam.gserviceaccount.com
//   GOOGLE_PRIVATE_KEY            the JSON key's private_key value
import "server-only";
import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const API = "https://sheets.googleapis.com/v4/spreadsheets";

export const TABS = {
  guests: "Guests",
  rsvps: "RSVPs",
  guestbook: "Guestbook",
} as const;

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

function sheetId(): string {
  const id = process.env.GOOGLE_SHEETS_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_ID is not set");
  return id;
}

async function call(path: string, init?: RequestInit): Promise<Response> {
  const token = await getAccessToken();
  const res = await fetch(`${API}/${encodeURIComponent(sheetId())}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    // Drop a stale token so the next attempt re-authenticates.
    if (res.status === 401) cachedToken = null;
    throw new Error(`Google Sheets ${res.status}: ${await res.text()}`);
  }
  return res;
}

// Reads a tab. Returns rows WITHOUT the header row, each padded to `width`
// so callers can index columns without bounds checks. A missing tab comes
// back as [] rather than throwing, so a half-set-up sheet degrades to
// "no data" instead of a crash.
export async function readRows(tab: string, width: number): Promise<string[][]> {
  const range = `${tab}!A:${String.fromCharCode(64 + width)}`;
  let res: Response;
  try {
    res = await call(`/values/${encodeURIComponent(range)}`);
  } catch (err) {
    if (err instanceof Error && /Google Sheets 400/.test(err.message)) {
      console.warn(`[Sheets] tab "${tab}" not found — treating as empty`);
      return [];
    }
    throw err;
  }
  const json = (await res.json()) as { values?: string[][] };
  const rows = json.values ?? [];
  return rows.slice(1).map((r) => {
    const padded = [...r];
    while (padded.length < width) padded.push("");
    return padded.map((c) => (c ?? "").toString());
  });
}

// Appends one row. Google performs the append server-side, so concurrent
// submissions can't overwrite each other.
export async function appendRow(tab: string, row: string[]): Promise<void> {
  const range = `${tab}!A:${String.fromCharCode(64 + row.length)}`;
  await call(
    `/values/${encodeURIComponent(range)}:append` +
      `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: JSON.stringify({ values: [row] }) },
  );
}

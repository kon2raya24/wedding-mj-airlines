// Talks to the Google Apps Script web app in apps-script/Code.gs.
//
// That script runs inside the couple's own Google account, which is why
// there is no service account, no API key and no domain verification
// anywhere in this project: it reads and writes the spreadsheet as them,
// and sends mail from their Gmail.
//
// Env vars:
//   APPS_SCRIPT_URL    the /exec URL from Deploy ▸ New deployment
//   APPS_SCRIPT_TOKEN  must match SECRET in Code.gs
//
// The URL is world-reachable ("Who has access: Anyone"), so every request
// carries the shared token and the script rejects anything else.
import "server-only";

export type Mail = {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
  replyTo?: string;
};

export function isBackendConfigured(): boolean {
  return !!(process.env.APPS_SCRIPT_URL && process.env.APPS_SCRIPT_TOKEN);
}

type Action =
  | "ping"
  | "guests"
  | "rsvps"
  | "rsvp"
  | "guestbook"
  | "guestbook.add";

export async function callBackend<T>(
  action: Action,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_TOKEN;
  if (!url || !secret) {
    throw new Error("APPS_SCRIPT_URL / APPS_SCRIPT_TOKEN are not set");
  }

  const res = await fetch(url, {
    method: "POST",
    // Apps Script rejects a preflight on application/json, and text/plain
    // is what it expects for a raw JSON body.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...payload, action, secret }),
    // The /exec URL 302s to script.googleusercontent.com.
    redirect: "follow",
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apps Script ${res.status}: ${text.slice(0, 300)}`);
  }

  let json: { ok?: boolean; error?: string } & Record<string, unknown>;
  try {
    json = JSON.parse(text);
  } catch {
    // A Google sign-in page instead of JSON means the deployment's access
    // is not set to "Anyone" — by far the most common misconfiguration.
    throw new Error(
      "Apps Script did not return JSON. Check the web app is deployed with " +
        `"Who has access: Anyone". First bytes: ${text.slice(0, 120)}`,
    );
  }

  if (json.ok === false && json.error) {
    throw new Error(`Apps Script: ${json.error}`);
  }
  return json as T;
}

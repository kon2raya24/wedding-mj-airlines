// Shared plumbing for the browser suites: launch headless Chrome, talk CDP,
// log a guest in, drive REAL input, and report checks.
//
// Why real input matters: `overflow: hidden` keeps a box programmatically
// scrollable per spec, so window.scrollBy() sails straight through a working
// scroll lock. Only synthesized wheel/key events prove a lock holds.
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME =
  process.env.CHROME ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// `port` is accepted but ignored: Chrome picks a free one. Suites used to
// hardcode a port each, and a wedged run from an earlier session kept its
// browsers alive on those same ports — the next run then attached to the
// stale browser and hung for over an hour.
export async function launch({ width = 1440, height = 900 } = {}) {
  const profile = fs.mkdtempSync(join(tmpdir(), "wed-browser-test-"));

  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      // 0 = let the OS assign one; Chrome writes it to DevToolsActivePort.
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      `--window-size=${width},${height}`,
      "--no-first-run",
      "--autoplay-policy=no-user-gesture-required",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  // Nothing in here may throw: this runs from `process.on("exit")` and from
  // close(), and an exception during teardown loses the suite's whole result.
  // Chrome is still flushing its profile when it is killed, so the delete
  // needs retries (it fails with ENOTEMPTY otherwise).
  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    try {
      chrome.kill();
    } catch {
      /* already gone */
    }
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 120 });
    } catch {
      /* a leftover profile in the temp dir is not worth failing a run over */
    }
  };
  // Even on a crash or a Ctrl-C, don't leave a profile directory behind.
  process.on("exit", cleanup);

  let devtoolsPort;
  for (let i = 0; i < 80 && !devtoolsPort; i++) {
    try {
      const line = fs.readFileSync(join(profile, "DevToolsActivePort"), "utf8").split("\n")[0];
      if (line && Number(line) > 0) devtoolsPort = Number(line);
    } catch {
      /* not written yet */
    }
    if (!devtoolsPort) await sleep(150);
  }
  if (!devtoolsPort) {
    cleanup();
    throw new Error("Chrome never reported a DevTools port");
  }

  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      const tabs = await (await fetch(`http://127.0.0.1:${devtoolsPort}/json/list`)).json();
      const page = tabs.find((t) => t.type === "page");
      if (page) wsUrl = page.webSocketDebuggerUrl;
    } catch {
      /* not listening yet */
    }
    if (!wsUrl) await sleep(150);
  }
  if (!wsUrl) {
    cleanup();
    throw new Error(`Chrome exposed no page target on port ${devtoolsPort}`);
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error("CDP socket failed"));
  });

  let nextId = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  const send = (method, params = {}) => {
    const id = ++nextId;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve) => pending.set(id, resolve));
  };

  // Shuts the browser down and removes its profile.
  const close = () => {
    try {
      ws.close();
    } catch {
      /* already closed */
    }
    cleanup();
  };

  return { chrome, ws, send, close, ...helpers(send) };
}

function helpers(send) {
  const evalJs = async (expression) => {
    const res = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.result?.exceptionDetails) {
      return `EVAL_ERROR: ${res.result.exceptionDetails.text}`;
    }
    return res.result?.result?.value;
  };

  const scrollY = () => evalJs("Math.round(window.scrollY)");

  return {
    evalJs,
    scrollY,

    // `html` sets scroll-behavior: smooth, so a focus() or an anchor jump
    // starts an animated scroll that keeps running for a while. Measuring
    // across one of those reads as "the page moved" when nothing moved it.
    async settle(timeout = 8000) {
      const deadline = Date.now() + timeout;
      let previous = -1;
      let current = await scrollY();
      while (current !== previous && Date.now() < deadline) {
        previous = current;
        await sleep(500);
        current = await scrollY();
      }
      return current;
    },

    // Space and Enter activate whatever control has focus, so anything using
    // them as scroll keys has to park focus first or it will click a button.
    blur: () => evalJs("document.activeElement?.blur?.(); 1"),

    async screenshot(dir, name) {
      const res = await send("Page.captureScreenshot", { format: "png" });
      if (!res.result) return false;
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(`${dir}/${name}.png`, Buffer.from(res.result.data, "base64"));
      return true;
    },

    // A guest's actual gestures. `x`/`y` choose what the wheel is over.
    async wheel({ x = 500, y = 450, notches = 4, delta = 400 } = {}) {
      for (let i = 0; i < notches; i++) {
        await send("Input.dispatchMouseEvent", {
          type: "mouseWheel", x, y, deltaX: 0, deltaY: delta,
        });
        await sleep(120);
      }
      await sleep(700);
    },

    async press(key, code, virtualKey, modifiers = 0) {
      for (const type of ["keyDown", "keyUp"]) {
        await send("Input.dispatchKeyEvent", {
          type, key, code, windowsVirtualKeyCode: virtualKey, modifiers,
        });
      }
      await sleep(260);
    },

    // Poll for a condition instead of sleeping a guessed number of ms.
    // Deployed timings are nothing like local ones — check-in round-trips to
    // the Apps Script guest list in production, which pushed the success
    // overlay from ~0.5s to ~2s and made fixed sleeps report false failures.
    async waitFor(expression, { timeout = 20000, every = 150, label = "condition" } = {}) {
      const deadline = Date.now() + timeout;
      while (Date.now() < deadline) {
        if (await evalJs(`!!(${expression})`)) return true;
        await sleep(every);
      }
      console.log(`  (waitFor timed out after ${timeout}ms: ${label})`);
      return false;
    },

    // Some animation is disabled under prefers-reduced-motion by design, and
    // this machine has it on system-wide — turn it off to see the motion.
    fullMotion: () =>
      send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
      }),
  };
}

// Two ways in. A forged cookie is fast but only valid where SESSION_SECRET is
// known, so anything pointed at a deployed site must drive the real form.
export async function signIn({ send, evalJs, base, secret, formLogin }) {
  const host = new URL(base).hostname;
  await send("Network.enable");

  if (formLogin) {
    // `?open=1` is the check-in page without the invitation window over it —
    // a form login should not be typing behind a closed cover.
    await send("Page.navigate", { url: `${base}/login?open=1` });
    await sleep(6000);
    await evalJs(`(() => {
      const set = (el, v) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      };
      set(document.querySelector('input[name="firstName"]'), ${JSON.stringify(GUEST.firstName)});
      set(document.querySelector('input[name="lastName"]'), ${JSON.stringify(GUEST.lastName)});
      const code = document.querySelector('input[name="code"]');
      set(code, "JM1126");
      code.closest("form").requestSubmit();
    })()`);
    await sleep(9000);
  } else {
    await send("Network.setCookie", {
      name: "mj_pass", value: forgeSession(secret), domain: host, path: "/",
    });
  }
}

// `Test` / `Guest` exists only when NODE_ENV !== production (lib/guests.ts),
// so a deployed site needs a real representative from lib/guest-list.json.
const GUEST = { firstName: "Mary Lhen", lastName: "Afurong" };

function forgeSession(secret) {
  const payload = JSON.stringify({
    code: "JM1126",
    firstName: "Test",
    lastName: "Guest",
    seatsReserved: 2,
    companions: ["Plus One"],
    ts: Date.now(),
  });
  const raw = Buffer.from(payload, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const sig = crypto.createHmac("sha256", secret).update(`session.${raw}`).digest("hex");
  return `${raw}.${sig}`;
}

export function reporter(name) {
  const passed = [];
  const failed = [];
  return {
    check(ok, label, detail = "") {
      (ok ? passed : failed).push(`${label}${detail ? ` — ${detail}` : ""}`);
    },
    finish() {
      console.log(`\n=== ${name} ===`);
      passed.forEach((p) => console.log(`  ✓ ${p}`));
      failed.forEach((f) => console.log(`  ✗ ${f}`));
      console.log(`\n${passed.length} passed, ${failed.length} failed`);
      return failed.length;
    },
  };
}

export const config = {
  base: process.env.BASE || "http://localhost:3001",
  secret: process.env.SECRET || "devsecretdevsecret1234",
  formLogin: !!process.env.FORM_LOGIN,
};

// Checking in no longer redirects from the server — it hands the destination
// back so the client can fly the plane first. That makes the client
// responsible for actually getting the guest to the site, so: the animation
// plays, it always lands, and a wrong code still fails cleanly.
import { launch, reporter, config, sleep } from "../harness.mjs";

const { close, send, evalJs, fullMotion, screenshot, waitFor } = await launch();
const { check, finish } = reporter("takeoff");
const SHOTS = process.env.SHOTS;
const host = new URL(config.base).hostname;

// The real form, without the invitation window over it.
const FORM = `${config.base}/login?open=1`;
const fill = (first, last, code) => evalJs(`(() => {
  const set = (el, v) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  set(document.querySelector('input[name="firstName"]'), ${JSON.stringify(first)});
  set(document.querySelector('input[name="lastName"]'), ${JSON.stringify(last)});
  const code = document.querySelector('input[name="code"]');
  set(code, ${JSON.stringify(code)});
  code.closest("form").requestSubmit();
})()`);
const clearSession = () => send("Network.deleteCookies", { name: "mj_pass", domain: host, path: "/" });

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await fullMotion();

// The real guest on a deployed site; the dev stand-in locally (lib/guests.ts
// drops it in production).
const GUEST = process.env.FORM_LOGIN
  ? { first: "Mary Lhen", last: "Afurong" }
  : { first: "Test", last: "Guest" };

// ---- 1. A wrong code must still fail in place, with nothing flying.
await clearSession();
await send("Page.navigate", { url: FORM });
await sleep(9000);
await fill(GUEST.first, GUEST.last, "WRONGCODE");
await waitFor("/We couldn/.test(document.body.innerText)", { label: "rejection message" });
const rejected = await evalJs(`(() => ({
  takeoff: !!document.querySelector('.takeoff'),
  path: location.pathname,
  error: (document.body.innerText.match(/We couldn.{0,60}/) || [""])[0],
}))()`);
console.log("wrong code:", JSON.stringify(rejected));
check(rejected.takeoff === false, "a wrong code does not start the takeoff");
check(/^\/login/.test(rejected.path), "and stays on the check-in page", `path=${rejected.path}`);
check(rejected.error.length > 0, "and says why", `"${rejected.error.slice(0, 40)}…"`);

// ---- 2. A good code plays the takeoff, then lands on the site.
await clearSession();
await send("Page.navigate", { url: FORM });
await sleep(9000);
await fill(GUEST.first, GUEST.last, "JM1126");
check(await waitFor("document.querySelector('.takeoff')", { label: "takeoff overlay" }),
  "the takeoff overlay appears on success");
const flying = await evalJs(`(() => {
  const plane = document.querySelector('.takeoff-plane');
  const overlay = document.querySelector('.takeoff');
  return {
    overlay: !!overlay,
    role: overlay ? overlay.getAttribute('role') : null,
    greeting: overlay ? overlay.innerText.replace(/\\s+/g, ' ').trim() : null,
    plane: !!plane,
    animation: plane ? getComputedStyle(plane).animationName : null,
    continueHref: document.querySelector('.takeoff-continue')?.getAttribute('href') ?? null,
  };
})()`);
console.log("in flight:", JSON.stringify(flying));
check(flying.role === "status", "it is announced (role=status)", `role=${flying.role}`);
check(/CHECKED IN/i.test(flying.greeting || ""), "it says the guest is checked in");
check(new RegExp(GUEST.first, "i").test(flying.greeting || ""), "and greets them by name", `"${flying.greeting}"`);
check(flying.plane === true && flying.animation === "takeoff-fly", "the plane is flying", `animation=${flying.animation}`);
check(flying.continueHref === "/", "a Continue link is there in case the timer cannot navigate", `href=${flying.continueHref}`);
if (SHOTS) await screenshot(SHOTS, "takeoff-inflight");

// It must actually arrive, without any further input.
check(await waitFor("location.pathname === '/'", { timeout: 25000, label: "navigation to /" }),
  "it navigates to the site on its own");
await sleep(600);
const landed = await evalJs(`(() => ({
  path: location.pathname,
  hero: !!document.querySelector('#top'),
  overlay: !!document.querySelector('.takeoff'),
}))()`);
console.log("landed:", JSON.stringify(landed));
check(landed.hero === true, "the hero is there");
check(landed.overlay === false, "and the overlay is gone");
if (SHOTS) await screenshot(SHOTS, "takeoff-landed");

// ---- 3. Reduced motion: no flight, but it must still arrive.
await clearSession();
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.navigate", { url: FORM });
await sleep(9000);
await fill(GUEST.first, GUEST.last, "JM1126");
check(await waitFor("location.pathname === '/'", { timeout: 25000, label: "reduced-motion navigation" }),
  "reduced motion: check-in still reaches the site");
await sleep(600);
const reduced = await evalJs(`(() => ({ path: location.pathname, hero: !!document.querySelector('#top') }))()`);
console.log("reduced motion:", JSON.stringify(reduced));
check(reduced.hero === true, "reduced motion: on the hero");
await fullMotion();

close();
process.exit(finish() ? 1 : 0);

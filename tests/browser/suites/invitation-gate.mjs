// The invitation gate sits in front of /login: a closed window that opens on
// a click and leaves the guest on the real check-in form. It must never
// stand between a guest and the form — including with no JavaScript at all.
import { launch, signIn, reporter, config, sleep } from "../harness.mjs";

const { close, send, evalJs, fullMotion, screenshot, press } = await launch();
const { check, finish } = reporter("invitation gate");
const SHOTS = process.env.SHOTS;
const host = new URL(config.base).hostname;

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await fullMotion();

const gate = () => evalJs(`(() => {
  const el = document.querySelector('.porthole-intro');
  const link = document.querySelector('a.porthole-open');
  return {
    present: !!el,
    open: el ? el.hasAttribute('data-open') : null,
    zooming: el ? el.hasAttribute('data-zoom') : null,
    href: link ? link.getAttribute('href') : null,
    label: link ? link.getAttribute('aria-label') : null,
    locked: /scroll-locked/.test(document.documentElement.className),
    formPresent: !!document.querySelector('input[name="code"]'),
  };
})()`);

// ---- 1. Arriving at the link: the window is shut, server-rendered.
await send("Page.navigate", { url: `${config.base}/login` });
await sleep(9000);
const sealed = await gate();
console.log("on arrival:", JSON.stringify(sealed));
check(sealed.present === true, "the window covers the check-in page on arrival");
check(sealed.open === false, "and it starts shut");
check(sealed.locked === true, "the page is held while it is shut");
check(sealed.formPresent === true, "the form is already behind it (no second load to open)");
check(/^\/login\?open=1/.test(sealed.href || ""), "the window is a real link, for guests without JS", `href=${sealed.href}`);
check(/^Open your invitation from /.test(sealed.label || ""), "and it is labelled", `label="${sealed.label}"`);
if (SHOTS) await screenshot(SHOTS, "gate-1-sealed");

// ---- 2. Clicking it opens the window, then pushes through to the form.
const box = await evalJs(`(() => {
  const r = document.querySelector('a.porthole-open').getBoundingClientRect();
  return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
})()`);
for (const type of ["mousePressed", "mouseReleased"]) {
  await send("Input.dispatchMouseEvent", { type, x: box.x, y: box.y, button: "left", clickCount: 1 });
}
await sleep(500);
const opening = await gate();
check(opening.present === true && opening.open === true, "clicking lifts the shade", `open=${opening.open}`);
check(await evalJs("location.search === ''"), "and does not navigate — the form was always there", `search=${await evalJs("location.search")}`);
if (SHOTS) await screenshot(SHOTS, "gate-2-opening");

await sleep(900);
check((await gate()).zooming === true, "then the frame pushes past the camera");
if (SHOTS) await screenshot(SHOTS, "gate-3-zooming");

await sleep(1800);
const after = await gate();
console.log("after opening:", JSON.stringify(after));
check(after.present === false, "the cover unmounts");
check(after.locked === false, "the page is released");
check(after.formPresent === true, "and the guest is on the check-in form");
check(await evalJs(`document.documentElement.className.indexOf('porthole-') === -1`), "no porthole classes are left on <html>");
if (SHOTS) await screenshot(SHOTS, "gate-4-form");

// ---- 3. It greets every fresh arrival: this page is only reached while a
// guest is signed out, so there is nothing to remember.
await send("Page.navigate", { url: `${config.base}/login` });
await sleep(6000);
check((await gate()).present === true, "a fresh arrival is greeted by the window again");

// ---- 4. The no-JS fallback: the href alone reaches the form.
await send("Emulation.setScriptExecutionDisabled", { value: true });
await send("Page.navigate", { url: `${config.base}/login` });
await sleep(3000);
const noJs = await evalJs(`!!document.querySelector('.porthole-intro')`);
await send("Page.navigate", { url: `${config.base}/login?open=1` });
await sleep(3000);
const viaHref = await evalJs(`(() => ({
  cover: !!document.querySelector('.porthole-intro'),
  form: !!document.querySelector('input[name="code"]'),
  locked: /scroll-locked/.test(document.documentElement.className),
}))()`);
await send("Emulation.setScriptExecutionDisabled", { value: false });
console.log("no-JS:", JSON.stringify({ sealedWithoutJs: noJs, viaHref }));
check(noJs === true, "no-JS: the window is still rendered (it is server-side)");
check(viaHref.cover === false, "no-JS: following the window's href drops the cover");
check(viaHref.form === true, "no-JS: and lands on the check-in form");
check(viaHref.locked === false, "no-JS: nothing was ever locked");

// ---- 5. Keyboard: it is a link, so Enter must open it.
await send("Page.navigate", { url: `${config.base}/login` });
await sleep(7000);
await evalJs(`document.querySelector('a.porthole-open').focus()`);
check(await evalJs(`document.activeElement === document.querySelector('a.porthole-open')`), "the window takes keyboard focus");
await press("Enter", "Enter", 13);
await sleep(700);
check((await gate()).open === true, "Enter opens it");

// ---- 6. Reduced motion: the click must still open it, just without the
// choreography. This is the path anyone with "Reduce motion" on will get.
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.navigate", { url: `${config.base}/login` });
await sleep(7000);
const reducedSealed = await gate();
check(reducedSealed.present === true, "reduced motion: the window is still shown");
await evalJs(`document.querySelector('a.porthole-open').click()`);
await sleep(700);
const reducedOpen = await gate();
console.log("reduced motion after click:", JSON.stringify(reducedOpen));
check(reducedOpen.present === false, "reduced motion: one click goes straight to the form");
check(reducedOpen.locked === false, "reduced motion: nothing stays locked");
await fullMotion();

// ---- 7. The gate belongs to /login only — the site itself must not cover.
await signIn({ send, evalJs, ...config });
await send("Page.navigate", { url: `${config.base}/` });
await sleep(9000);
const site = await evalJs(`(() => ({
  cover: !!document.querySelector('.porthole-intro'),
  locked: /scroll-locked/.test(document.documentElement.className),
  hero: !!document.querySelector('#top'),
}))()`);
console.log("site after login:", JSON.stringify(site));
check(site.cover === false, "the site itself no longer shows a window cover");
check(site.locked === false, "and is not locked");
check(site.hero === true, "the hero is there instead");

close();
process.exit(finish() ? 1 : 0);

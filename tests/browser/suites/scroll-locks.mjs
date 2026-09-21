// Every overlay that claims to hold the page must actually hold it, against
// real wheel and key input — the lightbox, the mobile drawer and the film.
import { launch, signIn, reporter, config, sleep } from "../harness.mjs";

// Narrow enough that the xl:hidden hamburger is the nav.
const { close, send, evalJs, scrollY, wheel, press, settle, blur } = await launch({ width: 1000, height: 820 });
const { check, finish } = reporter("scroll locks");

const locked = () => evalJs("/scroll-locked/.test(document.documentElement.className)");
async function tryScroll(at = { x: 500, y: 700 }) {
  // Park focus so Space cannot activate a control, and let any in-flight
  // smooth scroll finish, or the "before" reading is already stale.
  await blur();
  await settle();
  const before = await scrollY();
  await wheel(at);
  await press("PageDown", "PageDown", 34);
  await press(" ", "Space", 32);
  await sleep(600);
  return (await scrollY()) - before;
}

await send("Page.enable");
await send("Runtime.enable");
await signIn({ send, evalJs, ...config });
await send("Page.navigate", { url: `${config.base}/` });
await sleep(12000);

await evalJs(`window.scrollTo({ top: 600, behavior: "instant" })`);
await sleep(700);
check((await tryScroll()) !== 0, "baseline: real input scrolls when nothing holds the page");

// ---- Postcard lightbox
await evalJs(`document.querySelector('#gallery button[aria-label^="Open postcard"]').scrollIntoView({ block: "center", behavior: "instant" })`);
await sleep(1000);
await evalJs(`document.querySelector('#gallery button[aria-label^="Open postcard"]').click()`);
await sleep(900);
check(await evalJs(`!!document.querySelector('[role="dialog"][aria-modal="true"]')`), "lightbox opens");
check((await locked()) === true, "lightbox takes the lock");
check((await evalJs("document.body.style.overflow")) === "", "and leaves no inline overflow on <body>");
check((await tryScroll()) === 0, "the page does NOT move behind the lightbox");
await evalJs(`document.querySelector('[role="dialog"] button[aria-label="Close"]').click()`);
await sleep(800);
check((await locked()) === false, "lightbox releases the lock");
check((await tryScroll()) !== 0, "scrolling resumes after it closes");

// ---- Mobile nav drawer
await evalJs(`document.querySelector('button[aria-label="Toggle menu"]').click()`);
await sleep(900);
const drawer = await evalJs(`(() => {
  const menu = document.getElementById('mobile-menu');
  return {
    expanded: document.querySelector('button[aria-label="Toggle menu"]').getAttribute('aria-expanded'),
    bottom: menu ? Math.round(menu.getBoundingClientRect().bottom) : null,
    vh: window.innerHeight,
  };
})()`);
check(drawer.expanded === "true", "drawer reports expanded");
check((await locked()) === true, "drawer takes the lock");
// Aim below the drawer so the page, not the drawer's own scroller, is the target.
check((await tryScroll({ x: 500, y: Math.min(drawer.vh - 20, (drawer.bottom ?? 0) + 60) })) === 0,
  "the page does NOT move behind the open drawer");
await press("Escape", "Escape", 27);
await sleep(500);
check((await evalJs(`document.querySelector('button[aria-label="Toggle menu"]').getAttribute('aria-expanded')`)) === "false",
  "Escape closes the drawer");
check((await locked()) === false, "drawer releases the lock");

// ---- Watch the film
await evalJs(`window.scrollTo({ top: 0, behavior: "instant" })`);
await sleep(800);
await evalJs(`(() => { const b = document.getElementById('prenup'); b.scrollIntoView({ block: "center", behavior: "instant" }); b.click(); })()`);
await sleep(1500);
check((await locked()) === true, "film modal takes the lock");
check((await tryScroll()) === 0, "the page does NOT move behind the film");
await press("Escape", "Escape", 27);
await sleep(600);
check((await locked()) === false, "film releases the lock");
check((await tryScroll()) !== 0, "scrolling resumes after it closes");

close();
process.exit(finish() ? 1 : 0);

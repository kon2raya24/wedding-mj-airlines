// The flight-log map's stops are real links to their legs.
import { launch, signIn, reporter, config, sleep } from "../harness.mjs";

const { close, send, evalJs } = await launch();
const { check, finish } = reporter("flight-log map");

await send("Page.enable");
await send("Runtime.enable");
await signIn({ send, evalJs, ...config });
await send("Page.navigate", { url: `${config.base}/` });
await sleep(12000);

const links = await evalJs(`(() => {
  const stops = [...document.querySelectorAll('a.route-stop')];
  return {
    count: stops.length,
    hrefs: stops.map((el) => el.getAttribute('href')),
    labels: stops.map((el) => el.getAttribute('aria-label')),
    targetsResolve: stops.map((el) => !!document.querySelector(el.getAttribute('href'))),
    svgAriaHidden: stops[0]?.closest('svg')?.getAttribute('aria-hidden') ?? null,
  };
})()`);
console.log("stops:", JSON.stringify(links.hrefs), "\nlabels:", JSON.stringify(links.labels, null, 1));
check(links.count === 5, "all five stops are links", `found ${links.count}`);
check(links.targetsResolve?.every(Boolean) === true, "every href resolves to a leg anchor");
check(links.labels?.every((l) => l?.startsWith("Leg ")) === true, "every stop carries a Leg label");
check(links.svgAriaHidden === null, "the map is no longer aria-hidden now that it holds links");

const focusable = await evalJs(`(() => {
  const el = document.querySelectorAll('a.route-stop')[2];
  el.focus();
  return document.activeElement === el || document.activeElement?.closest?.('a.route-stop') === el;
})()`);
check(focusable === true, "a stop can be focused from the keyboard");

const href = await evalJs(`(() => {
  document.documentElement.classList.remove('lenis', 'lenis-smooth');
  const el = document.querySelectorAll('a.route-stop')[3];
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  return el.getAttribute('href');
})()`);
await sleep(1500);
const landed = await evalJs(`(() => {
  const target = document.querySelector('${href}');
  return { hash: location.hash, top: Math.round(target.getBoundingClientRect().top) };
})()`);
check(landed.hash === href, "clicking a stop sets its leg hash", `hash=${landed.hash}`);
check(Math.abs(landed.top) < 400, "and scrolls that leg into view", `top=${landed.top}px`);

close();
process.exit(finish() ? 1 : 0);

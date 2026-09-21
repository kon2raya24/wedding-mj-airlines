// The postcard lightbox: focus containment, focus return, keys and swipe.
import { launch, signIn, reporter, config, sleep } from "../harness.mjs";

const { close, send, evalJs, press } = await launch();
const { check, finish } = reporter("lightbox");

const focusLabel = () => evalJs("document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName");
const caption = () => evalJs(`document.querySelector('[role="dialog"] figcaption')?.innerText.replace(/\\s+/g, ' ').trim() || 'closed'`);

// Synthesizes a horizontal flick on the postcard.
const flick = (fromEdge, toOffset) => evalJs(`(() => {
  const fig = document.querySelector('[role="dialog"] figure');
  const r = fig.getBoundingClientRect();
  const y = Math.round(r.top + r.height / 2);
  const touch = (x) => new Touch({ identifier: 1, target: fig, clientX: x, clientY: y });
  const evt = (type, x) => new TouchEvent(type, {
    bubbles: true, cancelable: true,
    touches: type === 'touchend' ? [] : [touch(x)],
    changedTouches: [touch(x)],
  });
  fig.dispatchEvent(evt('touchstart', Math.round(r.${fromEdge})));
  fig.dispatchEvent(evt('touchend', Math.round(r.${fromEdge} ${toOffset})));
})()`);

await send("Page.enable");
await send("Runtime.enable");
await signIn({ send, evalJs, ...config });
await send("Page.navigate", { url: `${config.base}/` });
await sleep(12000);

await evalJs(`document.querySelector('#gallery button[aria-label^="Open postcard"]').scrollIntoView({ block: "center", behavior: "instant" })`);
await sleep(1000);
const trigger = await evalJs(`(() => {
  const b = document.querySelector('#gallery button[aria-label^="Open postcard"]');
  b.focus();
  b.click();
  return b.getAttribute('aria-label');
})()`);
await sleep(900);
check(await evalJs(`!!document.querySelector('[role="dialog"]')`), "opens");
check((await focusLabel()) === "Close", "focus moves into the dialog", `focus=${await focusLabel()}`);

// aria-modal promises focus cannot leave — so it must not.
const visited = [];
for (let i = 0; i < 5; i++) {
  await press("Tab", "Tab", 9);
  visited.push(await focusLabel());
}
console.log("Tab order:", visited.join(" -> "));
check(await evalJs(`document.querySelector('[role="dialog"]').contains(document.activeElement)`),
  "Tab never escapes the dialog", `ended on ${visited.at(-1)}`);
check(visited.every((l) => ["Previous postcard", "Next postcard", "Close"].includes(l)),
  "Tab only visits the dialog's own controls");
for (let i = 0; i < 4; i++) await press("Tab", "Tab", 9, 8);
check(await evalJs(`document.querySelector('[role="dialog"]').contains(document.activeElement)`),
  "Shift+Tab never escapes either", `focus=${await focusLabel()}`);

const first = await caption();
await press("ArrowRight", "ArrowRight", 39);
const second = await caption();
check(second !== first, "ArrowRight steps forward", `${first.slice(0, 12)} -> ${second.slice(0, 12)}`);
await press("ArrowLeft", "ArrowLeft", 37);
check((await caption()) === first, "ArrowLeft steps back");

await flick("right - 40", "- 160");
await sleep(600);
check((await caption()) !== first, "a horizontal flick steps forward");

const beforeTap = await caption();
await flick("left + r.width / 2", "+ 0");
await sleep(500);
check((await caption()) === beforeTap, "a tap does not step");

await press("Escape", "Escape", 27);
await sleep(700);
check((await evalJs(`!!document.querySelector('[role="dialog"]')`)) === false, "Escape closes");
check((await focusLabel()) === trigger, "focus returns to the postcard that opened it", `focus=${await focusLabel()}`);

close();
process.exit(finish() ? 1 : 0);

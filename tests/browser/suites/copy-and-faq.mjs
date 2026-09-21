// Copy buttons really write to the clipboard, and a collapsed FAQ answer is
// really gone from the accessibility tree — not merely hidden by CSS.
import { launch, signIn, reporter, config, sleep } from "../harness.mjs";

const { close, send, evalJs } = await launch();
const { check, finish } = reporter("copy + FAQ a11y");

await send("Page.enable");
await send("Runtime.enable");
await send("Accessibility.enable");
await send("Browser.grantPermissions", {
  origin: new URL(config.base).origin,
  permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
});
await signIn({ send, evalJs, ...config });
await send("Page.navigate", { url: `${config.base}/` });
await sleep(12000);

const buttons = await evalJs(`(() => {
  const b = [...document.querySelectorAll('button[aria-label^="Copy "]')];
  return { count: b.length, labels: b.map((x) => x.getAttribute('aria-label')) };
})()`);
console.log("copy buttons:", JSON.stringify(buttons.labels));
check(buttons.count >= 2, "copy buttons render", `${buttons.count}`);
check(new Set(buttons.labels).size === buttons.count, "each has a distinct accessible name", JSON.stringify(buttons.labels));

// Clipboard *read* needs a focused document, which headless does not always
// grant, so also record what the component hands to writeText.
await send("Page.bringToFront");
await evalJs(`(() => {
  window.__copied = [];
  const real = navigator.clipboard.writeText.bind(navigator.clipboard);
  navigator.clipboard.writeText = (text) => { window.__copied.push(text); return real(text); };
  window.focus();
})()`);

async function clickCopy(label) {
  await evalJs(`(() => {
    const b = document.querySelector('button[aria-label="${label}"]');
    b.scrollIntoView({ block: "center", behavior: "instant" });
    b.click();
  })()`);
  await sleep(600);
  return evalJs(`(() => {
    const b = document.querySelector('button[aria-label="${label}"]');
    return {
      // innerText would include the sr-only live region and CSS uppercasing.
      shown: (b.querySelector('span[aria-hidden="true"]')?.textContent || "").trim(),
      status: (b.querySelector('[role="status"]')?.textContent || "").trim(),
      handed: window.__copied.at(-1) ?? null,
    };
  })()`);
}

const addressLabel = buttons.labels.find((l) => /address$/.test(l));
const addr = await clickCopy(addressLabel);
console.log("address copy:", JSON.stringify(addr));
check(typeof addr.handed === "string" && addr.handed.length > 20, "the address is written to the clipboard", `"${String(addr.handed).slice(0, 40)}…"`);
check(addr.shown.toLowerCase() === "copied", "the button confirms visually", `label="${addr.shown}"`);
check(/copied/i.test(addr.status), "and announces it politely", `status="${addr.status}"`);

const readBack = await evalJs(`(async () => {
  try { return await navigator.clipboard.readText(); } catch (e) { return "READ_BLOCKED:" + e.name; }
})()`);
if (String(readBack).startsWith("READ_BLOCKED")) {
  console.log(`  (clipboard read-back unavailable here: ${readBack} — the writeText assertion stands)`);
} else {
  check(String(readBack) === addr.handed, "clipboard read-back matches exactly");
}

const hash = await clickCopy("Copy hashtag");
check(hash.handed === "#JM1126", "the hashtag is written to the clipboard", `"${hash.handed}"`);
await sleep(2400);
const reset = await evalJs(`document.querySelector('button[aria-label="Copy hashtag"] span[aria-hidden="true"]').textContent.trim()`);
check(String(reset).toLowerCase() === "copy", "the label resets rather than reading Copied forever", `label="${reset}"`);

// ---- FAQ
const faq = await evalJs(`(() => {
  const btns = [...document.querySelectorAll('#faq button[aria-controls^="faq-answer-"]')];
  return {
    count: btns.length,
    resolve: btns.every((b) => !!document.getElementById(b.getAttribute('aria-controls'))),
    expanded: btns.map((b) => b.getAttribute('aria-expanded')),
    inert: btns.map((b) => document.getElementById(b.getAttribute('aria-controls')).inert),
  };
})()`);
console.log("faq:", JSON.stringify(faq));
check(faq.count > 1, "faq items found", `${faq.count}`);
check(faq.resolve === true, "every aria-controls resolves to its panel");
check(faq.expanded.every((e, i) => (e === "true") === (faq.inert[i] === false)),
  "inert mirrors aria-expanded exactly", `expanded=${faq.expanded} inert=${faq.inert}`);

const answers = await evalJs(`(() => {
  const btns = [...document.querySelectorAll('#faq button[aria-controls^="faq-answer-"]')];
  const text = (b) => document.getElementById(b.getAttribute('aria-controls')).innerText.trim().slice(0, 40);
  const closed = btns.find((b) => b.getAttribute('aria-expanded') === 'false');
  const open = btns.find((b) => b.getAttribute('aria-expanded') === 'true');
  return { closed: closed ? text(closed) : null, open: open ? text(open) : null };
})()`);
const axNodes = (await send("Accessibility.getFullAXTree")).result?.nodes || [];
const axText = axNodes.map((n) => n.name?.value || "").join("  ");
check(!!answers.open && axText.includes(answers.open), "the OPEN answer is in the accessibility tree");
check(!!answers.closed && !axText.includes(answers.closed), "a COLLAPSED answer is NOT in the accessibility tree");

close();
process.exit(finish() ? 1 : 0);

// RSVP is where a silent failure costs the couple real data: a failed
// submission must be announced, and a fast double-click must send one POST.
//
// The endpoint is stubbed in the page, so this never writes to the real store.
import { launch, signIn, reporter, config, sleep } from "../harness.mjs";

const { close, send, evalJs, waitFor } = await launch();
const { check, finish } = reporter("RSVP");

await send("Page.enable");
await send("Runtime.enable");
await send("Accessibility.enable");
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `
    window.__posts = 0;
    window.__forceFail = false;
    window.__slow = 0;
    const real = window.fetch;
    window.fetch = async (input, init) => {
      const url = typeof input === "string" ? input : (input && input.url) || "";
      const method = ((init && init.method) || "GET").toUpperCase();
      if (url.includes("/api/rsvp")) {
        if (method === "POST") {
          window.__posts++;
          try { window.__lastBody = JSON.parse(init.body); } catch { window.__lastBody = null; }
          if (window.__slow) await new Promise((r) => setTimeout(r, window.__slow));
          const body = window.__forceFail
            ? [JSON.stringify({ error: "Simulated server failure" }), 500]
            : [JSON.stringify({ ok: true }), 200];
          return new Response(body[0], { status: body[1], headers: { "Content-Type": "application/json" } });
        }
        // Report "nothing on file" so the form is what is on screen.
        return new Response(JSON.stringify({ rsvp: null }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      return real(input, init);
    };
  `,
});
await signIn({ send, evalJs, ...config });
await send("Page.navigate", { url: `${config.base}/` });
await sleep(12000);

await evalJs(`document.documentElement.classList.remove('lenis', 'lenis-smooth')`);
const button = await evalJs(`(() => {
  const section = document.querySelector('#rsvp');
  section.scrollIntoView({ block: "center", behavior: "instant" });
  return section.querySelector('button[type="submit"]')?.innerText.trim() ?? "none";
})()`);
check(/confirm/i.test(button), "the RSVP form is on screen", `button="${button}"`);
await sleep(600);

// The live region must exist before there is anything to say: some screen
// readers miss an alert inserted together with its text.
const pre = await evalJs(`(() => {
  const el = document.querySelector('#rsvp p[role="alert"]');
  return { present: !!el, text: el ? el.textContent.trim() : null };
})()`);
check(pre.present === true, "the alert live region is pre-rendered");
check(pre.text === "", "and starts empty", `text="${pre.text}"`);

// ---- A forced server failure must be announced, not swallowed.
await evalJs("window.__forceFail = true");
const before = await evalJs("window.__posts");
await evalJs(`document.querySelector('#rsvp button[type="submit"]').click()`);
await sleep(1800);
const failed = await evalJs(`(() => ({
  text: document.querySelector('#rsvp p[role="alert"]').textContent.trim(),
  posts: window.__posts,
  enabled: !document.querySelector('#rsvp button[type="submit"]').disabled,
}))()`);
console.log("after forced failure:", JSON.stringify(failed));
check(failed.posts === before + 1, "one POST was attempted", `${before} -> ${failed.posts}`);
check(failed.text.length > 0, "the failure message is rendered", `"${failed.text}"`);
check(failed.enabled === true, "the button re-enables so the guest can retry");

// role=alert takes no name from contents, so walk its subtree for the text.
const nodes = (await send("Accessibility.getFullAXTree")).result?.nodes || [];
const byId = new Map(nodes.map((n) => [n.nodeId, n]));
const subtree = (node, depth = 0) =>
  !node || depth > 6
    ? ""
    : [node.name?.value || "", ...(node.childIds || []).map((c) => subtree(byId.get(c), depth + 1))].join(" ");
const alerts = nodes.filter((n) => n.role?.value === "alert").map((n) => subtree(n).replace(/\s+/g, " ").trim());
console.log("alert subtrees:", JSON.stringify(alerts.filter(Boolean)));
check(alerts.length >= 1, "an alert role exists in the accessibility tree");
check(alerts.some((t) => t.includes(failed.text)), "and it carries the failure message");

// ---- A fast triple-click must still send exactly one POST.
await evalJs("window.__forceFail = false; window.__slow = 1200;");
const before2 = await evalJs("window.__posts");
await evalJs(`(() => {
  const b = document.querySelector('#rsvp button[type="submit"]');
  b.click(); b.click(); b.click();
})()`);
await sleep(2600);
const after2 = await evalJs("window.__posts");
check(after2 === before2 + 1, "three rapid clicks send exactly one POST", `sent ${after2 - before2}`);
check(await evalJs(`/CONFIRMED/i.test(document.querySelector('#rsvp')?.innerText || "")`),
  "the success state is shown once accepted");

// ---- 3. A representative who cannot come must not cancel their party.
await send("Page.navigate", { url: `${config.base}/` });
await sleep(12000);
await evalJs(`document.documentElement.classList.remove('lenis', 'lenis-smooth')`);
await evalJs(`document.querySelector('#rsvp').scrollIntoView({ block: "center", behavior: "instant" })`);
await sleep(800);

const seatLine = () => evalJs(`(() => {
  // No backslash escapes: this regex travels inside a template literal, and
  // \d / \s get eaten on the way through.
  const m = (document.querySelector('#rsvp')?.innerText || "").match(/([0-9]+) of ([0-9]+) reserved seat/);
  return m ? { boarding: Number(m[1]), reserved: Number(m[2]) } : null;
})()`);
const setAttending = (value) => evalJs(`document.querySelector('#rsvp input[name="attending"][value="${value}"]').click()`);

check(await evalJs(`!!document.querySelector('#rsvp [role="group"][aria-label$="boarding"]')`),
  "the companion list is shown while boarding");
const yesSeats = await seatLine();
console.log("boarding:", JSON.stringify(yesSeats));
check(yesSeats !== null && yesSeats.boarding === yesSeats.reserved,
  "every reserved seat starts out boarding", JSON.stringify(yesSeats));

// Decline for the representative only.
await setAttending("no");
await sleep(600);
const declined = await evalJs(`(() => {
  const section = document.querySelector('#rsvp');
  return {
    companionsStillListed: !!section.querySelector('[role="group"][aria-label$="boarding"]'),
    ownRowSaysNot: /NOT BOARDING/i.test(section.innerText),
  };
})()`);
const declinedSeats = await seatLine();
console.log("representative declined:", JSON.stringify(declined), JSON.stringify(declinedSeats));
check(declined.companionsStillListed === true, "declining keeps the companion list on screen");
check(declined.ownRowSaysNot === true, "the guest's own seat shows Not boarding");
check(declinedSeats !== null && declinedSeats.boarding === yesSeats.reserved - 1,
  "companions stay boarding — only the guest's own seat drops",
  JSON.stringify(declinedSeats));

// And the submission must carry those companions, not an empty list.
await evalJs("window.__forceFail = false; window.__slow = 0;");
const before3 = await evalJs("window.__posts");
await evalJs(`document.querySelector('#rsvp button[type="submit"]').click()`);
check(await waitFor(`window.__posts > ${before3}`, { label: "RSVP submitted" }), "the declined RSVP submits");
const body = await evalJs("window.__lastBody");
console.log("submitted body:", JSON.stringify(body));
check(body !== null && body.attending === "no", "it records the guest as not boarding", `attending=${body && body.attending}`);
check(Array.isArray(body && body.companions) && body.companions.length > 0,
  "and still sends the companions rather than an empty list",
  `companions=${JSON.stringify(body && body.companions)}`);
check(Boolean(body && body.companions && body.companions.some((c) => c.attending === true)),
  "with at least one still marked boarding");

close();
process.exit(finish() ? 1 : 0);

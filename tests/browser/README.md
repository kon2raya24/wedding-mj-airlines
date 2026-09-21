# Browser suites

End-to-end checks driven straight over the Chrome DevTools Protocol — no test
framework, no dependencies beyond a local Chrome. They exist because most of
what they cover cannot be asserted from unit tests: whether a scroll lock
actually holds against a real wheel gesture, whether a collapsed accordion
answer is truly gone from the accessibility tree, whether a triple-click sends
one request.

## Running

```bash
# 1. Point a server at the code you want to test.
SESSION_SECRET=devsecretdevsecret1234 npx next dev -p 3001

# 2. Run everything.
node tests/browser/run.mjs

# One suite (substring match):
node tests/browser/run.mjs rsvp

# Against a deployed site — the real login form is required there, because a
# forged session cookie is only valid where SESSION_SECRET is known.
BASE=https://joseph-loves-jorie.vercel.app FORM_LOGIN=1 SETTLE=4000 \
  node tests/browser/run.mjs
```

`SHOTS=/tmp/shots` saves screenshots from the suites that offer them.

## Suites

| Suite | Covers |
| --- | --- |
| `invitation-gate` | The closed window in front of `/login` opens on click and on Enter, remembers being opened, and never blocks a guest without JavaScript |
| `flight-log-map` | The five map stops are labelled links that resolve to their leg and scroll to it |
| `scroll-locks` | Lightbox, mobile drawer and film modal all hold the page against real wheel + PageDown + Space |
| `lightbox` | Focus containment (`aria-modal`), focus return to the trigger, arrow keys, swipe vs. tap |
| `copy-and-faq` | Copy buttons write the right text and announce it; collapsed FAQ answers leave the accessibility tree |
| `takeoff` | The paper-plane takeoff on a successful check-in: it plays, it announces, it always lands on the site, and a wrong code still fails in place |
| `rsvp` | A failed submission is announced via `role="alert"`; three rapid clicks send exactly one POST |

The RSVP suite stubs `/api/rsvp` inside the page, so it never writes to the
real RSVP store.

## Assertions that look right and are not

Hard-won; see also the `browser-verification-gotchas` note.

- **`window.scrollBy()` does not test a scroll lock.** Per spec an
  `overflow: hidden` box stays programmatically scrollable, so it sails
  through a working lock. Use synthesized wheel and key input.
- **`html` computes `overflow: "hidden auto"` normally** here, because
  `overflow-x: hidden` is a base style. Assert `overflowY`.
- **A CSS lock alone does not stop Lenis**, which scrolls programmatically —
  which is why `lib/scroll-lock.ts` stops it directly and the suites check for
  `lenis-stopped`.
- **`innerText` includes `sr-only` text** (clipped, not `display: none`) and
  applies `text-transform`. Read the specific visible span.
- **`role="alert"` takes no accessible name from its contents** — the message
  is in a descendant StaticText node, so walk the alert's `childIds`.
- **A forged cookie silently lands you on `/login`** against a deployed site.
- **`navigator.clipboard.readText()` rejects without document focus.**

// Holding the page still.
//
// The page scrolls on <html> — globals.css puts `overflow-x: hidden` there —
// and once the root element has an explicit overflow the viewport stops taking
// its overflow from <body>. So `body.style.overflow = "hidden"` does not lock
// anything; it only turns <body> into a scroll container, which also changes
// the containing block for every `position: sticky` element on the page. The
// lock has to go on <html>.
//
// `overflow: hidden` alone is not enough on pointer devices. Lenis
// (components/SmoothScroll.tsx) moves the page with programmatic scrolls, and
// the spec keeps a box with `overflow: hidden` programmatically scrollable —
// so inertia scrolling drives straight through a CSS-only lock. The lock has
// to stop Lenis as well, which is why the smooth-scroller registers itself
// here.
//
// Ref-counted because more than one thing can want the page held (the boarding
// intro in components/Porthole.tsx, the postcard lightbox in
// components/Gallery.tsx) and whichever lets go first must not unlock it for
// the other.

type SmoothScroller = { stop: () => void; start: () => void };

const CLASS = "scroll-locked";
let holders = 0;
let scroller: SmoothScroller | null = null;

// Called by components/SmoothScroll.tsx once Lenis exists. It mounts after the
// boarding intro has already taken the lock, so a scroller arriving while the
// page is held starts out stopped.
export function registerSmoothScroller(instance: SmoothScroller): () => void {
  scroller = instance;
  if (holders > 0) instance.stop();
  return () => {
    if (scroller === instance) scroller = null;
  };
}

// Locks the page and returns the matching release. Calling a release twice is
// a no-op, so an effect cleanup that runs more than once cannot drop the count
// below what is actually held.
export function lockScroll(): () => void {
  holders += 1;
  document.documentElement.classList.add(CLASS);
  scroller?.stop();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders === 0) {
      document.documentElement.classList.remove(CLASS);
      scroller?.start();
    }
  };
}

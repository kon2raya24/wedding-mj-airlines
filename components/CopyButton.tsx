"use client";

import { useEffect, useRef, useState } from "react";

// A copy affordance for the few details a guest actually retypes somewhere
// else — the venue address into Maps, the hashtag into a caption. The result
// is announced politely as well as shown, so it lands for screen-reader users
// and not only as a change of label.
export default function CopyButton({
  value,
  what,
  className = "",
}: {
  value: string;
  // Used in the button's label and its confirmation, e.g. "address".
  what: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  // A pending reset must not fire after this unmounts.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      // Clipboard access can be refused (insecure context, denied permission).
      // Say so rather than showing a success that did not happen.
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${what}`}
      className={`inline-flex items-center gap-1.5 align-middle font-sans uppercase tracking-[0.2em] text-[9px] text-cream/60 hover:text-silver transition-colors ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        {state === "copied" ? (
          <path d="M20 6L9 17l-5-5" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 012-2h8" />
          </>
        )}
      </svg>
      <span aria-hidden>
        {state === "copied" ? "Copied" : state === "failed" ? "Failed" : "Copy"}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? `${what} copied` : state === "failed" ? `Could not copy ${what}` : ""}
      </span>
    </button>
  );
}

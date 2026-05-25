"use client";

import { useState, useTransition } from "react";

export default function AdminLogin({
  action,
  configured,
}: {
  action: (formData: FormData) => Promise<{ error?: string }>;
  configured: boolean;
}) {
  const [error, setError] = useState<string | null>(
    configured ? null : "Admin is disabled — set ADMIN_PASSWORD in your environment to enable this page."
  );
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="min-h-screen bg-navy-deep text-cream grid place-items-center px-4">
      <form
        action={onSubmit}
        className="w-full max-w-sm bg-navy-deep/90 text-cream rounded-md p-7 border border-cream/15 shadow-2xl shadow-navy-deep/40 space-y-5"
      >
        <div>
          <p className="font-sans uppercase tracking-[0.4em] text-[10px] text-gold">Admin</p>
          <h1 className="font-serif text-2xl mt-1">Sign in to manage RSVPs</h1>
        </div>
        <label className="block">
          <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/65">Password</span>
          <input
            type="password"
            name="password"
            required
            disabled={!configured}
            autoComplete="current-password"
            className="mt-1.5 w-full bg-cream/5 border border-cream/20 rounded px-3 py-2.5 font-mono tracking-widest text-cream focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 disabled:opacity-50"
          />
        </label>
        <button
          type="submit"
          disabled={pending || !configured}
          className="w-full font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-3.5 bg-gold text-navy-deep hover:bg-cream rounded-sm transition-colors disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
        {error && (
          <p className="font-sans text-[12px] text-rouge leading-relaxed">{error}</p>
        )}
      </form>
    </main>
  );
}

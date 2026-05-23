import { wedding } from "./config";

export type Phase = "before" | "day-of" | "after";

export function weddingPhase(now: Date = new Date()): Phase {
  const start = new Date(wedding.date);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000); // event "ends" 24h after start

  if (now < start) return "before";
  if (now < end) return "day-of";
  return "after";
}

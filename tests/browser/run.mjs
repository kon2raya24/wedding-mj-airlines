#!/usr/bin/env node
// Runs every browser suite and totals the results.
//
//   node tests/browser/run.mjs                      # local dev server on 3001
//   BASE=https://… FORM_LOGIN=1 node tests/browser/run.mjs
//
// Suites that need the boarding intro to be slower (a deployed site) accept
// SETTLE=<ms>. Set SHOTS=<dir> to save screenshots where a suite offers them.
import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// Generous: a deployed run does a real form login per suite. Override with
// SUITE_TIMEOUT_MS if a suite legitimately needs longer.
const SUITE_TIMEOUT_MS = Number(process.env.SUITE_TIMEOUT_MS || 8 * 60 * 1000);
const only = process.argv.slice(2);
const suites = readdirSync(join(here, "suites"))
  .filter((f) => f.endsWith(".mjs"))
  .filter((f) => only.length === 0 || only.some((o) => f.includes(o)))
  .sort();

if (suites.length === 0) {
  console.error(`No suites matched ${only.join(", ")}`);
  process.exit(1);
}

console.log(`Target: ${process.env.BASE || "http://localhost:3001"}`);
console.log(`Login:  ${process.env.FORM_LOGIN ? "real form (deployed site)" : "forged cookie (local only)"}\n`);

let passed = 0;
let failed = 0;
const broken = [];

for (const suite of suites) {
  const path = join(here, "suites", suite);
  // A suite that wedges must not take the run with it. One did once — it sat
  // for over an hour holding browsers open — so every suite gets a deadline.
  const { code, out, timedOut } = await new Promise((resolve) => {
    const child = spawn(process.execPath, [path], {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });
    let buf = "";
    let killed = false;
    const deadline = setTimeout(() => {
      killed = true;
      child.kill("SIGKILL");
    }, SUITE_TIMEOUT_MS);
    child.stdout.on("data", (d) => (buf += d));
    child.stderr.on("data", (d) => (buf += d));
    child.on("close", (code) => {
      clearTimeout(deadline);
      resolve({ code, out: buf, timedOut: killed });
    });
  });

  if (timedOut) {
    broken.push(suite);
    process.stdout.write(`${suite.padEnd(24)} TIMED OUT after ${SUITE_TIMEOUT_MS / 1000}s\n`);
    out.split("\n").slice(-8).forEach((l) => console.log(`  ${l}`));
    continue;
  }

  const tally = out.match(/(\d+) passed, (\d+) failed/);
  if (tally) {
    passed += Number(tally[1]);
    failed += Number(tally[2]);
    process.stdout.write(`${suite.padEnd(24)} ${tally[1]} passed, ${tally[2]} failed\n`);
    if (Number(tally[2]) > 0) {
      out.split("\n").filter((l) => l.includes("✗")).forEach((l) => console.log(`  ${l.trim()}`));
    }
  } else {
    broken.push(suite);
    process.stdout.write(`${suite.padEnd(24)} DID NOT REPORT (exit ${code})\n`);
    console.log(out.split("\n").slice(-12).map((l) => `  ${l}`).join("\n"));
  }
}

console.log("\n" + "-".repeat(46));
console.log(`TOTAL  ${passed} passed, ${failed} failed${broken.length ? `, ${broken.length} did not report` : ""}`);
process.exit(failed || broken.length ? 1 : 0);

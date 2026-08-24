/**
 * Parity check for the client-side pricing mirror.
 *
 *     node src/utils/hutPricing.check.mjs
 *
 * The expected figures below are not invented here -- they are what the Django
 * API actually returned for the same stays (products/tests_pricing.py holds
 * the server-side versions). If this file starts failing, the browser is about
 * to quote a guest a price the server will not honour.
 *
 * A standalone script rather than a test-runner suite because this repo has no
 * test runner, and hutPricing.js is plain JS with no Vite or React imports, so
 * node can run it as-is.
 */
import assert from "node:assert/strict";

import { quoteStay, priceForStay, stayNights } from "./hutPricing.js";

const WAHAD = { weekday_price: "600.00", weekend_price: "770.00" };
const QIMMA = { weekday_price: "1450.00", weekend_price: "1650.00" };
const ILLUSTRATION = { weekday_price: 1000, weekend_price: 1500 };

// 2026-08-21 is a Friday.
const FRI = "2026-08-21";
const SAT = "2026-08-22";
const SUN = "2026-08-23";
const MON = "2026-08-24";
const TUE = "2026-08-25";

let failures = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log(`  ok   ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`  FAIL ${name}\n       ${error.message}`);
  }
};

console.log("hut pricing, client mirror");

check("checkout day is not a night", () => {
  assert.equal(stayNights(FRI, SUN).length, 2);
});

check("same day counts as one night", () => {
  assert.equal(stayNights(FRI, FRI).length, 1);
});

check("a Friday night is a weekend night", () => {
  assert.equal(priceForStay(WAHAD, FRI, SAT), 770);
});

check("a Sunday night is a weekday night", () => {
  assert.equal(priceForStay(WAHAD, SUN, MON), 600);
});

// The two figures the live API returned for these exact stays.
check("2 weekend nights match the server (1540)", () => {
  assert.equal(priceForStay(WAHAD, FRI, SUN), 1540);
});

check("3 nights match the server (1800)", () => {
  assert.equal(priceForStay(WAHAD, FRI, MON), 1800);
});

check("the long-stay rate carries past 3 nights", () => {
  assert.equal(priceForStay(WAHAD, FRI, TUE), 2400); // 600 x 4
});

check("Qimma prices at its own rates", () => {
  assert.equal(priceForStay(QIMMA, FRI, MON), 4350); // 1450 x 3
  assert.equal(priceForStay(QIMMA, FRI, SUN), 3300); // 1650 x 2
});

check("the illustration case lands on 3000 both ways", () => {
  assert.equal(priceForStay(ILLUSTRATION, FRI, MON), 3000);
  assert.equal(priceForStay(ILLUSTRATION, FRI, SUN), 3000);
});

check("a long stay bills every night as a weekday night", () => {
  const q = quoteStay(WAHAD, FRI, MON);
  assert.equal(q.longStay, true);
  assert.equal(q.weekdayNights, 3);
  assert.equal(q.weekendNights, 0);
});

check("a hut with no rates is free, not NaN", () => {
  assert.equal(priceForStay({}, FRI, MON), 0);
  assert.equal(priceForStay(null, FRI, MON), 0);
});

check("no dates means no charge", () => {
  assert.equal(priceForStay(WAHAD, null, null), 0);
});

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");

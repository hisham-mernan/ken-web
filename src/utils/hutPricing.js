/**
 * The hut pricing rule, mirrored from the server.
 *
 * The server (products/pricing.py) is authoritative -- this exists so the
 * booking form can show a live total as dates are picked, without a round
 * trip. If the two ever disagree the server wins and the customer is charged
 * its figure, so keep this file and that one in step.
 *
 * The rule:
 *   - A stay is the nights in [dateFrom, dateTo). Checkout day is not a night,
 *     and each night is named by the day it starts on.
 *   - Friday and Saturday nights are weekend nights.
 *   - Three nights or more are charged the weekday rate throughout.
 */

// JS getDay(): Sunday=0 ... Friday=5, Saturday=6. Note this differs from
// Python's weekday() used on the server -- same two days, different numbers.
const WEEKEND_DAYS = new Set([5, 6]);

export const MIN_NIGHTS_FOR_WEEKDAY_RATE = 3;

const startOfDay = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

export const isWeekendNight = (date) => WEEKEND_DAYS.has(date.getDay());

/** The nights of a stay, each as the Date it starts on. */
export const stayNights = (dateFrom, dateTo) => {
  const from = startOfDay(dateFrom);
  const to = startOfDay(dateTo);
  if (!from || !to) return [];
  // Same-day (or reversed) counts as the single night of the start day,
  // matching the server.
  if (to <= from) return [from];

  const nights = [];
  for (let d = new Date(from); d < to; d.setDate(d.getDate() + 1)) {
    nights.push(new Date(d));
  }
  return nights;
};

/**
 * Price a stay in one hut.
 *
 * Returns { nights, weekdayNights, weekendNights, weekdayRate, weekendRate,
 * longStay, total } -- the night counts describe how the stay is *charged*,
 * so on a long stay every night counts as a weekday night even if it fell on
 * a Friday.
 */
export const quoteStay = (hut, dateFrom, dateTo) => {
  const weekdayRate = Number(hut?.weekday_price) || 0;
  const weekendRate = Number(hut?.weekend_price) || 0;
  const nights = stayNights(dateFrom, dateTo);

  if (!nights.length) {
    return {
      nights: 0,
      weekdayNights: 0,
      weekendNights: 0,
      weekdayRate,
      weekendRate,
      longStay: false,
      total: 0,
    };
  }

  const longStay = nights.length >= MIN_NIGHTS_FOR_WEEKDAY_RATE;
  const weekendNights = longStay
    ? 0
    : nights.filter(isWeekendNight).length;
  const weekdayNights = nights.length - weekendNights;

  return {
    nights: nights.length,
    weekdayNights,
    weekendNights,
    weekdayRate,
    weekendRate,
    longStay,
    total: weekdayNights * weekdayRate + weekendNights * weekendRate,
  };
};

export const priceForStay = (hut, dateFrom, dateTo) =>
  quoteStay(hut, dateFrom, dateTo).total;

export default quoteStay;

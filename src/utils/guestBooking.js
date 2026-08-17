/**
 * Keeps the access token for a booking made without an account.
 *
 * A guest has no session, so this token is the only thing that proves the
 * booking is theirs: the checkout page needs it to confirm, and the payment
 * call needs it to authorise. It is also emailed to them, so losing it here
 * (a closed tab, a different device) is recoverable rather than fatal.
 *
 * sessionStorage rather than localStorage: it belongs to this checkout, and
 * should not linger on a shared machine after the tab closes.
 */

const KEY_PREFIX = "ken_guest_booking_";

const key = (bookingId) => `${KEY_PREFIX}${bookingId}`;

export const saveGuestToken = (bookingId, token) => {
  if (!bookingId || !token) return;
  try {
    sessionStorage.setItem(key(bookingId), token);
  } catch {
    // Private browsing can refuse storage; the email link still works.
  }
};

export const getGuestToken = (bookingId) => {
  if (!bookingId) return null;
  try {
    return sessionStorage.getItem(key(bookingId));
  } catch {
    return null;
  }
};

export const clearGuestToken = (bookingId) => {
  if (!bookingId) return;
  try {
    sessionStorage.removeItem(key(bookingId));
  } catch {
    /* nothing to clean up */
  }
};

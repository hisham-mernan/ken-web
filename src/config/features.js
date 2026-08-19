/**
 * Temporary visibility switches.
 *
 * Events, services and Ken special items are hidden across the site for now.
 * Nothing is deleted -- the pages, components and API calls all still exist,
 * and the data is untouched in the database. Flip a flag back to `true` to
 * bring that section back everywhere at once.
 */
export const SHOW_EVENTS = false;
export const SHOW_SERVICES = false;
export const SHOW_SPECIAL_ITEMS = false;

/**
 * The "Send Message" contact form that sat at the foot of the huts, hut
 * detail and contact pages. Hidden, not deleted -- Support.jsx and its route
 * are untouched, so flipping this back restores it everywhere at once.
 */
export const SHOW_CONTACT_FORM = false;

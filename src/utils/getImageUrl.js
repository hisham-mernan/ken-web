const SUPABASE_PUBLIC =
  "https://onzkkxvzuzkdcsckcxsp.supabase.co/storage/v1/object/public";

// Supabase can resize on the fly from the same bucket. The originals are
// straight-off-the-camera JPEGs -- one hut photo is 15.3 MB -- so asking for
// a width instead of the raw object is worth roughly 25-50x on transfer.
const OBJECT_SEGMENT = "/storage/v1/object/public/";
const RENDER_SEGMENT = "/storage/v1/render/image/public/";

// The render endpoint only understands raster formats. SVGs are already tiny
// and GIFs would lose their animation, so both are passed through untouched.
const NO_TRANSFORM = /\.(svg|gif)(\?|#|$)/i;

const DEFAULT_QUALITY = 75;

// Image transformation is a per-project Supabase feature. When it is not
// enabled the render endpoint returns 403 FeatureNotEnabled for every request,
// which would break every remote image on the site -- so transformation is
// opt-in. Set VITE_SUPABASE_IMAGE_TRANSFORM=true once it is confirmed live.
const TRANSFORM_ENABLED =
  import.meta.env.VITE_SUPABASE_IMAGE_TRANSFORM === "true";

/**
 * Widths that match how the images are actually laid out. Pick the nearest one
 * up rather than inventing a new width per call site: every distinct width is a
 * separate transform Supabase has to generate and cache.
 */
export const IMG = {
  avatar: 96,
  icon: 128,
  thumb: 400,
  card: 800,
  hero: 1600,
};

/**
 * Build a URL for a media path returned by the API.
 *
 * @param {string} img       path or absolute URL from the API
 * @param {object} [options]
 * @param {number} [options.width]   target width in px; omit for the original
 * @param {number} [options.quality] 20-100, defaults to 75
 * @returns {string}
 */
export const getImageUrl = (img, options = {}) => {
  if (!img || typeof img !== "string") return "";

  // An unsaved upload is already a local object URL -- never rewrite it.
  if (img.startsWith("blob:") || img.startsWith("data:")) return img;

  let url;
  if (img.startsWith("http://") || img.startsWith("https://")) {
    url = img;
  } else {
    const cleanPath = img.startsWith("/") ? img : `/${img}`;
    url = cleanPath.startsWith("/media/")
      ? `${SUPABASE_PUBLIC}${cleanPath}`
      : `${SUPABASE_PUBLIC}/media${cleanPath}`;
  }

  const { width, quality = DEFAULT_QUALITY } = options;

  // Only rewrite our own Supabase objects; a third-party URL is left alone.
  if (
    !TRANSFORM_ENABLED ||
    !width ||
    !url.includes(OBJECT_SEGMENT) ||
    NO_TRANSFORM.test(url)
  ) {
    return url;
  }

  const rendered = url.replace(OBJECT_SEGMENT, RENDER_SEGMENT);
  const separator = rendered.includes("?") ? "&" : "?";
  return `${rendered}${separator}width=${Math.round(width)}&quality=${quality}`;
};

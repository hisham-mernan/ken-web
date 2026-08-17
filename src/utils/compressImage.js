/**
 * Downscale an image in the browser before it is uploaded.
 *
 * Vercel's serverless functions reject request bodies over roughly 4.5 MB with
 * a 413 raised at the edge -- before Django runs at all. A photo straight from
 * a phone easily exceeds that, so without this the upload fails before any
 * server-side compression can see it, and nothing surfaces to the user.
 *
 * Anything already under TARGET_BYTES is returned untouched, which keeps small
 * PNGs (including transparent ones) exactly as they are. Only large files are
 * re-encoded, and at that size they are always photographs, so flattening to
 * JPEG is safe.
 */

// Well under the platform limit, leaving room for the rest of the multipart
// body (other form fields, boundaries, headers).
const TARGET_BYTES = 1024 * 1024;

// Comfortably above the largest layout (the widest hero asks for 1600px), so
// the stored file is still the sharpest thing anything renders.
const MAX_EDGE = 1920;

const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.1;

const COMPRESSIBLE = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

/**
 * @param {File} file
 * @param {object} [options]
 * @param {number} [options.targetBytes] size to aim for
 * @param {number} [options.maxEdge]     longest side in px
 * @returns {Promise<File>} the compressed file, or the original if untouched
 */
export const compressImage = async (file, options = {}) => {
  const targetBytes = options.targetBytes ?? TARGET_BYTES;
  const maxEdge = options.maxEdge ?? MAX_EDGE;

  if (!file || !COMPRESSIBLE.includes(file.type)) return file;
  if (file.size <= targetBytes) return file;

  let bitmap;
  try {
    // from-image honours the EXIF orientation tag, otherwise portrait shots
    // come back rotated.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // not decodable here -- let the server deal with it
  }

  try {
    const scale = Math.min(maxEdge / Math.max(bitmap.width, bitmap.height), 1);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);

    let blob = null;
    for (let q = INITIAL_QUALITY; q >= MIN_QUALITY; q -= QUALITY_STEP) {
      blob = await canvasToBlob(canvas, "image/jpeg", q);
      if (blob && blob.size <= targetBytes) break;
    }
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    bitmap.close?.();
  }
};

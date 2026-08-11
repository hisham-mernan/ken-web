export const getImageUrl = (img) => {
  if (!img) return "";
  if (typeof img !== "string") return "";
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }
  const cleanPath = img.startsWith("/") ? img : `/${img}`;
  if (cleanPath.startsWith("/media/")) {
    return `https://onzkkxvzuzkdcsckcxsp.supabase.co/storage/v1/object/public${cleanPath}`;
  }
  return `https://onzkkxvzuzkdcsckcxsp.supabase.co/storage/v1/object/public/media${cleanPath}`;
};

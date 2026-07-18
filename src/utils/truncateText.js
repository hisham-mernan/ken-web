export function truncateText(text, length, withDots = true) {
  if (text.length <= length) {
    return text;
  }

  return `${text.substring(0, length)} ${withDots ? "..." : ""}`;
}

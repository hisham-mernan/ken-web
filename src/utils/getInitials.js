export const getInitials = (fullName = "") => {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);

  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";

  return (first + second).toUpperCase();
};

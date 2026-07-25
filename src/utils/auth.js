import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("ken_token");
  if (!token) {
    return {
      role: localStorage.getItem("ken_role") || null,
      email: localStorage.getItem("ken_email") || null,
    };
  }

  try {
    const decoded = jwtDecode(token);

    return {
      role: decoded.role || localStorage.getItem("ken_role") || null,
      email: decoded.email || localStorage.getItem("ken_email") || null,
    };
  } catch (error) {
    console.error("Invalid token:", error);
    return {
      role: localStorage.getItem("ken_role") || null,
      email: localStorage.getItem("ken_email") || null,
    };
  }
};

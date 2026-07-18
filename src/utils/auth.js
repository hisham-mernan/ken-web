import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("ken_token");
  if (!token) return { role: null, email: null };

  try {
    const decoded = jwtDecode(token);

    return {
      role: decoded.role,
      email: decoded.email,
    };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLogoutHandler } from "../service/axiosInstance";

const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("ken_token"));
  const [user, setUser] = useState({
    full_name: localStorage.getItem("ken_full_name"),
    email: localStorage.getItem("ken_email"),
    avatar: localStorage.getItem("ken_avatar") || null,
    role: localStorage.getItem("ken_role"),
  });

  const login = (data, hasNavigation) => {
    localStorage.setItem("ken_token", data.token);
    localStorage.setItem("ken_email", data?.email);
    localStorage.setItem("ken_full_name", data?.full_name);
    if (data?.avatar) {
      localStorage.setItem("ken_avatar", data.avatar);
    }
    localStorage.setItem("ken_role", data.role);
    setToken(data.token);
    setUser({
      full_name: data?.full_name,
      avatar: data.avatar || null,
      role: data.role,
    });
    if (hasNavigation) {
      navigate("/");
    }
  };

  const logout = (nav = "/") => {
    localStorage.clear();
    setToken();
    setUser();
    navigate(nav);
  };
  useEffect(() => {
    setLogoutHandler(logout);
  }, []);
  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Authcontext used outside the Authprovider");
  return context;
}
export { useAuth, AuthProvider };

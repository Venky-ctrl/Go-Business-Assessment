import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(Cookies.get("jwt_token")),
  );

  function login(token) {
    Cookies.set("jwt_token", token);
    setIsAuthenticated(true);
  }

  function logout() {
    Cookies.remove("jwt_token");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

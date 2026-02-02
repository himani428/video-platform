import { createContext, useState } from "react";

export const AuthContext = createContext();

const getRoleFromToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1])).role;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken);
  const [role, setRole] = useState(
    storedToken ? getRoleFromToken(storedToken) : null
  );

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setRole(getRoleFromToken(jwt));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

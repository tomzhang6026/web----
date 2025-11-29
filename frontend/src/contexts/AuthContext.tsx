import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, setToken, clearAuth, isAuthenticated } from "../lib/auth";

type AuthContextType = {
  isLoggedIn: boolean;
  loginCtx: (token: string) => void;
  logoutCtx: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loginCtx: () => {},
  logoutCtx: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    // 初始化检查
    setIsLoggedIn(isAuthenticated());
  }, []);

  const loginCtx = (token: string) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  const logoutCtx = () => {
    clearAuth();
    setIsLoggedIn(false);
    // 可选：跳转到首页或登录页
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loginCtx, logoutCtx }}>
      {children}
    </AuthContext.Provider>
  );
}


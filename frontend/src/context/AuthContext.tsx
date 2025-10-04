import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

const authContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const cookie = Cookies.get("is_authenticated");
    return cookie ? JSON.parse(cookie) : false;
  });

  useEffect(() => {
    const logout = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener("logout", logout);

    return () => {
      window.removeEventListener("logout", logout);
    };
  }, []);

  const setAuthenticated = (isAuthenticated: boolean) => {
    setIsAuthenticated(isAuthenticated);
    Cookies.set("is_authenticated", JSON.stringify(isAuthenticated));
  };

  return <authContext.Provider value={{ isAuthenticated, setAuthenticated }}>{children}</authContext.Provider>;
};

export const useContextAuth = (): AuthContextType => {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("useContextAuth must be used within an AuthProvider");
  }

  return context;
};

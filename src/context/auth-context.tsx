"use client"

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter();

  // Check if token exists
  const checkToken = () => {
    const currentToken = Cookies.get("_token_")
    if (!currentToken) {
      console.info("Token not found, cleaning user data")
      logout()
    }
  }

  // Check token on every render
  useEffect(() => {
    const savedToken = Cookies.get("_token_")
    const savedUser = localStorage.getItem("user")

    if (savedToken) {
      setToken(savedToken)
    }

    // if user exist in local storage, set hook
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // verify token on storage change event
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "_token_") {
        checkToken()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    Cookies.set("_token_", authToken)

    localStorage.setItem("user", JSON.stringify(userData))

    router.push("/");
  }

  const logout = () => {
    Cookies.remove("_token_")
    localStorage.removeItem("user")
    setUser(null)
    setToken(null)
    router.push("/login")
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access authentication context
export const useAuth = () =>  {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be used inside AuthProvider")
  }

  return context;
}

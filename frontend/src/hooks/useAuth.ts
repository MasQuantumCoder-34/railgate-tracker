"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("gw_token");
    setIsAuth(!!token);
    setIsChecking(false);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const res = await api.post<{ token: string }>("/auth/login", {
        username,
        password,
      });
      if (res.success && res.data?.token) {
        localStorage.setItem("gw_token", res.data.token);
        setIsAuth(true);
        router.push("/admin/dashboard");
      }
      return res;
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("gw_token");
    setIsAuth(false);
    router.push("/admin/login");
  }, [router]);

  const getToken = useCallback(() => {
    return localStorage.getItem("gw_token");
  }, []);

  return {
    login,
    logout,
    getToken,
    isAuthenticated: isAuth,
    isChecking,
  };
}

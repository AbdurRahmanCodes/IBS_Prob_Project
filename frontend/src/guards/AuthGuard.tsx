"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    // Check token expiration (backend expires in 1 hour)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // JWT exp is in seconds, Date.now() is in milliseconds
      if (payload.exp * 1000 < Date.now()) {
        clearAuth();
        router.replace("/login");
      }
    } catch (error) {
      clearAuth();
      router.replace("/login");
    }
  }, [token, router, clearAuth]);

  // Returning null while redirecting avoids the need for isMounted state entirely
  if (!token) return null;

  return <>{children}</>;
}

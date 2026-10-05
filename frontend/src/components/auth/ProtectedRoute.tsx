"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuthStore } from "@/store/auth-store";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  // We use this to track when the app has successfully reached the browser
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // If the app is in the browser and there is no token, kick them out
    if (isMounted && !token) {
      router.push("/login");
    }
  }, [isMounted, token, router]);

  // Show a loading spinner while Next.js is loading or redirecting
  if (!isMounted || !token) {
    return (
      <Box
        sx={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If we made it this far, they have a token! Render the private page.
  return <>{children}</>;
}

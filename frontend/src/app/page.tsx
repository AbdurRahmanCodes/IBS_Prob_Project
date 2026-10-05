"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/auth-store";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" component="h1">
            Task Board
          </Typography>
          <Button variant="outlined" color="error" onClick={clearAuth}>
            Sign Out
          </Button>
        </Box>

        <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>
            Welcome back, {user?.name || "User"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If you are seeing this page, the Route Guard successfully verified your Zustand token.
          </Typography>
        </Box>
      </Container>
    </ProtectedRoute>
  );
}

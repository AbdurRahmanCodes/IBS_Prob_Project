"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useAuthStore } from "@/store/auth-store";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button variant="outlined" color="error" onClick={clearAuth}>
          Sign Out
        </Button>
      </Box>
      <Box sx={{ p: 3, mb: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6">Welcome back, {user?.name || "User"}!</Typography>
      </Box>
    </Container>
  );
}

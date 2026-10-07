"use client";

import { useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
      <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom color="error">
          Something went wrong
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {error.message || "An unexpected error occurred while loading this view."}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={() => reset()}>
            Try Again
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

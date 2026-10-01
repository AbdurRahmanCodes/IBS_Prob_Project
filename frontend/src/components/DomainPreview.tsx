"use client";

import { useQuery } from "@apollo/client/react";
import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { DomainDataDocument, type DomainDataQuery } from "@/graphql/generated/graphql";

export default function DomainPreview() {
  const { data, loading, error } = useQuery<DomainDataQuery>(DomainDataDocument);

  if (loading) {
    return <CircularProgress aria-label="Loading task board data" />;
  }

  if (error) {
    return <Alert severity="error">Unable to load task board data.</Alert>;
  }

  return (
    <Stack spacing={1}>
      <Typography variant="body1">Users: {data?.users.length ?? 0}</Typography>
      <Typography variant="body1">Projects: {data?.projects.length ?? 0}</Typography>
      <Typography variant="body1">Tasks: {data?.tasks.length ?? 0}</Typography>
    </Stack>
  );
}

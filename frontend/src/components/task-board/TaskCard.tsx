"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { TaskStatus, TaskPriority } from "@/graphql/generated/graphql";

interface TaskCardProps {
  title: string;
  description: string | null | undefined;
  status: TaskStatus;
  priority: TaskPriority;
}

const statusBgColors: Record<TaskStatus, string> = {
  TODO: "info.light",
  IN_PROGRESS: "warning.light",
  DONE: "success.light",
};

const statusTextColors: Record<TaskStatus, string> = {
  TODO: "info.contrastText",
  IN_PROGRESS: "warning.contrastText",
  DONE: "success.contrastText",
};

export default function TaskCard({ title, description, status, priority }: TaskCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            sx={{
              px: 1,
              py: 0.5,
              bgcolor: statusBgColors[status],
              color: statusTextColors[status],
              borderRadius: 1,
              fontSize: "0.75rem",
            }}
          >
            {status}
          </Box>
          <Box
            sx={{
              px: 1,
              py: 0.5,
              bgcolor: "secondary.light",
              color: "secondary.contrastText",
              borderRadius: 1,
              fontSize: "0.75rem",
            }}
          >
            {priority}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

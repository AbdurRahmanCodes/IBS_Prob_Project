"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Alert, Box, Button, Card, CardContent, MenuItem, Select, Typography } from "@mui/material";
import {
  UpdateTaskDocument,
  type GetTasksQuery,
  type TaskStatus,
} from "@/graphql/generated/graphql";

export type TaskItem = GetTasksQuery["tasks"]["items"][number];

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
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

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const [statusError, setStatusError] = useState("");
  const [updateTask, { loading: updatingStatus }] = useMutation(UpdateTaskDocument);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    setStatusError("");
    try {
      await updateTask({
        variables: {
          id: task.id,
          input: { status: newStatus },
        },
      });
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}
        >
          <Typography variant="h6" component="h2" sx={{ wordBreak: "break-word" }}>
            {task.title}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onEdit(task)}
            sx={{ ml: 1, minWidth: 60 }}
          >
            Edit
          </Button>
        </Box>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, wordBreak: "break-word" }}
          >
            {task.description}
          </Typography>
        )}

        {statusError && (
          <Alert
            severity="error"
            onClose={() => setStatusError("")}
            sx={{ mb: 1, py: 0, fontSize: "0.75rem", "& .MuiAlert-icon": { fontSize: "1rem" } }}
          >
            {statusError}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: "auto", flexWrap: "wrap" }}>
          <Select
            size="small"
            value={task.status}
            disabled={updatingStatus}
            inputProps={{ "aria-label": "Task status" }}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            sx={{
              fontSize: "0.75rem",
              height: 28,
              bgcolor: statusBgColors[task.status],
              color: statusTextColors[task.status],
              fontWeight: 500,
              ".MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiSvgIcon-root": { color: statusTextColors[task.status] },
            }}
          >
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </Select>

          <Box
            sx={{
              px: 1,
              py: 0.5,
              bgcolor: "secondary.light",
              color: "secondary.contrastText",
              borderRadius: 1,
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            {task.priority}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

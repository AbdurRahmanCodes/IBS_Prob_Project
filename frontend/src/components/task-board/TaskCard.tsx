"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  DeleteTaskDocument,
  GetTasksDocument,
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
  const [deleteError, setDeleteError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [updateTask, { loading: updatingStatus }] = useMutation(UpdateTaskDocument);
  const [deleteTask, { loading: deleting }] = useMutation(DeleteTaskDocument, {
    update(cache) {
      cache.evict({ fieldName: "tasks" });
      cache.gc();
    },
    refetchQueries: [{ query: GetTasksDocument }],
  });

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

  const handleDelete = async () => {
    setDeleteError("");
    try {
      await deleteTask({
        variables: { id: task.id },
      });
      setConfirmOpen(false);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete task");
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
          <Box sx={{ display: "flex", gap: 1, ml: 1, flexShrink: 0 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onEdit(task)}
              sx={{ minWidth: 60 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => {
                setDeleteError("");
                setConfirmOpen(true);
              }}
              sx={{ minWidth: 60 }}
            >
              Delete
            </Button>
          </Box>
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

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &ldquo;{task.title}&rdquo;? This action cannot be
            undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

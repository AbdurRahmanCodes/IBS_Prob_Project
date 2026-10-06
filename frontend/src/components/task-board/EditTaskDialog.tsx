"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  GetTasksDocument,
  TaskPriority,
  TaskStatus,
  UpdateTaskDocument,
} from "@/graphql/generated/graphql";

export interface TaskToEdit {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
}

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: TaskToEdit | null;
}

export default function EditTaskDialog({ open, onClose, task }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "TODO");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "MEDIUM");
  const [mutationError, setMutationError] = useState("");

  const [updateTask, { loading: updating }] = useMutation(UpdateTaskDocument, {
    refetchQueries: [{ query: GetTasksDocument }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setMutationError("");

    try {
      await updateTask({
        variables: {
          id: task.id,
          input: {
            title,
            description,
            status,
            priority,
          },
        },
      });
      onClose();
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent dividers>
          {mutationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutationError}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value="TODO">To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={updating}>
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

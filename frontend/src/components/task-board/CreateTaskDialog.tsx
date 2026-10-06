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
  CreateTaskDocument,
  GetTasksDocument,
  GetProjectsQuery,
  TaskPriority,
  TaskStatus,
} from "@/graphql/generated/graphql";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  projects: GetProjectsQuery["projects"];
}

export default function CreateTaskDialog({ open, onClose, projects }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [projectId, setProjectId] = useState("");
  const [mutationError, setMutationError] = useState("");

  const [createTask, { loading: creating }] = useMutation(CreateTaskDocument, {
    refetchQueries: [{ query: GetTasksDocument }],
  });

  // Derive the active project ID during render (eliminates a useEffect)
  const activeProjectId = projectId || (projects[0]?.id ?? "");

  function handleClose() {
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setPriority("MEDIUM");
    setProjectId("");
    setMutationError("");
    onClose();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMutationError("");

    try {
      await createTask({
        variables: {
          input: {
            title,
            description,
            status,
            priority,
            projectId: activeProjectId,
          },
        },
      });
      handleClose();
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent dividers>
          {mutationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutationError}
            </Alert>
          )}
          <TextField
            select
            fullWidth
            label="Project"
            value={activeProjectId}
            onChange={(e) => setProjectId(e.target.value)}
            margin="normal"
            required
          >
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
            {projects.length === 0 && (
              <MenuItem value="" disabled>
                No projects found. Create one first!
              </MenuItem>
            )}
          </TextField>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={creating || !activeProjectId}>
            {creating ? "Saving..." : "Create Task"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

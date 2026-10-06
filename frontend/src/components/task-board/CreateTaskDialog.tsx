"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Alert,
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
  type GetProjectsQuery,
  type TaskPriority,
  type TaskStatus,
} from "@/graphql/generated/graphql";
import TaskFormFields from "./TaskFormFields";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  projects: GetProjectsQuery["projects"];
  onSuccess?: () => void;
}

export default function CreateTaskDialog({
  open,
  onClose,
  projects,
  onSuccess,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [projectId, setProjectId] = useState("");
  const [mutationError, setMutationError] = useState("");

  const [createTask, { loading: creating }] = useMutation(CreateTaskDocument, {
    update(cache) {
      cache.evict({ fieldName: "tasks" });
      cache.gc();
    },
    refetchQueries: [{ query: GetTasksDocument }],
  });

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
      onSuccess?.();
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
          <TaskFormFields
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
            status={status}
            onStatusChange={setStatus}
            priority={priority}
            onPriorityChange={setPriority}
          />
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

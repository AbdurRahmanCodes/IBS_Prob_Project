"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import {
  UpdateTaskDocument,
  type GetTasksQuery,
  type TaskPriority,
  type TaskStatus,
} from "@/graphql/generated/graphql";
import TaskFormFields from "./TaskFormFields";

type TaskItem = GetTasksQuery["tasks"][number];

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: TaskItem | null;
}

export default function EditTaskDialog({ open, onClose, task }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "TODO");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "MEDIUM");
  const [mutationError, setMutationError] = useState("");

  const [updateTask, { loading: updating }] = useMutation(UpdateTaskDocument);

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
          <TaskFormFields
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
            status={status}
            onStatusChange={setStatus}
            priority={priority}
            onPriorityChange={setPriority}
            autoFocusTitle
          />
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

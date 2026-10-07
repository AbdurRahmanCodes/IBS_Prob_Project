"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DeleteTaskDocument } from "@/graphql/generated/graphql";
import { type TaskItem } from "./TaskCard";

interface DeleteTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: TaskItem | null;
  onSuccess?: () => void;
}

export default function DeleteTaskDialog({
  open,
  onClose,
  task,
  onSuccess,
}: DeleteTaskDialogProps) {
  const [deleteError, setDeleteError] = useState("");

  const [deleteTask, { loading: deleting }] = useMutation(DeleteTaskDocument, {
    update(cache) {
      cache.evict({ fieldName: "tasks" });
      cache.evict({ fieldName: "dashboard" });
      cache.gc();
    },
  });

  const handleClose = () => {
    if (deleting) return;
    setDeleteError("");
    onClose();
  };

  const handleDelete = async () => {
    if (!task) return;
    setDeleteError("");

    try {
      await deleteTask({
        variables: { id: task.id },
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  return (
    <Dialog open={open} onClose={() => handleClose()} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete &ldquo;{task?.title}&rdquo;? This action cannot be undone.
        </DialogContentText>
        {deleteError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {deleteError}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={deleting}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

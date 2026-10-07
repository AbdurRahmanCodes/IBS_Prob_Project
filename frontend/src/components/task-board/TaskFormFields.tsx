"use client";

import { Box, MenuItem, TextField } from "@mui/material";
import type { TaskPriority, TaskStatus } from "@/graphql/generated/graphql";

interface TaskFormFieldsProps {
  title: string;
  onTitleChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  status: TaskStatus;
  onStatusChange: (val: TaskStatus) => void;
  priority: TaskPriority;
  onPriorityChange: (val: TaskPriority) => void;
  dueDate: string;
  onDueDateChange: (val: string) => void;
  autoFocusTitle?: boolean;
}

export default function TaskFormFields({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  dueDate,
  onDueDateChange,
  autoFocusTitle = false,
}: TaskFormFieldsProps) {
  return (
    <>
      <TextField
        autoFocus={autoFocusTitle}
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        margin="normal"
        multiline
        rows={3}
      />
      <Box sx={{ display: "flex", gap: 2, mt: 1, flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          select
          fullWidth
          label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
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
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority)}
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </TextField>
        <TextField
          type="date"
          fullWidth
          label="Due Date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>
    </>
  );
}

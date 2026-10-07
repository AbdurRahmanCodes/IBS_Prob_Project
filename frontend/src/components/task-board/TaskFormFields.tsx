import { Box, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";
import type { TaskPriority, TaskStatus } from "@/graphql/generated/graphql";

function getOffsetDateStr(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

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
  const todayStr = getOffsetDateStr(0);
  const tomorrowStr = getOffsetDateStr(1);
  const nextWeekStr = getOffsetDateStr(7);

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
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: todayStr, max: "2099-12-31" },
          }}
          helperText="Optional deadline"
        />
      </Box>

      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Quick deadlines:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
          <Chip
            label="Today"
            size="small"
            variant={dueDate === todayStr ? "filled" : "outlined"}
            color={dueDate === todayStr ? "primary" : "default"}
            onClick={() => onDueDateChange(todayStr)}
            clickable
          />
          <Chip
            label="Tomorrow"
            size="small"
            variant={dueDate === tomorrowStr ? "filled" : "outlined"}
            color={dueDate === tomorrowStr ? "primary" : "default"}
            onClick={() => onDueDateChange(tomorrowStr)}
            clickable
          />
          <Chip
            label="In 1 Week"
            size="small"
            variant={dueDate === nextWeekStr ? "filled" : "outlined"}
            color={dueDate === nextWeekStr ? "primary" : "default"}
            onClick={() => onDueDateChange(nextWeekStr)}
            clickable
          />
          {dueDate && (
            <Chip
              label="Clear Date"
              size="small"
              variant="outlined"
              color="error"
              onDelete={() => onDueDateChange("")}
              onClick={() => onDueDateChange("")}
              clickable
            />
          )}
        </Stack>
      </Box>
    </>
  );
}

"use client";

import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { GetProjectsQuery, TaskStatus } from "@/graphql/generated/graphql";

interface TaskFiltersProps {
  status: TaskStatus | "";
  onStatusChange: (status: TaskStatus | "") => void;
  projectId: string;
  onProjectChange: (projectId: string) => void;
  projects: GetProjectsQuery["projects"];
  hasActiveFilters: boolean;
  onReset: () => void;
}

export default function TaskFilters({
  status,
  onStatusChange,
  projectId,
  onProjectChange,
  projects,
  hasActiveFilters,
  onReset,
}: TaskFiltersProps) {
  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter-select"
            value={status}
            label="Status"
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | "")}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="project-filter-label">Project</InputLabel>
          <Select
            labelId="project-filter-label"
            id="project-filter-select"
            value={projectId}
            label="Project"
            onChange={(e) => onProjectChange(e.target.value)}
          >
            <MenuItem value="">All Projects</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button
            variant="text"
            color="inherit"
            size="small"
            onClick={onReset}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Reset Filters
          </Button>
        )}
      </Box>
    </Box>
  );
}

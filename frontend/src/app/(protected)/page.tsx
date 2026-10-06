"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Alert, Box, Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useAuthStore } from "@/store/auth-store";
import {
  CreateProjectDocument,
  GetProjectsDocument,
  GetTasksDocument,
} from "@/graphql/generated/graphql";
import TaskCard from "@/components/task-board/TaskCard";
import CreateTaskDialog from "@/components/task-board/CreateTaskDialog";
import EditTaskDialog, { TaskToEdit } from "@/components/task-board/EditTaskDialog";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskToEdit | null>(null);
  const [seedError, setSeedError] = useState("");

  const { data: tasksData, loading: loadingTasks, error: tasksError } = useQuery(GetTasksDocument);

  const {
    data: projectsData,
    loading: loadingProjects,
    error: projectsError,
  } = useQuery(GetProjectsDocument);

  const [createProject, { loading: creatingProject }] = useMutation(CreateProjectDocument, {
    refetchQueries: [{ query: GetProjectsDocument }],
  });

  const projects = projectsData?.projects ?? [];

  // Only show seed button when the query has settled with an empty result
  const showSeedButton = !loadingProjects && !projectsError && projects.length === 0;

  const handleSeedProject = async () => {
    setSeedError("");
    try {
      await createProject({
        variables: { input: { name: "My First Project", description: "Created to test tasks" } },
      });
    } catch (err) {
      setSeedError(err instanceof Error ? err.message : "Failed to create project");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1">
          Task Board
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {showSeedButton && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSeedProject}
              disabled={creatingProject}
            >
              {creatingProject ? "Seeding..." : "Seed Project"}
            </Button>
          )}
          <Button variant="contained" color="primary" onClick={() => setCreateDialogOpen(true)}>
            + New Task
          </Button>
          <Button variant="outlined" color="error" onClick={clearAuth}>
            Sign Out
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 3, mb: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6">Welcome back, {user?.name ?? "User"}!</Typography>
      </Box>

      {seedError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {seedError}
        </Alert>
      )}

      <Typography variant="h5" sx={{ mb: 3 }}>
        Tasks
      </Typography>

      {loadingTasks && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {tasksError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {tasksError.message}
        </Alert>
      )}

      {!loadingTasks && !tasksError && tasksData?.tasks.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 2, fontStyle: "italic" }}>
          No tasks yet. Create one above.
        </Typography>
      )}

      <Grid container spacing={3}>
        {!loadingTasks &&
          !tasksError &&
          tasksData?.tasks.map((task) => (
            <Grid size={{ xs: 12, sm: 6 }} key={task.id}>
              <TaskCard task={task} onEdit={(t) => setEditingTask(t)} />
            </Grid>
          ))}
      </Grid>

      <CreateTaskDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        projects={projects}
      />

      <EditTaskDialog
        key={editingTask?.id ?? "none"}
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />
    </Container>
  );
}

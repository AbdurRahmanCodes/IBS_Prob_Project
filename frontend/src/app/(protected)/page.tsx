"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import { useAuthStore } from "@/store/auth-store";
import {
  CreateProjectDocument,
  GetDashboardDocument,
  GetProjectsDocument,
  GetTasksDocument,
} from "@/graphql/generated/graphql";
import TaskCard, { type TaskItem } from "@/components/task-board/TaskCard";
import CreateTaskDialog from "@/components/task-board/CreateTaskDialog";
import EditTaskDialog from "@/components/task-board/EditTaskDialog";
import DeleteTaskDialog from "@/components/task-board/DeleteTaskDialog";
import StatCards from "@/components/dashboard/StatCards";

const PAGE_SIZE = 6;

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [page, setPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskItem | null>(null);
  const [seedError, setSeedError] = useState("");

  const {
    data: tasksData,
    loading: loadingTasks,
    error: tasksError,
    previousData,
  } = useQuery(GetTasksDocument, {
    variables: { page, pageSize: PAGE_SIZE },
  });

  const {
    data: projectsData,
    loading: loadingProjects,
    error: projectsError,
  } = useQuery(GetProjectsDocument);

  const {
    data: dashboardData,
    loading: loadingDashboard,
    error: dashboardError,
  } = useQuery(GetDashboardDocument);

  const [createProject, { loading: creatingProject }] = useMutation(CreateProjectDocument, {
    refetchQueries: [{ query: GetProjectsDocument }],
  });

  const projects = projectsData?.projects ?? [];
  const currentTasksData = tasksData ?? previousData;
  const tasks = currentTasksData?.tasks.items ?? [];
  const totalPages = currentTasksData?.tasks.totalPages ?? 1;
  const totalCount = currentTasksData?.tasks.totalCount ?? 0;

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

  const handleDeleteSuccess = () => {
    if (tasks.length === 1 && page > 1) {
      setPage((prev) => Math.max(1, prev - 1));
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

      {dashboardError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Failed to load dashboard metrics: {dashboardError.message}
        </Alert>
      )}

      <StatCards stats={dashboardData?.dashboard.stats} loading={loadingDashboard} />

      {seedError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {seedError}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Tasks</Typography>
        {!tasksError && totalCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            Showing {tasks.length} of {totalCount} {totalCount === 1 ? "task" : "tasks"}
          </Typography>
        )}
      </Box>

      {loadingTasks && !currentTasksData && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {tasksError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {tasksError.message}
        </Alert>
      )}

      {!loadingTasks && !tasksError && tasks.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 2, fontStyle: "italic" }}>
          No tasks yet. Create one above.
        </Typography>
      )}

      <Grid
        container
        spacing={3}
        sx={{ opacity: loadingTasks ? 0.6 : 1, transition: "opacity 0.2s ease" }}
      >
        {!tasksError &&
          tasks.map((task) => (
            <Grid size={{ xs: 12, sm: 6 }} key={task.id}>
              <TaskCard
                task={task}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => setDeletingTask(t)}
              />
            </Grid>
          ))}
      </Grid>

      {!tasksError && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_event, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
            disabled={loadingTasks}
          />
        </Box>
      )}

      <CreateTaskDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        projects={projects}
        onSuccess={() => setPage(1)}
      />

      <EditTaskDialog
        key={editingTask ? `edit-${editingTask.id}` : "edit-task-dialog"}
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />

      <DeleteTaskDialog
        key={deletingTask ? `delete-${deletingTask.id}` : "delete-task-dialog"}
        open={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        task={deletingTask}
        onSuccess={handleDeleteSuccess}
      />
    </Container>
  );
}

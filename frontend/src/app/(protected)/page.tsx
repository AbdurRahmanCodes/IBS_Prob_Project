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
  GetProjectsDocument,
  GetTasksDocument,
  type GetTasksQuery,
} from "@/graphql/generated/graphql";
import TaskCard from "@/components/task-board/TaskCard";
import CreateTaskDialog from "@/components/task-board/CreateTaskDialog";
import EditTaskDialog from "@/components/task-board/EditTaskDialog";

type TaskItem = GetTasksQuery["tasks"]["items"][number];

const PAGE_SIZE = 6;

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [page, setPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [seedError, setSeedError] = useState("");

  const {
    data: tasksData,
    loading: loadingTasks,
    error: tasksError,
  } = useQuery(GetTasksDocument, {
    variables: { page, pageSize: PAGE_SIZE },
  });

  const {
    data: projectsData,
    loading: loadingProjects,
    error: projectsError,
  } = useQuery(GetProjectsDocument);

  const [createProject, { loading: creatingProject }] = useMutation(CreateProjectDocument, {
    refetchQueries: [{ query: GetProjectsDocument }],
  });

  const projects = projectsData?.projects ?? [];
  const tasks = tasksData?.tasks.items ?? [];
  const totalPages = tasksData?.tasks.totalPages ?? 1;
  const totalCount = tasksData?.tasks.totalCount ?? 0;

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

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Tasks</Typography>
        {!loadingTasks && !tasksError && totalCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            Showing {tasks.length} of {totalCount} {totalCount === 1 ? "task" : "tasks"}
          </Typography>
        )}
      </Box>

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

      {!loadingTasks && !tasksError && tasks.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 2, fontStyle: "italic" }}>
          No tasks yet. Create one above.
        </Typography>
      )}

      <Grid container spacing={3}>
        {!loadingTasks &&
          !tasksError &&
          tasks.map((task) => (
            <Grid size={{ xs: 12, sm: 6 }} key={task.id}>
              <TaskCard task={task} onEdit={(t) => setEditingTask(t)} />
            </Grid>
          ))}
      </Grid>

      {!loadingTasks && !tasksError && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_event, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

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

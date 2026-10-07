"use client";

import { Box, Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";

export interface TaskStatsData {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  dueSoon: number;
}

interface StatCardsProps {
  stats?: TaskStatsData | null;
  loading?: boolean;
}

interface StatItem {
  key: keyof TaskStatsData;
  label: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
}

const STAT_CONFIG: StatItem[] = [
  {
    key: "total",
    label: "Total Tasks",
    color: "primary.main",
    bgLight: "primary.50",
    borderColor: "primary.light",
    description: "All active & completed",
  },
  {
    key: "todo",
    label: "To Do",
    color: "info.main",
    bgLight: "info.50",
    borderColor: "info.light",
    description: "Not yet started",
  },
  {
    key: "inProgress",
    label: "In Progress",
    color: "warning.main",
    bgLight: "warning.50",
    borderColor: "warning.light",
    description: "Currently being worked on",
  },
  {
    key: "done",
    label: "Done",
    color: "success.main",
    bgLight: "success.50",
    borderColor: "success.light",
    description: "Completed tasks",
  },
  {
    key: "dueSoon",
    label: "Due Soon",
    color: "error.main",
    bgLight: "error.50",
    borderColor: "error.light",
    description: "Due within 7 days",
  },
];

export default function StatCards({ stats, loading = false }: StatCardsProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={2}>
        {STAT_CONFIG.map((config) => {
          const value = stats?.[config.key] ?? 0;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={config.key}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderLeft: 4,
                  borderLeftColor: config.borderColor,
                  transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 500,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      letterSpacing: 0.5,
                    }}
                  >
                    {config.label}
                  </Typography>

                  {loading ? (
                    <Skeleton variant="text" width={48} height={42} sx={{ my: 0.5 }} />
                  ) : (
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: config.color,
                        my: 0.5,
                      }}
                    >
                      {value}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    {config.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

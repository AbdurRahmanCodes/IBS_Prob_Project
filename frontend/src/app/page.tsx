import { Button, Typography, Container } from "@mui/material";

export default function Home() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task Board
      </Typography>
      <Button variant="contained">Hello MUI</Button>
    </Container>
  );
}

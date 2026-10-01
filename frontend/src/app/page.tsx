import { Button, Typography, Container } from "@mui/material";
import DomainPreview from "@/components/DomainPreview";

export default function Home() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task Board
      </Typography>
      <Button variant="contained">Hello MUI</Button>
      <DomainPreview />
    </Container>
  );
}

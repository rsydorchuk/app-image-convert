import { CircularProgress, Container, Link, Stack, Typography } from "@mui/material";
import { useAuth } from "./auth/AuthContext";
import Convert from "./pages/Convert";

const WEB_LOGIN_URL = "http://localhost:3000/login";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <CircularProgress />;

  if (!user) {
    return (
      <Container maxWidth="xs">
        <Stack spacing={2}>
          <Typography variant="h6">Not logged in</Typography>
          <Typography>
            Log in via <Link href={WEB_LOGIN_URL}>the hub</Link> first.
          </Typography>
        </Stack>
      </Container>
    );
  }

  return <Convert />;
}

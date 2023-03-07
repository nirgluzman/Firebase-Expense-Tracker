import { Button, Container, Typography } from "@mui/material";
import styles from "./styles/landing.module.scss";

function App() {
  return (
    <>
      <Container className={styles.container}>
        <Typography variant="h1">Welcome to Expense Tracker!</Typography>
        <Typography variant="h2">
          Add, view, edit, and delete expenses
        </Typography>
        <div className={styles.buttons}>
          <Button variant="contained" color="secondary">
            Login / Register
          </Button>
        </div>
      </Container>
    </>
  );
}

export default App;

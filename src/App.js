import { useState } from "react";

import { Button, Container, Dialog, Typography } from "@mui/material";

import styles from "./styles/landing.module.scss";

import { StyledFirebaseAuth } from "react-firebaseui";
import { auth } from "./firebase-config";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";

const REDIRECT_PAGE = "/dashboard";

// Configure FirebaseUI, https://www.npmjs.com/package/react-firebaseui
const uiConfig = {
  // Sign-in flow with popup rather than redirect flow
  signInFlow: "popup",
  // Redirect to /dashboard after sign-in is successful.
  signInSuccessUrl: REDIRECT_PAGE,
  // Sign-in methods
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
};

function App() {
  const [login, setLogin] = useState(false);

  return (
    <>
      <Container className={styles.container}>
        <Typography variant="h1">Welcome to Expense Tracker!</Typography>
        <Typography variant="h2">
          Add, view, edit, and delete expenses
        </Typography>
        <div className={styles.buttons}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setLogin(true)}
          >
            Login / Register
          </Button>
        </div>
        <Dialog open={login} onClose={() => setLogin(false)}>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={auth}
          ></StyledFirebaseAuth>
        </Dialog>
      </Container>
    </>
  );
}

export default App;

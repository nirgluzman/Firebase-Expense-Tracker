import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Container,
  Dialog,
  Typography,
  CircularProgress,
} from "@mui/material";

import styles from "../styles/landing.module.scss";

import { useAuth } from "../firebase/auth";
import { auth } from "../firebase-config";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { StyledFirebaseAuth } from "react-firebaseui";

const Home = () => {
  const [login, setLogin] = useState(false);
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();
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

  // Redirect if finished loading and ther's an existing user (user is logged in).
  useEffect(() => {
    if (!isLoading && authUser) {
      navigate("/dashboard");
    }
  }, [authUser, isLoading]);

  return isLoading || (!isLoading && !!authUser) ? (
    <CircularProgress
      color="inherit"
      sx={{ marginLeft: "50%", marginTop: "25%" }}
    />
  ) : (
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
};

export default Home;

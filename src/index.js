import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/global.scss";
import "./styles/firebaseui-styling.global.scss";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";

import { AuthUserProvider } from "./context/auth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthUserProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </AuthUserProvider>
);

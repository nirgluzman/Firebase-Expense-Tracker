import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./styles/global.scss";
import "./styles/firebaseui-styling.global.scss";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";

import { AuthUserProvider } from "./firebase/auth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthUserProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthUserProvider>
  </BrowserRouter>
);

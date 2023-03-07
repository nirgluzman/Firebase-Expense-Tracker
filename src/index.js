import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/global.scss";
import "./styles/firebaseui-styling.global.scss";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import ModalContextProvider from "./contexts/ModalContext";
import AuthContextProvider from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ModalContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

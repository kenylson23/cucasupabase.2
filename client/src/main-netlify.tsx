import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index-netlify.css";
import App from "./App-netlify.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
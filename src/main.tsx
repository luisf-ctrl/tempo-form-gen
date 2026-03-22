import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedProjectsIfNeeded } from "./data/seedProjects";

seedProjectsIfNeeded();

createRoot(document.getElementById("root")!).render(<App />);

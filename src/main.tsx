import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Content } from "./components/content/Content";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Content />
	</StrictMode>
);

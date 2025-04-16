import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { Extension } from "./extension/Extension";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Extension />
	</StrictMode>
);

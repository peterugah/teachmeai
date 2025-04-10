import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../index.css";
import { Working } from ".";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<p>working</p>
		<Working />
	</StrictMode>
);

import { createRoot } from "react-dom/client";
import { Index } from "../pages/content";
import "../index.css";

function mountTeachMePopup(container: HTMLElement) {
	createRoot(container).render(<Index />);
}

(function () {
	const rootContainerId = "teachme-ai-root";
	// Prevent multiple mounts
	if (document.getElementById(rootContainerId)) return;

	const container = document.createElement("div");
	container.id = rootContainerId;

	document.body.appendChild(container);
	mountTeachMePopup(container);
})();

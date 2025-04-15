import { createRoot } from "react-dom/client";
import { Index } from "../pages/content";
import "../styles/index.css";

function mountContent(container: HTMLElement) {
	createRoot(container).render(<Index />);
}

(function () {
	const rootContainerId = "some-random-id"; //TODO: work on the right name
	// Prevent multiple mounts
	if (document.getElementById(rootContainerId)) return;

	const container = document.createElement("div");
	container.id = rootContainerId;

	document.body.appendChild(container);
	mountContent(container);
})();

import { createRoot } from "react-dom/client";
import tailwindCss from "../styles/index.css?inline"; // <- inline the tailwind styles as string
import { Content } from "../components/content/Content";
import { ROOT_CONTAINER_ID } from "../constant";

function mountContent(shadowHost: HTMLElement) {
	const shadowRoot = shadowHost.attachShadow({ mode: "open" });

	const style = document.createElement("style");
	style.textContent = tailwindCss;
	shadowRoot.appendChild(style);

	const extensionContainer = document.createElement("div");
	extensionContainer.id = ROOT_CONTAINER_ID;

	shadowRoot.appendChild(extensionContainer);
	createRoot(extensionContainer).render(<Content />);
}

// NOTE: an IIFE is needed to execute the code immediately
(function () {
	if (document.getElementById(ROOT_CONTAINER_ID)) return;

	const shadowHost = document.createElement("div");
	shadowHost.id = ROOT_CONTAINER_ID;

	document.body.appendChild(shadowHost);
	mountContent(shadowHost);
})();

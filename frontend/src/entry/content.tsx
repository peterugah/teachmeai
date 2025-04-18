import { createRoot } from "react-dom/client";
import tailwindCss from "../styles/index.css?inline"; // <- inline the tailwind styles as string
import { ROOT_CONTAINER_ID } from "../constant";
import { Extension } from "../extension/Extension";
import { isLocalhost } from "../utils/isLocalHost";

function mountContent(shadowHost: HTMLElement) {
	const shadowRoot = shadowHost.attachShadow({ mode: "open" });
	const style = document.createElement("style");
	// const finalCss = "";

	// finalCss += tailwindCss;

	// finalCss = finalCss
	// 	.replace(/(:root,:host|:before,:after,::backdrop)/g, ":host")
	// 	.replace(/,:host/g, ":host");

	style.textContent = tailwindCss;

	console.log(style.textContent);

	shadowRoot.appendChild(style);
	const extensionContainer = document.createElement("div");
	shadowRoot.appendChild(extensionContainer);
	createRoot(extensionContainer).render(<Extension />);
}

// NOTE: an IIFE is needed to execute the code immediately
(function () {
	// NOTE: prevent extension from working in localhost to allow effective development
	if (isLocalhost()) {
		console.info("extension disabled in localhost :)");
		return;
	}
	if (document.getElementById(ROOT_CONTAINER_ID)) return;
	const shadowHost = document.createElement("div");
	shadowHost.id = ROOT_CONTAINER_ID;
	document.body.appendChild(shadowHost);
	mountContent(shadowHost);
})();

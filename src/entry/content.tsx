import { createRoot } from "react-dom/client";
import tailwindCss from "../styles/index.css?inline"; // <- inline the tailwind styles as string
import { ROOT_CONTAINER_ID } from "../constant";
import { Extension } from "../extension/Extension";

function mountContent(shadowHost: HTMLElement) {
	const shadowRoot = shadowHost.attachShadow({ mode: "open" });
	const style = document.createElement("style");
	let finalCss = "";

	/** 
	the variables have to be defined at the top layer for them to be accessible within the shadow dom 
	 */
	const variables = tailwindCss.match(
		/(:root,:host|:before,:after,::backdrop)\s*{[\s\S]*?}/g
	);

	if (variables) {
		finalCss += variables.map((definition) => definition);
	}
	finalCss += tailwindCss;

	style.textContent = finalCss
		.replace(/(:root,:host|:before,:after,::backdrop)/g, ":host")
		.replace(/,:host/g, ":host");

	shadowRoot.appendChild(style);
	const extensionContainer = document.createElement("div");
	shadowRoot.appendChild(extensionContainer);
	createRoot(extensionContainer).render(<Extension />);
}

// NOTE: an IIFE is needed to execute the code immediately
(function () {
	if (document.getElementById(ROOT_CONTAINER_ID)) return;
	const shadowHost = document.createElement("div");
	shadowHost.id = ROOT_CONTAINER_ID;
	document.body.appendChild(shadowHost);
	mountContent(shadowHost);
})();

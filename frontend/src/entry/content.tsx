import { createRoot } from "react-dom/client";
import tailwindCss from "../styles/index.css?inline"; // <- inline the tailwind styles as string
import { ROOT_CONTAINER_ID } from "../constant";
import { Extension } from "../extension/Extension";
import { isLocalhost } from "../utils/isLocalHost";

function mountContent(shadowHost: HTMLElement) {
	const shadowRoot = shadowHost.attachShadow({ mode: "open" });
	const style = document.createElement("style");
	let finalCss = "";

	/** 
	the variables have to be defined at the top layer for them to be accessible within the shadow dom 
	 */
	// const variables = tailwindCss.match(
	// 	/(:root,:host|:before,:after,::backdrop)\s*{[\s\S]*?}/g
	// );

	// if (variables) {
	// 	finalCss += variables.map((definition) => definition);
	// }
	finalCss += tailwindCss;

	// finalCss = finalCss
	// 	.replace(/(:root,:host|:before,:after,::backdrop)/g, ":host")
	// 	.replace(/,:host/g, ":host");

	style.textContent = finalCss;

	// console.log(style.textContent);

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

	// Inject Google Fonts link into the <head> of the main document
	const fontLink = document.createElement("link");
	fontLink.href =
		"https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap";
	fontLink.rel = "stylesheet";

	// Prevent duplicate injection
	if (
		![...document.head.querySelectorAll("link")].some(
			(link) => link.href === fontLink.href
		)
	) {
		document.head.appendChild(fontLink);
	}

	const shadowHost = document.createElement("div");
	shadowHost.id = ROOT_CONTAINER_ID;
	document.body.appendChild(shadowHost);
	mountContent(shadowHost);
})();

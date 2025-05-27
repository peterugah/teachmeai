import { createRoot } from "react-dom/client";
import tailwindCss from "../styles/index.css?inline"; // <- inline the tailwind styles as string
import { ROOT_CONTAINER_ID } from "../constant";
import { Extension } from "../extension/Extension";
import { isLocalhost } from "../utils/isLocalHost";

// the quirks of css required this function
function convertRemToPx(css: string, basePx = 16) {
	return css.replace(
		/([\d.]+)rem/g,
		(_, remVal) => `${parseFloat(remVal) * basePx}px`
	);
}

function mountContent(shadowHost: HTMLElement) {
	const shadowRoot = shadowHost.attachShadow({ mode: "open" });
	const style = document.createElement("style");
	style.textContent = convertRemToPx(tailwindCss);
	shadowRoot.appendChild(style);
	const extensionContainer = document.createElement("div");
	shadowRoot.appendChild(extensionContainer);
	createRoot(extensionContainer).render(<Extension />);
}

// NOTE: an IIFE is needed to execute the code immediately
(function () {
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
	shadowHost.style.fontSize = "16px";
	document.body.appendChild(shadowHost);
	mountContent(shadowHost);
})();

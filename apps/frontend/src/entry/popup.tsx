import { createRoot } from "react-dom/client";
import tailwindCss from "../styles/index.css?inline"; // <- inline the tailwind styles as string
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
	createRoot(extensionContainer).render(
		<div className="w-fit p-2 bg-neutral-500">
			<p>This is some content for the settings page</p>
		</div>
	);
}

(function () {
	if (isLocalhost()) {
		console.info("extension disabled in localhost :)");
		return;
	}
	const element = document.getElementById("root")!;
	mountContent(element);
})();

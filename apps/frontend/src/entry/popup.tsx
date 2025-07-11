import { createRoot } from "react-dom/client";
// this gives you the compiled CSS as a string:
import tailwindCss from "../styles/index.css?inline";

function injectGlobalStyles(css: string) {
	const style = document.createElement("style");
	style.textContent = css;
	document.head.appendChild(style);
}

injectGlobalStyles(tailwindCss);

import { Settings } from "../components/content/Settings";
const root = createRoot(document.getElementById("root")!);
root.render(<Settings />);

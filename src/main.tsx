import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { Extension } from "./extension/Extension";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui fugit
			reprehenderit sed tempora pariatur praesentium facilis eaque harum,
			nesciunt, fuga, soluta libero repellat delectus ratione nobis consectetur.
			Excepturi, hic quas!
		</p>
		<Extension />
	</StrictMode>
);

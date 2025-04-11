import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../index.css";
import { Index } from ".";
import { MemoryRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MemoryRouter>
			<Routes>
				<Route index element={<Index />} />
			</Routes>
		</MemoryRouter>
	</StrictMode>
);

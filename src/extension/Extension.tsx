import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Content } from "../components/content/Content";
import { Settings } from "../components/content/Settings";
import { Selection } from "../components/selection/Selection";
import { visibilityStore } from "../store/visibility";
import { ROOT_CONTAINER_ID } from "../constant";

export function Extension() {
	const { showSettings, position, showPopup } =
		visibilityStore.useVisibilityStore();
	const divRef = useRef<HTMLDivElement>(null);
	const [adjustedLeft, setAdjustedLeft] = useState<number>(position.left);

	const handleClickOutside = (event: MouseEvent) => {
		const extensionRootContainer = document.getElementById(ROOT_CONTAINER_ID);
		if (
			extensionRootContainer &&
			!extensionRootContainer.contains(event.target as Node)
		) {
			visibilityStore.setShowSettings(false);
			visibilityStore.setShowPopup(false);
		}
	};

	const handleEscapeKey = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			visibilityStore.setShowSettings(false);
			visibilityStore.setShowPopup(false);
		}
	};

	useLayoutEffect(() => {
		if (divRef.current) {
			const popupRect = divRef.current.getBoundingClientRect();
			const padding = 40;
			let newLeft = position.left + 5;
			const viewportWidth = window.innerWidth;
			const overflowX = newLeft + popupRect.width + padding > viewportWidth;
			if (overflowX) {
				newLeft = viewportWidth - popupRect.width - padding;
			}
			setAdjustedLeft(newLeft);
		}
	}, [position.left, position.top, showPopup, showSettings]);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscapeKey);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, []);

	return (
		<>
			<Selection />
			<div
				style={{
					top: `${position.top}px`,
					left: `${adjustedLeft}px`,
					position: "absolute",
				}}
				ref={divRef}
				className="text-black text-[16px] z-[9999999] w-80"
			>
				{showSettings && <Settings />}
				{showPopup && <Content />}
			</div>
		</>
	);
}

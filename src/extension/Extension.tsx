import { useLayoutEffect, useRef, useState } from "react";
import { Content } from "../components/content/Content";
import { Settings } from "../components/content/Settings";
import { Selection } from "../components/selection/Selection";
import { visibilityStore } from "../store/visibility";

export function Extension() {
	const { showSettings, position, showPopup } =
		visibilityStore.useVisibilityStore();
	const divRef = useRef<HTMLDivElement>(null);
	const [adjustedLeft, setAdjustedLeft] = useState<number | null>(null);

	useLayoutEffect(() => {
		if (divRef.current && (showPopup || showSettings)) {
			const popup = divRef.current;
			const popupRect = popup.getBoundingClientRect();
			const padding = 10;
			let newLeft = position.left + 5;

			const viewportWidth = window.innerWidth;
			const overflowX = newLeft + popupRect.width + padding > viewportWidth;

			if (overflowX) {
				newLeft = viewportWidth - popupRect.width - padding;
			}

			setAdjustedLeft(newLeft);
		}
	}, [position.left, position.top, showPopup, showSettings]);

	return (
		<>
			<Selection />
			<div
				style={{
					top: `${position.top}px`,
					left: `${adjustedLeft ?? position.left + 5}px`,
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

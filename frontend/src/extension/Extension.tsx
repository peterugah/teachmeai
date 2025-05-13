import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Content } from "../components/content/Content";
import { Settings } from "../components/content/Settings";
import { Selection } from "../components/selection/Selection";
import { visibilityStore } from "../store/visibility";
import { ROOT_CONTAINER_ID } from "../constant";
import { settingsStore } from "../store/settings";
import { Theme } from "../enums/theme";
import { searchStore } from "../store/search";
import { selectionStore } from "../store/selection";

export function Extension() {
	const { showSettings, position, showPopup } =
		visibilityStore.useVisibilityStore();

	const { theme, loggedIn, language } = settingsStore.useSettingsStore();

	const divRef = useRef<HTMLDivElement>(null);
	const [adjustedLeft, setAdjustedLeft] = useState<number>(position.left);

	const reRender = useMemo(() => {
		return showPopup || showSettings;
	}, [showPopup, showSettings]);
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
			console.log("cleared");
		};
	}, []);

	useEffect(() => {
		// NOTE: reset the content once any of this is not visible anymore
		if (!showPopup && !showSettings) {
			searchStore.resetStore();
		}
	}, [showPopup, showSettings]);

	useEffect(() => {
		const searchTerm = selectionStore.useSelectionStore.getState().searchTerm;
		const webPage = selectionStore.useSelectionStore.getState().webPage;
		if (searchTerm && webPage && loggedIn && reRender) {
			// request explanation
			searchStore.requestExplanation({
				userId: settingsStore.useSettingsStore.getState().id,
				context: webPage,
				searchTerm,
				language,
			});
			selectionStore.setSelection({});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loggedIn, reRender]);
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
				className={`text-black dark:text-neutral-200 text-[16px] z-[9999999] w-80 ${
					theme === Theme.Dark && "dark"
				}`}
			>
				{showPopup && <Content />}
				{showSettings && <Settings />}
			</div>
		</>
	);
}

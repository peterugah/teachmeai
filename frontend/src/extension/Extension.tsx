import { useEffect, useRef, useState } from "react";
import { Content } from "../components/content/Content";
import { Settings } from "../components/content/Settings";
import { Selection } from "../components/selection/Selection";
import { visibilityStore } from "../store/visibility";
import { settingsStore } from "../store/settings";
import { Theme } from "../enums/theme";
import { ROOT_CONTAINER_ID } from "../constant";
import { searchStore } from "../store/search";

type Position = { top: number; left: number };

export function Extension() {
	const { theme, language, id } = settingsStore.store();
	const divRef = useRef<HTMLDivElement>(null);
	const { showPopup, showSettings, showInfoIcon } = visibilityStore.store();
	const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
	const selectedText = useRef<string>("");
	const webPageContent = useRef<string>("");

	const normalizeText = (text: string): string =>
		text
			.replace(/[\n\r\t]+/g, " ")
			.replace(/\s+/g, " ")
			.trim();

	const isVisible = (el: HTMLElement): boolean => {
		const style = window.getComputedStyle(el);
		return (
			style.display !== "none" &&
			style.visibility !== "hidden" &&
			el.getAttribute("aria-hidden") !== "true"
		);
	};
	const getUniqueChunks = (text: string, seen: Set<string>): string[] => {
		return text
			.split(/(?<=[.!?])\s+(?=[A-Z])/g) // sentence-splitting regex
			.map((chunk) => normalizeText(chunk))
			.filter((chunk) => {
				if (seen.has(chunk) || chunk.length < 20) return false;
				seen.add(chunk);
				return true;
			});
	};
	const getWebPageContent = (selection: Selection) => {
		const anchorNode = selection.anchorNode;

		if (!anchorNode) return;

		let currentNode: Node | null =
			anchorNode.nodeType === Node.TEXT_NODE
				? anchorNode.parentElement
				: anchorNode;

		if (!currentNode) return;

		const seenChunks = new Set<string>();
		const contextBlocks: string[] = [];
		let totalWords = 0;

		const MAX_DEPTH = 15;
		const MAX_WORDS = 500;
		let depth = 0;

		while (
			currentNode &&
			currentNode.nodeName.toLowerCase() !== "body" &&
			depth < MAX_DEPTH &&
			totalWords < MAX_WORDS
		) {
			if (currentNode instanceof HTMLElement && isVisible(currentNode)) {
				const rawText = currentNode.innerText;
				const normalized = normalizeText(rawText);
				const uniqueChunks = getUniqueChunks(normalized, seenChunks);

				if (uniqueChunks.length > 0) {
					const joined = uniqueChunks.join(" ");
					contextBlocks.unshift(joined);
					totalWords += joined.split(" ").length;
				}
			}
			currentNode = currentNode.parentElement;
			depth++;
		}

		const collectedText = contextBlocks
			.filter((item) => item.trim() !== selectedText.current.trim())
			.join(" ");

		return collectedText || selectedText.current;
	};

	const isOutsideExtension = (e: MouseEvent) => {
		const root = document.getElementById(ROOT_CONTAINER_ID);
		return !(root && root.contains(e.target as Node));
	};

	const getSelectionDetails = () => {
		const selection = window.getSelection();
		if (!selection) {
			return undefined;
		}
		const text = selection.toString().trim();

		if (text.length < 3) {
			return undefined;
		}
		const range = selection.getRangeAt(0);
		const { top, left } = range.getBoundingClientRect();
		const node = range.commonAncestorContainer;
		const element =
			node.nodeType === Node.ELEMENT_NODE
				? (node as Element)
				: node.parentElement;

		return {
			selection,
			text,
			top,
			left,
			element,
			isCollapsed: selection.isCollapsed,
		};
	};

	function calculatePopupPosition(
		posX: number,
		posY: number,
		containerWidth: number,
		containerHeight: number
	): Position {
		const { innerWidth, innerHeight } = window;

		// Start by positioning the top-left corner at an offset from the cursor
		let left = posX;
		let top = posY;

		// If it would overflow to the right, move it leftward
		if (left + containerWidth > innerWidth) {
			left = posX - containerWidth;
		}
		// If that still overflows (e.g. very close to right edge), clamp
		left = Math.min(Math.max(0, left), innerWidth - containerWidth);

		// If it would overflow to the bottom, move it upward
		if (top + containerHeight > innerHeight) {
			top = posY - containerHeight;
		}
		// Clamp in case cursor is too close to bottom edge
		top = Math.min(Math.max(0, top), innerHeight - containerHeight);

		return { top, left };
	}

	const handleOnMouseUp = (e: MouseEvent) => {
		if (!isOutsideExtension(e)) {
			return undefined;
		}
		const response = getSelectionDetails();
		if (!response || !divRef.current) {
			return;
		}
		const { top, left, text } = response;
		visibilityStore.setShowPopup(false);
		visibilityStore.setShowSettings(false);
		// show the icon
		visibilityStore.setShowInfoIcon(true);
		// set the values
		webPageContent.current = getWebPageContent(response.selection) || "";
		selectedText.current = text;
		//
		const { left: positionLeft, top: positionTop } = calculatePopupPosition(
			left,
			top,
			0,
			0
		);
		setPosition({ left: positionLeft, top: positionTop });
	};

	const handleOnSelectionClick = (e: MouseEvent) => {
		if (!isOutsideExtension(e)) {
			return undefined;
		}
		const response = getSelection();
		if (!response) {
			return;
		}
		/** wait for the updates to happen on the dom, then change it here  */
		setTimeout(() => {
			if (response.isCollapsed) {
				visibilityStore.setShowPopup(false);
				visibilityStore.setShowInfoIcon(false);
				visibilityStore.setShowSettings(false);
			}
		}, 0);
	};

	const handleOnInfoIconClick = () => {
		// reset the store
		searchStore.resetStore();
		// set the visibility conditions
		visibilityStore.setShowPopup(true);
		visibilityStore.setShowInfoIcon(false);
		// calculate the position
		const { width, height } = divRef.current!.getBoundingClientRect();
		const { left, top } = calculatePopupPosition(
			position.left,
			position.top,
			width,
			height
		);
		setPosition({ left, top });
		// make the request
		searchStore.requestExplanation({
			context: webPageContent.current,
			language,
			searchTerm: selectedText.current,
			userId: id,
		});
	};

	useEffect(() => {
		document.addEventListener("mouseup", handleOnMouseUp);
		document.addEventListener("click", handleOnSelectionClick);

		return () => {
			document.removeEventListener("mouseup", handleOnMouseUp);
			document.removeEventListener("click", handleOnSelectionClick);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			style={{
				left: `${position.left}px`,
				top: `${position.top}px`,
				position: "absolute",
			}}
			ref={divRef}
			className={`w-80 text-black dark:text-neutral-200 text-[16px] z-[9999999] ${
				theme === Theme.Dark && "dark"
			}`}
		>
			{showPopup && <Content />}
			{showSettings && <Settings />}
			{showInfoIcon && <Selection onClick={handleOnInfoIconClick} />}
		</div>
	);
}

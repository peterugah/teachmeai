import { useEffect, useRef, useState } from "react";
import { Content } from "../components/content/Content";
import { Settings } from "../components/content/Settings";
import { visibilityStore } from "../store/visibility";
import { settingsStore } from "../store/settings";
import { Theme } from "../enums/theme";
import { ROOT_CONTAINER_ID } from "../constant";
import { searchStore } from "../store/search";
import { UserSelection } from "../components/selection/UserSelection";
import { ServiceWorkerMessageEvents } from "../enums/sw";
import { isLocalhost } from "../utils/isLocalHost";

type Position = { top: number; left: number };

export function Extension() {
	const { pendingRequest } = searchStore.store();
	const { theme, language, id, trigger, loggedIn } = settingsStore.store();
	const divRef = useRef<HTMLDivElement>(null);
	const { showPopup, showSettings, showInfoIcon } = visibilityStore.store();
	const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
	const selectedText = useRef<string>("");
	const webPageContent = useRef<string>("");
	const INFO_ICON_DIMENSION = 40;

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
		if (!selection || selection.rangeCount === 0) return undefined;
		const text = selection.toString().trim();
		if (text.length < 3) return undefined;

		const range = selection.getRangeAt(0);

		// Grab all the client rects for the range
		const rects = Array.from(range.getClientRects());
		let posX: number, posY: number;

		if (rects.length > 0) {
			// Use the last rect for "end of selection"
			const lastRect = rects[rects.length - 1];
			posX = lastRect.right;
			posY = lastRect.bottom;
		} else {
			// Fallback in case there's only one rect
			const { right, bottom } = range.getBoundingClientRect();
			posX = right;
			posY = bottom;
		}

		const node = range.commonAncestorContainer;
		const element =
			node.nodeType === Node.ELEMENT_NODE
				? (node as Element)
				: node.parentElement;

		return {
			selection,
			text,
			top: posY,
			left: posX,
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
			return;
		}
		const response = getSelectionDetails();
		if (!response || !divRef.current) {
			return;
		}
		const { top, left, text } = response;
		visibilityStore.setShowPopup(false);
		visibilityStore.setShowSettings(false);
		// show the icon
		if (trigger === "Icon") {
			visibilityStore.setShowInfoIcon(true);
		}
		// set the values
		webPageContent.current = getWebPageContent(response.selection) || "";
		selectedText.current = text;
		//
		const { left: positionLeft, top: positionTop } = calculatePopupPosition(
			left,
			top,
			INFO_ICON_DIMENSION,
			INFO_ICON_DIMENSION
		);
		//NOTE: save the content for retrieval later
		searchStore.setPendingRequest({
			context: webPageContent.current,
			language,
			searchTerm: selectedText.current,
		});

		setPosition({ left: positionLeft, top: positionTop });
	};

	const handleOnSelectionClick = (e: MouseEvent) => {
		if (!isOutsideExtension(e)) {
			return;
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

	const showExplanation = () => {
		// reset the store
		searchStore.resetStore();
		// set the visibility conditions
		visibilityStore.setShowPopup(true);
		visibilityStore.setShowInfoIcon(false);
	};

	const handleOnTriggerIconClick = () => {
		showExplanation();
		// calculate the position
		setTimeout(() => {
			const { width, height } = divRef.current!.getBoundingClientRect();
			const { left, top } = calculatePopupPosition(
				position.left,
				position.top,
				width - INFO_ICON_DIMENSION, // removing the info icon width,
				height
			);
			// get the scroll position
			const scrollTop =
				window.pageYOffset ||
				document.documentElement.scrollTop ||
				document.body.scrollTop;
			//
			const finalTop = top + scrollTop + 5; //  5 IS PADDING
			setPosition({ left, top: finalTop });

			if (loggedIn && pendingRequest) {
				searchStore.requestExplanation({
					...pendingRequest,
					userId: id,
				});
			}
		}, 0);
	};

	const handleChromeExtensionMessage = async ({
		type,
	}: {
		type: ServiceWorkerMessageEvents;
	}) => {
		if (type === ServiceWorkerMessageEvents.EXPLAIN_SELECTED_TEXT) {
			if (pendingRequest) {
				showExplanation();
				await searchStore.requestExplanation({ ...pendingRequest, userId: id });
			}
		}
	};
	useEffect(() => {
		if (isLocalhost()) {
			return;
		}
		chrome.runtime.onMessage.addListener(handleChromeExtensionMessage);
		return () => {
			chrome.runtime.onMessage.removeListener(handleChromeExtensionMessage);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pendingRequest]);

	useEffect(() => {
		document.addEventListener("mouseup", handleOnMouseUp);
		return () => {
			document.removeEventListener("mouseup", handleOnMouseUp);
		};
		// when the trigger value changes, we wan't this update
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trigger]);

	useEffect(() => {
		document.addEventListener("click", handleOnSelectionClick);
		return () => {
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
			{showInfoIcon && <UserSelection onClick={handleOnTriggerIconClick} />}
		</div>
	);
}

import { useEffect, useRef, useState } from "react";
import { ROOT_CONTAINER_ID } from "../../constant";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { visibilityStore } from "../../store/visibility";
import { settingsStore } from "../../store/settings";
import { Theme } from "../../enums/theme";
import { searchStore } from "../../store/search";

export function Selection() {
	const { position } = visibilityStore.useVisibilityStore();
	const { theme } = settingsStore.useSettingsStore();

	const selectedText = useRef("");
	const webPageContent = useRef("");
	const isSelectingText = useRef(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [showInfoIcon, setShowInfoIcon] = useState(false);

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

	const getWebPageContent = (selection: Selection | null) => {
		if (!selection) return;

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

		webPageContent.current = collectedText;
	};

	const isInsideExtension = (target: Node) => {
		const rootElement = document.getElementById(ROOT_CONTAINER_ID);
		return !!(rootElement && rootElement.contains(target));
	};

	const positionIcon = (rect: DOMRect, icon: HTMLElement) => {
		const pos = visibilityStore.getComponentPosition(
			rect,
			icon.offsetWidth,
			icon.offsetHeight
		);
		visibilityStore.setPosition(pos);
	};

	const handleOnMouseUp = (e: MouseEvent) => {
		const selection = window.getSelection();
		const text = selection?.toString().trim() || "";

		if (!text) {
			isSelectingText.current = false;
			return;
		}

		const range = selection!.getRangeAt(0);
		const rect = range.getBoundingClientRect();
		const node = range.commonAncestorContainer;
		const element =
			node.nodeType === Node.ELEMENT_NODE
				? (node as Element)
				: node.parentElement;

		if (!element || element.closest(`#${ROOT_CONTAINER_ID}`)) return;

		isSelectingText.current = true;
		setTimeout(() => (isSelectingText.current = false), 100);

		if (isInsideExtension(e.target as Node)) return;

		selectedText.current = text;
		setShowInfoIcon(true);
		visibilityStore.setShowPopup(false);
		visibilityStore.setShowSettings(false);

		setTimeout(() => {
			const icon = buttonRef.current;
			if (icon) positionIcon(rect, icon);
			getWebPageContent(selection);
		}, 0);
	};

	const handleOnWindowClick = (e: MouseEvent) => {
		setTimeout(() => {
			if (isSelectingText.current) return;

			const clickedTarget = e.target as Node;
			if (isInsideExtension(clickedTarget)) return;

			if (selectedText.current.trim().length > 0) {
				selectedText.current = "";
				setShowInfoIcon(false);
				window.getSelection()?.removeAllRanges();
			}
		}, 0);
	};

	const handleOnIconClick = () => {
		searchStore.requestExplanation({
			context: webPageContent.current,
			searchTerm: selectedText.current,
		});

		setShowInfoIcon(false);
		selectedText.current = "";
		window.getSelection()?.removeAllRanges();
		visibilityStore.setShowPopup(true);
		visibilityStore.setShowSettings(false);
	};

	useEffect(() => {
		document.addEventListener("mouseup", handleOnMouseUp);
		document.addEventListener("click", handleOnWindowClick);
		return () => {
			document.removeEventListener("mouseup", handleOnMouseUp);
			document.removeEventListener("click", handleOnWindowClick);
		};
	}, []);

	return showInfoIcon ? (
		<div className={`${theme === Theme.Dark && "dark"}`}>
			<button
				onClick={handleOnIconClick}
				ref={buttonRef}
				className="fixed z-50 cursor-pointer size-7 text-yellow bg-white shadow-md rounded-full flex items-center justify-center dark:text-red"
				style={{
					top: `${position.top}px`,
					left: `${position.left}px`,
					position: "absolute",
				}}
			>
				<InformationCircleIcon />
			</button>
		</div>
	) : null;
}

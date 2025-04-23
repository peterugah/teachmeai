import { useEffect, useRef, useState } from "react";
import { ROOT_CONTAINER_ID } from "../../constant";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { visibilityStore } from "../../store/visibility";
import { settingsStore } from "../../store/settings";
import { Theme } from "../../enums/theme";

export function Selection() {
	const { position } = visibilityStore.useVisibilityStore();
	const { theme } = settingsStore.useSettingsStore();
	const [showInfoIcon, setShowInfoIcon] = useState(false);

	const selectedText = useRef("");
	const buttonRef = useRef<HTMLButtonElement>(null);
	const isSelectingText = useRef(false);

	const getWebPageContent = (selection: Selection | null) => {
		if (!selection) {
			return;
		}
		const anchorNode = selection.anchorNode;
		if (!anchorNode) return;

		// Start from the selected node
		let currentNode: Node | null =
			anchorNode.nodeType === Node.TEXT_NODE
				? anchorNode.parentElement
				: anchorNode;

		if (!currentNode) return;

		const elements: HTMLElement[] = [];

		// Climb up to <body>, collecting elements
		while (currentNode && currentNode.nodeName.toLowerCase() !== "body") {
			if (currentNode instanceof HTMLElement) {
				elements.unshift(currentNode); // add to the beginning to reverse order
			}
			currentNode = currentNode.parentElement;
		}

		// Combine all collected innerText in top-down order
		const collectedText = elements.map((el) => el.innerText).join("\n");

		console.log("Collected Text Top to Bottom:", collectedText);
	};

	const handleOnMouseUp = (e: MouseEvent) => {
		const selection = window.getSelection();
		const text = selection?.toString().trim() || "";

		getWebPageContent(selection);

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

		if (!element) return;
		if (element.closest(`#${ROOT_CONTAINER_ID}`)) return;

		isSelectingText.current = true;

		// Allow time for the click to register the flag
		setTimeout(() => {
			isSelectingText.current = false;
		}, 100); // <-- longer delay (100ms) gives click time to react

		const rootElement = document.getElementById(ROOT_CONTAINER_ID);
		// if selection is inside the extension, do nothing
		if (rootElement && rootElement.contains(e.target as Node)) {
			return;
		}

		selectedText.current = text;
		setShowInfoIcon(true);
		visibilityStore.setShowPopup(false);
		visibilityStore.setShowSettings(false);

		setTimeout(() => {
			const icon = buttonRef.current;
			if (icon) {
				const pos = visibilityStore.getComponentPosition(
					rect,
					icon.offsetWidth,
					icon.offsetHeight
				);
				visibilityStore.setPosition(pos);
			}
		}, 0);
	};

	const handleOnWindowClick = (e: MouseEvent) => {
		// Delay just slightly to ensure mouseup completes
		setTimeout(() => {
			if (isSelectingText.current) {
				return; // click right after highlight — skip it
			}
			const rootElement = document.getElementById(ROOT_CONTAINER_ID);
			const clickedTarget = e.target as Node;
			const isClickOutsideExtension =
				rootElement && !rootElement.contains(clickedTarget);
			const hasSelection = selectedText.current.trim().length > 0;

			if (isClickOutsideExtension && hasSelection) {
				console.log("outside extension content....");
				selectedText.current = "";
				setShowInfoIcon(false);
				window.getSelection()?.removeAllRanges();
			}
		}, 0);
	};

	const handleOnIconClick = () => {
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
				className={`dark:text-red fixed z-50 cursor-pointer size-7 text-yellow bg-white shadow-md rounded-full flex items-center justify-center`}
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

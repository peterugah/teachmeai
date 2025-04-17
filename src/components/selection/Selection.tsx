import { useEffect, useRef, useState } from "react";
import { ROOT_CONTAINER_ID } from "../../constant";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { visibilityStore } from "../../store/visibility";

export function Selection() {
	const { position } = visibilityStore.useVisibilityStore();
	const [showInfoIcon, setShowInfoIcon] = useState(false);

	const selectedText = useRef("");
	const buttonRef = useRef<HTMLButtonElement>(null);
	const isSelectingText = useRef(false);

	const handleMouseUp = () => {
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

		if (!element) return;
		if (element.closest(`#${ROOT_CONTAINER_ID}`)) return;

		isSelectingText.current = true;

		// Allow time for the click to register the flag
		setTimeout(() => {
			isSelectingText.current = false;
		}, 100); // <-- longer delay (100ms) gives click time to react

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

	const handleClick = (e: MouseEvent) => {
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
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("click", handleClick);
		};
	}, []);

	return showInfoIcon ? (
		<button
			onClick={handleOnIconClick}
			ref={buttonRef}
			className="fixed z-50 cursor-pointer size-7 text-black bg-white shadow-md rounded-full flex items-center justify-center"
			style={{
				top: `${position.top}px`,
				left: `${position.left}px`,
				position: "absolute",
			}}
		>
			<InformationCircleIcon />
		</button>
	) : null;
}

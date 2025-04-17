import { useEffect, useRef, useState } from "react";
import { ROOT_CONTAINER_ID } from "../../constant";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { visibilityStore } from "../../store/visibility";

export function Selection() {
	const { position } = visibilityStore.useVisibilityStore();
	const [showInfoIcon, setShowInfoIcon] = useState(false);
	const skipClickEvent = useRef(false);

	const selectedText = useRef("");
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleShowInfoIcon = () => {
		//
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed) return;

		// prevent the click event from firing
		// NOTE: this has to come after if (!selection || selection.isCollapsed) return; else when there is no selection,it will set skipClickEvent to true
		skipClickEvent.current = true;
		console.log("firing... mouseup event");

		const text = selection.toString().trim();

		if (!text) return;

		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();
		const node = range.commonAncestorContainer;

		const element =
			node.nodeType === Node.ELEMENT_NODE
				? (node as Element)
				: node.parentElement;

		if (!element) return;

		const isInsideExtension = element.closest(`#${ROOT_CONTAINER_ID}`) !== null;
		if (isInsideExtension) return;

		selectedText.current = text;
		setShowInfoIcon(true);
		visibilityStore.setShowPopup(false);
		visibilityStore.setShowSettings(false);

		// Defer position setting until icon size is known
		setTimeout(() => {
			const icon = buttonRef.current;
			if (icon) {
				const iconWidth = icon.offsetWidth;
				const iconHeight = icon.offsetHeight;
				const position = visibilityStore.getComponentPosition(
					rect,
					iconWidth,
					iconHeight
				);
				visibilityStore.setPosition(position);
			}
		}, 0);
	};

	const removeInfoButton = (e: MouseEvent) => {
		if (skipClickEvent.current) {
			console.log("skipping click event...");
			skipClickEvent.current = false;
			return;
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
			console.log({
				isClickOutsideExtension,
				hasSelection: selectedText.current,
			});
		}
	};

	const handleOnClick = () => {
		// remove the highlight
		setShowInfoIcon(false);
		selectedText.current = "";
		window.getSelection()?.removeAllRanges();
		visibilityStore.setShowPopup(true);
		visibilityStore.setShowSettings(false);
	};

	useEffect(() => {
		document.addEventListener("click", removeInfoButton);
		document.addEventListener("mouseup", handleShowInfoIcon);

		return () => {
			document.removeEventListener("click", removeInfoButton);
			document.removeEventListener("mouseup", handleShowInfoIcon);
		};
	}, []);

	useEffect(() => {
		console.log({ skipClickEvent: skipClickEvent.current });
	}, [skipClickEvent]);

	return showInfoIcon ? (
		<button
			onClick={handleOnClick}
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

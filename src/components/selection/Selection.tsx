import { useEffect, useRef, useState } from "react";
import { ROOT_CONTAINER_ID } from "../../constant";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ElementDimensions, visibilityStore } from "../../store/visibility";

export function Selection() {
	const [show, setShow] = useState(false);
	const [selectedText, setSelectedText] = useState("");

	const [iconSize, setIconSize] = useState<ElementDimensions>({
		width: 0,
		height: 0,
	});

	const buttonRef = useRef<HTMLButtonElement>(null);

	const showInfoIcon = () => {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed) return;

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

		visibilityStore.setShowSettings(false);

		setSelectedText(text);
		setShow(true);

		// Defer position setting until icon size is known
		setTimeout(() => {
			const icon = buttonRef.current;
			if (icon) {
				const iconWidth = icon.offsetWidth;
				const iconHeight = icon.offsetHeight;
				setIconSize({ width: iconWidth, height: iconHeight });
				const position = visibilityStore.getComponentPosition(
					rect,
					iconWidth,
					iconHeight
				);
				visibilityStore.setPosition(position);
			}
		}, 1);
	};

	const removeInfoButton = (event: MouseEvent) => {
		const rootElement = document.getElementById(ROOT_CONTAINER_ID);
		const clickedTarget = event.target as Node;

		const isClickOutsideExtension =
			rootElement && !rootElement.contains(clickedTarget);
		const hasSelection = selectedText.trim().length > 0;

		if (isClickOutsideExtension && hasSelection) {
			// setShow(false);
			// setSelectedText("");
		}
	};

	const handleOnClick = () => {
		setShow(false);
		visibilityStore.setShowPopup(true);
	};

	useEffect(() => {
		document.addEventListener("mouseup", showInfoIcon);
		document.addEventListener("click", removeInfoButton);
		return () => {
			document.removeEventListener("mouseup", showInfoIcon);
			document.removeEventListener("click", removeInfoButton);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log({ show, selectedText, iconSize });
	}, [show, selectedText, iconSize]);

	return show ? (
		<button
			onClick={handleOnClick}
			ref={buttonRef}
			className="fixed z-50 cursor-pointer size-7 text-black bg-white shadow-md rounded-full flex items-center justify-center"
			style={{
				top: `${visibilityStore.useVisibilityStore.getState().position.top}px`,
				left: `${
					visibilityStore.useVisibilityStore.getState().position.left
				}px`,
				position: "absolute",
			}}
		>
			<InformationCircleIcon />
		</button>
	) : null;
}

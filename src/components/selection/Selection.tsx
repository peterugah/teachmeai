import { useEffect, useRef, useState } from "react";
import { ROOT_CONTAINER_ID } from "../../constant";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function Selection() {
	const [show, setShow] = useState(false);
	const [selectedText, setSelectedText] = useState("");
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const [iconSize, setIconSize] = useState({ width: 0, height: 0 });

	const buttonRef = useRef<HTMLButtonElement>(null);

	const getInfoIconPosition = (
		rect: DOMRect,
		iconWidth: number,
		iconHeight: number
	) => {
		const { innerWidth, innerHeight } = window;

		let top = rect.top + window.scrollY;
		let left = rect.left + window.scrollX;

		if (rect.right + iconWidth < innerWidth) {
			top += rect.height / 2 - iconHeight / 2;
			left = rect.right + window.scrollX;
		} else if (rect.bottom + iconHeight < innerHeight) {
			top = rect.bottom + window.scrollY;
			left += rect.width / 2 - iconWidth / 2;
		} else if (rect.top - iconHeight > 0) {
			top = rect.top + window.scrollY - iconHeight;
			left += rect.width / 2 - iconWidth / 2;
		} else {
			top += rect.height / 2 - iconHeight / 2;
			left = rect.left + window.scrollX - iconWidth;
		}

		return { top, left };
	};

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

		setSelectedText(text);
		setShow(true);

		// Defer position setting until icon size is known (handled in useEffect)
		setTimeout(() => {
			const icon = buttonRef.current;
			if (icon) {
				const iconWidth = icon.offsetWidth;
				const iconHeight = icon.offsetHeight;
				setIconSize({ width: iconWidth, height: iconHeight });
				const pos = getInfoIconPosition(rect, iconWidth, iconHeight);
				setPosition(pos);
			}
		}, 0);
	};

	const removeInfoButton = (event: MouseEvent) => {
		const rootElement = document.getElementById(ROOT_CONTAINER_ID);
		const clickedTarget = event.target as Node;

		if (rootElement && !rootElement.contains(clickedTarget)) {
			// setShow(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mouseup", showInfoIcon);
		document.addEventListener("click", removeInfoButton);
		return () => {
			document.removeEventListener("mouseup", showInfoIcon);
			document.removeEventListener("click", removeInfoButton);
		};
	}, []);

	useEffect(() => {
		console.log({ show, selectedText, iconSize });
	}, [show, selectedText, iconSize]);

	return show ? (
		<button
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

import { useEffect, useState } from "react";

interface TooltipButtonProps {
	icon: React.ReactNode;
	tooltipText?: string;
	showTooltip?: boolean;
	onClick: () => void;
	onHide?: () => void;
	hideAfter?: number; // in milliseconds
}
export const TooltipButton = ({
	tooltipText,
	icon,
	showTooltip = false,
	onClick,
	onHide,
	hideAfter,
}: TooltipButtonProps) => {
	const [visible, setVisible] = useState(showTooltip);

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;

		if (showTooltip) {
			setVisible(true);
			if (hideAfter) {
				timer = setTimeout(() => {
					setVisible(false);
					if (onHide) {
						onHide();
					}
				}, hideAfter);
			}
		} else {
			setVisible(false);
			if (onHide) {
				onHide();
			}
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [showTooltip, hideAfter, onHide]);

	return (
		<div className="relative inline-block">
			<button
				onClick={onClick}
				className="cursor-pointer text-gray-800 hover:text-black size-7 hover:bg-gray-100 p-1 rounded-[5px] dark:text-neutral-500 dark:hover:bg-neutral-500"
			>
				{icon}
			</button>
			<div
				className={`absolute top-full left-1/2 -translate-x-1/2 translate-y-2 bg-gray-800 dark:bg-white dark:text-neutral-800 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-10 transition-all duration-300 ease-in-out
          ${
						visible
							? "opacity-100 scale-100"
							: "opacity-0 scale-95 pointer-events-none"
					}`}
			>
				{tooltipText}
			</div>
		</div>
	);
};

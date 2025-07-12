import { XMarkIcon } from "@heroicons/react/20/solid";
export type NotificationType = "success" | "error";
interface NotificationProps {
	type: NotificationType;
	text: string;
	onClose: () => void;
}

export default function Notification({
	type,
	text,
	onClose,
}: NotificationProps) {
	const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
	const borderColor =
		type === "success" ? "border-green-400" : "border-red-400";
	const textColor = type === "success" ? "text-green-700" : "text-red-700";

	return (
		<div
			className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded-lg flex items-center justify-between shadow-sm`}
			role="alert"
		>
			<span className="flex-1 text-sm font-medium">{text}</span>
			<button
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onClose();
				}}
				className="ml-4 p-1 rounded-full hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
				aria-label="Close notification"
			>
				<XMarkIcon className="w-5 h-5" />
			</button>
		</div>
	);
}

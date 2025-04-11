import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export const AskMore = () => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const autoResize = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	const onInput = () => {
		autoResize();
	};

	return (
		<div className="mt-4 border border-gray-300 rounded-[15px] relative bg-gray-50">
			<textarea
				ref={textareaRef}
				placeholder="Ask more..."
				rows={1}
				onInput={onInput}
				className="w-full resize-none overflow-hidden p-4 pr-16 rounded-[15px] focus:outline-none"
			/>

			<button
				type="button"
				className="absolute cursor-pointer bottom-[8px] right-[8px] text-sm text-white border-gray-50 border-[1px] p-2 rounded-2xl bg-blue-500 hover:bg-blue-600 transition"
			>
				<PaperAirplaneIcon className="size-5" />
			</button>
		</div>
	);
};

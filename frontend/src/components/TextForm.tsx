import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

interface Props {
	onSubmit: () => void;
	placeholderText: string;
}
export function TextForm({ onSubmit, placeholderText }: Props) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const autoResize = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit();
	};

	const onInput = () => {
		autoResize();
	};

	return (
		<div className="mt-4 border-gray-300 rounded-[15px] relative bg-gray-100 dark:bg-neutral-800">
			<form onSubmit={handleOnSubmit}>
				<textarea
					spellCheck={true}
					ref={textareaRef}
					placeholder={placeholderText}
					rows={1}
					onInput={onInput}
					className="w-full resize-none overflow-hidden p-4 pr-16 rounded-[15px] focus:outline-none"
				/>

				<button
					type="submit"
					className="absolute cursor-pointer bottom-[8px] right-[8px] text-sm text-white border-gray-50 p-2 rounded-2xl bg-blue-500 hover:bg-blue-600 transition"
				>
					<PaperAirplaneIcon className="size-5" />
				</button>
			</form>
		</div>
	);
}

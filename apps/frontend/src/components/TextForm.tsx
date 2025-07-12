import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

interface Props {
	onSubmit: (question: string) => void;
	placeholderText: string;
	disabled: boolean;
}
export function TextForm({ onSubmit, placeholderText, disabled }: Props) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const autoResizeTextArea = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (textareaRef.current) {
			// don't process if what the user has provided is small
			if (textareaRef.current.value.length < 3) {
				return;
			}
			onSubmit(textareaRef.current.value);
			textareaRef.current.value = "";
			autoResizeTextArea();
		}
	};

	const onInput = () => {
		autoResizeTextArea();
	};

	return (
		<div className="mt-4 border-gray-300 rounded-[15px] relative bg-gray-100 dark:bg-neutral-800">
			<form onSubmit={handleOnSubmit}>
				<textarea
					disabled={disabled}
					spellCheck={true}
					ref={textareaRef}
					placeholder={placeholderText}
					rows={1}
					onInput={onInput}
					className="w-full resize-none overflow-hidden p-4 pr-16 rounded-[15px] focus:outline-none"
				/>

				<button
					disabled={disabled}
					type="submit"
					className="absolute cursor-pointer bottom-[8px] right-[8px] text-sm text-white border-gray-50 p-2 rounded-2xl bg-blue-500 hover:bg-blue-600 transition disabled:bg-neutral-400 disabled:cursor-default"
				>
					<PaperAirplaneIcon className="size-5" />
				</button>
			</form>
		</div>
	);
}

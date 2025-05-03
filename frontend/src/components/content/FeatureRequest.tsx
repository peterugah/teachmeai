import { useState } from "react";
import { TextForm } from "../../components/TextForm";

interface Props {
	onSubmit: () => void;
	placeholderText: string;
	onClick: (show: boolean) => void;
}
export function FeatureRequest({ onSubmit, placeholderText, onClick }: Props) {
	const [show, setShow] = useState(false);
	const handleOnClick = () => {
		setShow(!show);
		onClick(show);
	};
	return (
		<>
			<div className=" flex justify-center  mt-4">
				<button
					onClick={handleOnClick}
					className="cursor-pointer text-[12px] text-blue-600 hover:text-blue-700 transition-all underline decoration-dotted underline-offset-4 dark:text-blue-500 dark:hover:text-blue-600"
				>
					report bug / feature request / contact me 🙂
				</button>
			</div>
			{show && (
				<div className="">
					<TextForm onSubmit={onSubmit} placeholderText={placeholderText} />
				</div>
			)}
		</>
	);
}

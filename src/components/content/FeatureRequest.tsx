import { useState } from "react";
import { TextForm } from "../../components/TextForm";

interface Props {
	onSubmit: () => void;
	placeholderText: string;
}
export function FeatureRequest({ onSubmit, placeholderText }: Props) {
	const [show, setShow] = useState(false);
	return (
		<>
			<div className=" flex justify-center  mt-4">
				<button
					onClick={() => setShow(!show)}
					className="cursor-pointer text-[12px] text-blue-600 hover:text-blue-700 transition-all underline decoration-dotted underline-offset-4 "
				>
					feature request / contact me 🙂
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

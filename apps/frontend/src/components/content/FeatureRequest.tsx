import { useState } from "react";
import { TextForm } from "../../components/TextForm";
import { translationStore } from "../../store/translations";
import { settingsStore } from "../../store/settings";

interface Props {
	disabled: boolean;
	onClick: () => void;
	onSubmit: (report: string) => void;
}
export function FeatureRequest({ onSubmit, onClick, disabled }: Props) {
	const { language } = settingsStore.store();
	const [show, setShow] = useState(false);
	const handleOnClick = () => {
		onClick();
		setShow(!show);
	};
	return (
		<>
			<div className=" flex justify-center  mt-4">
				<button
					onClick={handleOnClick}
					className="cursor-pointer text-[12px] text-blue-600 hover:text-blue-700 transition-all underline decoration-dotted underline-offset-4 dark:text-blue-500 dark:hover:text-blue-600"
				>
					{translationStore.translate("reportBugAskForFeature", language)}
				</button>
			</div>
			{show && (
				<div className="">
					<TextForm
						disabled={disabled}
						onSubmit={onSubmit}
						placeholderText={translationStore.translate(
							"hearFromYou",
							language
						)}
					/>
				</div>
			)}
		</>
	);
}

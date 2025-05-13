import { useState } from "react";
import { TextForm } from "../../components/TextForm";
import { translationStore } from "../../store/translations";
import { settingsStore } from "../../store/settings";

interface Props {
	onSubmit: () => void;
	onClick: () => void;
}
export function FeatureRequest({ onSubmit, onClick }: Props) {
	const { language } = settingsStore.useSettingsStore();
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

import {
	// HandThumbUpIcon,
	DocumentDuplicateIcon,
	// SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { translationStore } from "../../store/translations";
import { settingsStore } from "../../store/settings";
import { TooltipButton } from "./TooltipButton";
import { useState } from "react";

interface SectionThreeInterface {
	onCopy: () => void;
	onLike: () => void;
	// onPlay: () => void;
}
export const SectionThree = ({
	// onLike,
	onCopy,
}: // onPlay,
SectionThreeInterface) => {
	const { language } = settingsStore.store();
	const [showCopyTooltip, setShowCopyTooltip] = useState(false);
	// const [showLikeTooltip, setShowLikeTooltip] = useState(false);

	// const handleOnLike = async () => {
	// 	await onLike();
	// 	setShowLikeTooltip(true);
	// };

	const handleOnCopy = () => {
		onCopy();
		setShowCopyTooltip(true);
	};

	// const handleOnPlay = () => {
	// 	onPlay();
	// };

	return (
		<div className="space-x-2 pt-2">
			{/* <TooltipButton
				onClick={handleOnLike}
				onHide={() => setShowLikeTooltip(false)}
				showTooltip={showLikeTooltip}
				hideAfter={1000}
				tooltipText={translationStore.translate("liked", language)}
				icon={<HandThumbUpIcon />}
			/> */}
			<TooltipButton
				onClick={handleOnCopy}
				onHide={() => setShowCopyTooltip(false)}
				showTooltip={showCopyTooltip}
				hideAfter={1000}
				tooltipText={translationStore.translate("copied", language)}
				icon={<DocumentDuplicateIcon />}
			/>
			{/* <TooltipButton onClick={handleOnPlay} icon={<SpeakerWaveIcon />} /> */}
		</div>
	);
};

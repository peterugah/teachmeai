import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { visibilityStore } from "../../store/visibility";
import { translationStore } from "../../store/translations";
import { settingsStore } from "../../store/settings";

export const Header = () => {
	const { language } = settingsStore.useSettingsStore();
	const handleShowSettings = () => {
		visibilityStore.setShowSettings(true);
		visibilityStore.setShowPopup(false);
	};

	const handleClosePopUp = () => {
		visibilityStore.setShowPopup(false);
	};
	return (
		<nav className="flex items-center justify-between">
			<button
				onClick={handleShowSettings}
				className="size-6 m-2 cursor-pointer text-gray-800 hover:text-black dark:text-neutral-500 dark:hover:text-neutral-300"
			>
				<Cog8ToothIcon />
			</button>
			<p className="font-bold dark:text-neutral-300">
				{translationStore.translate("logo", language)}
			</p>
			<button
				onClick={handleClosePopUp}
				className="size-7 m-2 cursor-pointer text-gray-800 hover:text-black  dark:text-neutral-500 dark:hover:text-neutral-300"
			>
				<XMarkIcon />
			</button>
		</nav>
	);
};

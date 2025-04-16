import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { settingsStore } from "../../store/settings";

export const Header = () => {
	const { showSettings } = settingsStore.useSettingsStore();

	const handleShowSettings = () => {
		settingsStore.setShowSettings(!showSettings);
	};
	return (
		<nav className="flex items-center justify-between border-b-[1px] border-gray-200">
			<button
				onClick={handleShowSettings}
				className="size-6 m-2 cursor-pointer text-gray-800 hover:text-black"
			>
				<Cog8ToothIcon />
			</button>
			<p className="font-bold">Logo</p>
			<button className="size-7 m-2 cursor-pointer text-gray-800 hover:text-black">
				<XMarkIcon />
			</button>
		</nav>
	);
};

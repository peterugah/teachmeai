import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { visibilityStore } from "../../store/visibility";

export const Header = () => {
	const handleShowSettings = () => {
		visibilityStore.setShowSettings(true);
		visibilityStore.setShowPopup(false);
	};

	const handleClosePopUp = () => {
		visibilityStore.setShowPopup(false);
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
			<button
				onClick={handleClosePopUp}
				className="size-7 m-2 cursor-pointer text-gray-800 hover:text-black"
			>
				<XMarkIcon />
			</button>
		</nav>
	);
};

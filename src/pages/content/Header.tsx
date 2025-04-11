import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/16/solid";

export const Header = () => {
	return (
		<nav className="flex items-center justify-between">
			<button className="size-6 m-2 cursor-pointer text-gray-800 hover:text-black">
				<Cog8ToothIcon />
			</button>
			<p>Logo</p>
			<button className="size-7 m-2 cursor-pointer text-gray-800 hover:text-black">
				<XMarkIcon />
			</button>
		</nav>
	);
};

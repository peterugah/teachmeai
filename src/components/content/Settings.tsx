import { useMemo, useState } from "react";
import { Language } from "../../enums/language";
import { searchStore } from "../../store/search";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { Theme } from "../../enums/theme";
import { settingsStore } from "../../store/settings";
import { visibilityStore } from "../../store/visibility";

export function Settings() {
	// const [hoveredStar, setHoveredStar] = useState<number | null>(null);
	const [searchFilter, setSearchFilter] = useState<string>("");
	const { language, theme } = settingsStore.useSettingsStore();

	const filteredPreviousSearches = useMemo(() => {
		return searchStore
			.getPreviousSearches()
			.filter(
				(item) =>
					item.title.includes(searchFilter.trim()) ||
					item.content.includes(searchFilter.trim())
			);
	}, [searchFilter]);

	const handleOnLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		settingsStore.setLanguage(e.target.value as Language);
	};

	const handleOnChangeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
		settingsStore.setTheme(e.target.value as Theme);
	};

	const handleOnSearchTermClick = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		e.preventDefault();
	};

	const handleOnBackClick = () => {
		visibilityStore.setShowSettings(false);
		visibilityStore.setShowPopup(true);
	};

	const renderLanguages = () => {
		return searchStore.getLanguages().map(([value, key]) => (
			<option key={key} value={key}>
				{value}
			</option>
		));
	};

	const renderPreviousSearches = () => {
		return filteredPreviousSearches.map((searchTerm) => {
			return (
				<li
					key={searchTerm.id}
					className="mb-2 w-full flex flex-col text-blue-700 hover:text-blue-800 hover:underline dark:text-blue-500 dark:hover:text-blue-600"
				>
					<a
						onClick={handleOnSearchTermClick}
						className="w-full"
						href={searchTerm.webPage}
					>
						{searchTerm.title}
					</a>
					<span className="text-[8px] text-gray-800 truncate dark:text-neutral-300">
						{searchTerm.webPage}
					</span>
				</li>
			);
		});
	};

	const renderThemeOptions = () => {
		return Object.values(Theme).map((theme) => {
			return (
				<option key={theme} value={theme}>
					{theme}
				</option>
			);
		});
	};

	return (
		<div className="bg-white border-[1px] border-gray-200 border-r-0 shadow-lg rounded-2xl dark:bg-neutral-950">
			<div className="border-b-[1px] border-gray-200 p-2 flex justify-between dark:border-neutral-700">
				<h1 className="font-bold dark:text-neutral-300">Settings</h1>
				<button
					onClick={handleOnBackClick}
					className="cursor-pointer text-gray-800 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300"
				>
					<ArrowUturnLeftIcon className="size-6 " />
				</button>
			</div>
			{/* Settings  */}
			<div className="flex flex-col gap-4 p-2">
				<div className="flex justify-between gap-2">
					<label className="text-gray-700 mr-5 dark:text-neutral-300">
						Theme
					</label>
					<div className="bg-red overflow-hidden w-full">
						<select
							className="w-full"
							value={theme}
							onChange={handleOnChangeTheme}
						>
							{renderThemeOptions()}
						</select>
					</div>
				</div>
				<div className="flex justify-between gap-2">
					<label className="text-gray-700 dark:text-neutral-300">
						Language
					</label>
					<div className="bg-red overflow-hidden w-full">
						<select
							className="w-full"
							value={language}
							onChange={handleOnLanguageChange}
						>
							{renderLanguages()}
						</select>
					</div>
				</div>
			</div>
			{/* History */}
			<div className="border-t-[1px] border-gray-200 p-2 dark:border-neutral-700">
				<h2 className="font-bold text-[12px] text-gray-700 dark:text-neutral-300">
					History
				</h2>
				<div className="mt-2">
					<input
						placeholder="Search..."
						type="text"
						className=" border-gray-700  rounded-2xl w-full px-2 dark:bg-neutral-800 bg-gray-100"
						onKeyUp={(e) => setSearchFilter(e.currentTarget.value)}
					/>
				</div>
				<div className="ml-2 mt-2 max-h-80 overflow-y-auto ">
					<ul>{renderPreviousSearches()}</ul>
				</div>
			</div>
			{/* Rating */}
			{/* <div className="border-t-[1px] border-gray-200 p-2">
				<h2 className="font-bold text-[12px] text-gray-700">Rate us</h2>
				<div className="mt-2 flex">
					{Array.from({ length: 5 }, (_, i) => i + 1).map((index) => (
						<StarIcon
							key={index}
							onMouseEnter={() => setHoveredStar(index)}
							onMouseLeave={() => setHoveredStar(null)}
							className={`cursor-pointer transition-colors ${
								hoveredStar !== null && index <= hoveredStar
									? "text-blue-500"
									: "text-gray-400"
							}`}
						/>
					))}
				</div>
			</div> */}
			{/* Login */}
			{/* TODO: once logged in show user profile instead */}
			{/* <div className="border-t-[1px] border-gray-200 p-2">
				<div className="my-2 flex justify-center items-center flex-col">
					<span className="text-[10px] mb-2 text-gray-600 ">
						Sync your work across multiple devices
					</span>
					<button className="cursor-pointer font-bold text-gray-700 hover:text-red-700">
						Login with Google
					</button>
				</div>
			</div> */}
		</div>
	);
}

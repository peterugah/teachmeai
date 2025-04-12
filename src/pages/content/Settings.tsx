import { useState } from "react";
import { Language } from "../../store/language";
import { searchStore } from "../../store/search";
import { StarIcon } from "@heroicons/react/24/outline";

export function Settings() {
	const languages = searchStore.getLanguages();
	const [language, setLanguage] = useState<Language>(Language.English);
	const [hoveredStar, setHoveredStar] = useState<number | null>(null);

	const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLanguage(e.target.value as Language);
	};

	const handleOnSearchTermClick = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		e.preventDefault();
	};

	const renderLanguages = () => {
		return languages.map((language) => (
			<option key={language} value={language}>
				{language}
			</option>
		));
	};

	const renderPreviousSearches = () => {
		return searchStore.getPreviousSearches().map((searchTerm) => {
			return (
				<li
					key={searchTerm.id}
					className="mb-2 w-full flex text-blue-600 hover:text-blue-700 hover:underline"
				>
					<a
						onClick={handleOnSearchTermClick}
						className="w-full"
						href={searchTerm.webPage}
					>
						{searchTerm.title}
					</a>
				</li>
			);
		});
	};

	return (
		<div className="max-w-sm mx-auto bg-white border-[1px] border-gray-200 border-r-0 shadow-lg w-60 overflow-hidden">
			<h1 className="font-bold border-b-[1px] border-gray-200 p-2">Settings</h1>
			{/* Settings  */}
			<div className="flex flex-col gap-4 p-2">
				<div className="flex justify-between gap-2">
					<label className="text-gray-700">Theme</label>
					<select>
						<option>one</option>
						<option>two</option>
						<option>three</option>
					</select>
				</div>
				<div className="flex justify-between gap-2">
					<label className="text-gray-700">Language</label>
					<select value={language} onChange={handleOnChange}>
						{renderLanguages()}
					</select>
				</div>
			</div>
			{/* Recent Search */}
			<div className="border-t-[1px] border-gray-200 p-2 ">
				<h2 className="font-bold text-[12px] text-gray-700">Recent search</h2>
				<div className="mt-2">
					<input
						placeholder="Search..."
						type="text"
						className="border-[1px] border-gray-200 focus:border-gray-300 rounded-[5px] w-full px-2"
					/>
				</div>
				<div className="ml-2 mt-2 max-h-50 overflow-y-auto">
					<ul>{renderPreviousSearches()}</ul>
				</div>
			</div>
			{/* Rating */}
			<div className="border-t-[1px] border-gray-200 p-2">
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
			</div>
			{/* Login */}
			{/* TODO: once logged in show user profile instead */}
			<div className="border-t-[1px] border-gray-200 p-2">
				<div className="my-2 flex justify-center items-center flex-col">
					<span className="text-[10px] mb-2 text-gray-600 ">
						Sync your work across multiple devices
					</span>
					<button className="cursor-pointer font-bold text-gray-700">
						Login with Google
					</button>
				</div>
			</div>
		</div>
	);
}

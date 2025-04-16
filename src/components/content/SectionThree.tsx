import {
	DocumentDuplicateIcon,
	HandThumbUpIcon,
	SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

export const SectionThree = () => {
	return (
		<div className="mt-4 flex items-center space-x-2">
			<button className="cursor-pointer text-gray-800 hover:text-black size-7 hover:bg-gray-100 p-1 rounded-[5px]">
				<HandThumbUpIcon />
			</button>
			<button className="cursor-pointer text-gray-800 hover:text-black size-7 hover:bg-gray-100 p-1 rounded-[5px]">
				<DocumentDuplicateIcon />
			</button>
			<button className="cursor-pointer text-gray-800 hover:text-black size-7 hover:bg-gray-100 p-1 rounded-[5px]">
				<SpeakerWaveIcon />
			</button>
		</div>
	);
};

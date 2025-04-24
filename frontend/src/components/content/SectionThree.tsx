import {
	DocumentDuplicateIcon,
	HandThumbUpIcon,
	SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

export const SectionThree = () => {
	return (
		<div className="space-x-2 pt-2">
			<button className="cursor-pointer text-gray-800 hover:text-black size-7 hover:bg-gray-100 p-1 rounded-[5px] dark:text-neutral-500 dark:hover:bg-neutral-500">
				<HandThumbUpIcon />
			</button>
			<button className="cursor-pointer text-gray-800 hover:text-black size-7 hover:bg-gray-100 p-1 rounded-[5px] dark:text-neutral-500 dark:hover:bg-neutral-500">
				<DocumentDuplicateIcon />
			</button>
			<button className="cursor-pointer text-gray-800 hover:text-black size-7 hover:bg-gray-100 p-1 rounded-[5px] dark:text-neutral-500 dark:hover:bg-neutral-500">
				<SpeakerWaveIcon />
			</button>
		</div>
	);
};

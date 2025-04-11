import {
	DocumentDuplicateIcon,
	HandThumbUpIcon,
	SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { Response } from "./Response";
import { SearchBaseContent } from "../../store/search";

export const SectionTwo = ({ title, content, type }: SearchBaseContent) => {
	return (
		<div className="mt-4">
			<h1 className={`font-bold mb-2`}>{title}</h1>
			<Response content={content} type={type} />
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
		</div>
	);
};

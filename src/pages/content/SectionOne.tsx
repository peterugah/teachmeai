import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { Response } from "./Response";
import { SearchBaseContent } from "../../store/search";

export const SectionOne = ({
	title,
	content,
	type,
}: Pick<SearchBaseContent, "content" | "title" | "type">) => {
	return (
		<div>
			<h1 className="font-bold mb-2">{title}</h1>
			<div className="flex items-center justify-between">
				<p className="truncate mr-4">
					<Response content={content} type={type} />
				</p>
				<button>
					<SpeakerWaveIcon className=" text-gray-800 hover:text-black size-7 cursor-pointer hover:bg-gray-100 p-1 rounded-[5px]" />
				</button>
			</div>
		</div>
	);
};

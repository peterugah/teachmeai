import { SpeakerWaveIcon } from "@heroicons/react/24/outline";

interface Props {
	title: string;
	content: string;
}
export const Pronunciation = ({ title, content }: Props) => {
	return (
		<div>
			<h1 className="font-bold mb-2">{title}</h1>
			<div className="flex items-center justify-between">
				<p className="truncate mr-4">{content}</p>
				<button>
					<SpeakerWaveIcon className=" text-gray-800 hover:text-black size-5 cursor-pointer" />
				</button>
			</div>
		</div>
	);
};

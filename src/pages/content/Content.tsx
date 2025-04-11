import {
	DocumentDuplicateIcon,
	HandThumbUpIcon,
	SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
interface Props {
	title: string;
	content: string;
}
export const Content = ({ title, content }: Props) => {
	return (
		<div className="mt-4">
			<h1 className={`font-bold mb-2`}>{title}</h1>
			<p>{content}</p>
			<div className="mt-4 flex items-center space-x-4">
				<button className="cursor-pointer text-gray-800 hover:text-black size-5">
					<HandThumbUpIcon />
				</button>
				<button className="cursor-pointer text-gray-800 hover:text-black size-5">
					<DocumentDuplicateIcon />
				</button>
				<button className="cursor-pointer text-gray-800 hover:text-black size-5">
					<SpeakerWaveIcon />
				</button>
			</div>
		</div>
	);
};

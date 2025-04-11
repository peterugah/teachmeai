import {
	DocumentDuplicateIcon,
	HandThumbUpIcon,
	SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
interface Props {
	title: string;
	content: string;
}
export const Content = ({ title, content }: Props) => {
	return (
		<div className="mt-4">
			<h1 className={`font-bold mb-2`}>{title}</h1>
			{/* <p>{content}</p> */}
			<ReactMarkDown
				components={{
					p: ({ children }) => <p className="text-blue-700 mb-2">{children}</p>,
				}}
				remarkPlugins={[remarkGfm]}
			>
				{content}
			</ReactMarkDown>
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

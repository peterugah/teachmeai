import { ResponseType } from "@shared/types";
import ReactMarkDown from "react-markdown";
interface Prop {
	content: string;
	type: ResponseType;
}
export const Response = ({ content, type }: Prop) => {
	return (
		<div className="flex flex-col">
			<div
				className={`${
					type === "user"
						? "bg-gray-100 w-auto rounded-[10px] justify-end p-2 dark:bg-neutral-800 dark:text-neutral-100 my-2"
						: ""
				}`}
			>
				<ReactMarkDown>{content}</ReactMarkDown>
			</div>
		</div>
	);
};

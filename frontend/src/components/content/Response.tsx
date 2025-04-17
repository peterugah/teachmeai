import ReactMarkDown from "react-markdown";
import { SearchBaseContent } from "../../store/search";

export const Response = ({
	content,
	type,
}: Pick<SearchBaseContent, "content" | "type">) => {
	return (
		<div
			className={`my-2 flex ${
				type === "user"
					? "bg-gray-100 w-auto rounded-2xl justify-end px-5 py-2 dark:bg-neutral-800 dark:text-neutral-100"
					: ""
			}`}
		>
			<ReactMarkDown>{content}</ReactMarkDown>
		</div>
	);
};

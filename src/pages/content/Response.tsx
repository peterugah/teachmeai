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
					? "bg-gray-50 w-auto rounded-2xl justify-end px-5 py-2"
					: ""
			}`}
		>
			<ReactMarkDown>{content}</ReactMarkDown>
		</div>
	);
};

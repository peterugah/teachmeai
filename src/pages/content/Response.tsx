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
					? "bg-gray-50 w-auto rounded-2xl justify-end"
					: "max-w-max" // Ensure the width is restricted to the content's width
			}`}
		>
			<ReactMarkDown>{content}</ReactMarkDown>
		</div>
	);
};

import ReactMarkDown from "react-markdown";
import { SearchBaseContent } from "../../store/search";

export const Response = ({
	content,
}: Pick<SearchBaseContent, "content" | "type">) => {
	return (
		<div className={`my-2 `}>
			<ReactMarkDown>{content}</ReactMarkDown>
		</div>
	);
};

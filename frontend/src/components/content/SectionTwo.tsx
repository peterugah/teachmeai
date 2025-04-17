import { Response } from "./Response";
import { SearchBaseContent } from "../../store/search";

export const SectionTwo = ({ title, content, type }: SearchBaseContent) => {
	return (
		<div className="mt-4">
			<h1 className={`font-bold mb-2`}>{title}</h1>
			<Response content={content} type={type} />
		</div>
	);
};

import { SectionTwo } from "./SectionTwo";
import { Header } from "./Header";
import { SectionOne } from "./SectionOne";
import { searchStore } from "../../store/search";
import { settingsStore } from "../../store/settings";
import { Response } from "./Response";
import { SectionThree } from "./SectionThree";
import { TextForm } from "../../components/TextForm";
import { FeatureRequest } from "./FeatureRequest";
import { useEffect, useMemo } from "react";

export function Content() {
	const { activeSearchTerm, activeWebPage } = searchStore.useSearchStore();
	const { language } = settingsStore.useSettingsStore();

	const { sectionOne, sectionTwo, responses } = useMemo(() => {
		return searchStore.getDetailsForSearchTerm(
			activeWebPage,
			activeSearchTerm,
			language
		);
	}, [activeSearchTerm, activeWebPage, language]);

	const sortedResponses = searchStore.sortByTimestamp(responses);

	useEffect(() => {
		console.log({ activeSearchTerm, activeWebPage });

		const response = searchStore.getDetailsForSearchTerm(
			activeWebPage,
			activeSearchTerm,
			language
		);
		console.log({ response });
	}, [activeSearchTerm, activeWebPage]);

	return (
		<div className="bg-white rounded-2xl dark:bg-neutral-900">
			<Header />
			{/* loading spinner */}
			{/* <div className=" flex items-center justify-center mt-7">
				<Spinner lightColor="grey-800" size={5} darkColor="" />
			</div> */}
			<div className="p-4">
				{sectionOne ? <SectionOne {...sectionOne} /> : ""}
				{sectionTwo ? <SectionTwo {...sectionTwo} /> : ""}
				{sortedResponses.map((response) => (
					<Response key={response.id} {...response} />
				))}
				<SectionThree />
				<TextForm onSubmit={() => {}} placeholderText="Ask more..." />
				<FeatureRequest
					onSubmit={() => {}}
					placeholderText="I'd like to hear from you :)"
				/>
			</div>
		</div>
	);
}

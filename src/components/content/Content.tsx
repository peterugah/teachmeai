import { SectionTwo } from "./SectionTwo";
import { Header } from "./Header";
import { SectionOne } from "./SectionOne";
import { searchStore } from "../../store/search";
import { settingsStore } from "../../store/settings";
import { Response } from "./Response";
import { SectionThree } from "./SectionThree";
import { TextForm } from "../../components/TextForm";
import { FeatureRequest } from "./FeatureRequest";

export function Content() {
	const searchTerm = "open";
	const webPage = "www.example.com";
	const { language } = settingsStore.useSettingsStore();

	const { sectionOne, sectionTwo, responses } =
		searchStore.getDetailsForSearchTerm(webPage, searchTerm, language);
	const sortedResponses = searchStore.sortByTimestamp(responses);

	return (
		<div className="bg-white rounded-2xl shadow-lg dark:bg-neutral-950">
			<Header />
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

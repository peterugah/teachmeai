import { SectionTwo } from "./SectionTwo";
import { Header } from "./Header";
import { SectionOne } from "./SectionOne";
import { searchStore } from "../../store/search";
import { settingsStore } from "../../enums/settings";
import { Response } from "./Response";
import { SectionThree } from "./SectionThree";
import { TextForm } from "../../components/TextForm";
import { FeatureRequest } from "./FeatureRequest";
import { Settings } from "./Settings";

export function Index() {
	const searchTerm = "open";
	const webPage = "www.example.com";
	const { language } = settingsStore.useSettingsStore();

	const { sectionOne, sectionTwo, responses } =
		searchStore.getDetailsForSearchTerm(webPage, searchTerm, language);
	const sortedResponses = searchStore.sortByTimestamp(responses);

	const { showSettings } = settingsStore.useSettingsStore();

	console.log({ language });
	return (
		<div className="flex items-start justify-center">
			{showSettings && (
				<div className="flex-shrink-0 mt-5">
					<Settings />
				</div>
			)}
			<div className="max-w-sm bg-white rounded-2xl shadow-lg">
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
		</div>
	);
}

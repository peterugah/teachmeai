import { AskMore } from "./AskMore";
import { SectionTwo } from "./SectionTwo";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SectionOne } from "./SectionOne";
import { searchStore } from "../../store/search";
import { settingsStore } from "../../store/settings";
import { Response } from "./Response";
import { SectionThree } from "./SectionThree";

export function Index() {
	const searchTerm = "open";
	const webPage = "www.example.com";
	const language = settingsStore.useSettingsStore.getState().language;
	const { sectionOne, sectionTwo, responses } =
		searchStore.getDetailsForSearchTerm(webPage, searchTerm, language);
	const sortedResponses = searchStore.sortByTimestamp(responses);

	return (
		<div className={`max-w-sm mx-auto bg-white rounded-2xl shadow-lg `}>
			<Header />
			<div className="p-4">
				{sectionOne ? <SectionOne {...sectionOne} /> : ""}
				{sectionTwo ? <SectionTwo {...sectionTwo} /> : ""}
				{sortedResponses.map((response) => (
					<Response key={response.id} {...response} />
				))}
				<SectionThree />
				<AskMore />
			</div>
			<Footer />
		</div>
	);
}

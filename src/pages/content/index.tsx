import { AskMore } from "./AskMore";
import { SectionTwo } from "./SectionTwo";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SectionOne } from "./SectionOne";
import { searchStore } from "../../store/search";
import { settingsStore } from "../../store/settings";
import { Response } from "./Response";

export function Index() {
	const language = settingsStore.useSettingsStore.getState().language;
	const sectionOne = searchStore.useSearchStore.getState().sectionOne;
	const sectionTwo = searchStore.useSearchStore.getState().sectionTwo;
	const response = searchStore.useSearchStore.getState().responses;
	const sortedResponses = response
		? searchStore.sortByTimestamp(response[language] || [])
		: [];

	return (
		<div className={`max-w-sm mx-auto bg-white rounded-2xl shadow-lg `}>
			<Header />
			<div className="p-4">
				{sectionOne ? (
					<SectionOne
						type={searchStore.getLanguageType(language, sectionOne)}
						title={searchStore.getLanguageTitle(language, sectionOne)}
						content={searchStore.getLanguageContent(language, sectionOne)}
					/>
				) : (
					""
				)}
				{sectionTwo ? (
					<SectionTwo
						timestamp={searchStore.getLanguageTimestamp(language, sectionTwo)}
						type={searchStore.getLanguageType(language, sectionTwo)}
						title={searchStore.getLanguageTitle(language, sectionTwo)}
						content={searchStore.getLanguageContent(language, sectionTwo)}
					/>
				) : (
					""
				)}
				{sortedResponses.map((response) => (
					<Response
						type={searchStore.getLanguageType(language, sectionTwo)}
						content={searchStore.getLanguageContent(language, {
							[language]: response,
						})}
					/>
				))}
				<AskMore />
			</div>
			<Footer />
		</div>
	);
}

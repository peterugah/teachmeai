import { AskMore } from "./AskMore";
import { SectionTwo } from "./SectionTwo";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SectionOne } from "./SectionOne";
import { searchStore } from "../../store/search";
import { settingsStore } from "../../store/settings";
import { Response } from "./Response";

export function Index() {
	const word = "open";
	const language = settingsStore.useSettingsStore.getState().language;
	const sectionOne = searchStore.useSearchStore.getState().sectionOne;
	const sectionTwo = searchStore.useSearchStore.getState().sectionTwo;
	const response = searchStore.useSearchStore.getState().responses;
	const sortedResponses = response
		? searchStore.sortByTimestamp(response[word][language] || [])
		: [];

	return (
		<div className={`max-w-sm mx-auto bg-white rounded-2xl shadow-lg `}>
			<Header />
			<div className="p-4">
				{sectionOne ? (
					<SectionOne
						type={searchStore.getLanguageType(language, word, sectionOne)}
						title={searchStore.getLanguageTitle(language, word, sectionOne)}
						content={searchStore.getLanguageContent(language, word, sectionOne)}
					/>
				) : (
					""
				)}
				{sectionTwo ? (
					<SectionTwo
						id={searchStore.getLanguageId(language, word, sectionTwo)}
						timestamp={searchStore.getLanguageTimestamp(
							language,
							word,
							sectionTwo
						)}
						type={searchStore.getLanguageType(language, word, sectionTwo)}
						title={searchStore.getLanguageTitle(language, word, sectionTwo)}
						content={searchStore.getLanguageContent(language, word, sectionTwo)}
					/>
				) : (
					""
				)}
				{sortedResponses.map((response) => (
					<Response
						key={searchStore.getLanguageId(language, word, {
							[word]: { [language]: response },
						})}
						type={searchStore.getLanguageType(language, word, {
							[word]: { [language]: response },
						})}
						content={searchStore.getLanguageContent(language, word, {
							[word]: { [language]: response },
						})}
					/>
				))}
				<AskMore />
			</div>
			<Footer />
		</div>
	);
}

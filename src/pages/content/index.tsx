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
	const word = "open";
	const webPage = "www.example.com";
	const language = settingsStore.useSettingsStore.getState().language;
	const sectionOne = searchStore.useSearchStore.getState().sectionOne;
	const sectionTwo = searchStore.useSearchStore.getState().sectionTwo;
	const response = searchStore.useSearchStore.getState().responses;
	const sortedResponses = response
		? searchStore.sortByTimestamp(response[webPage][word][language] || [])
		: [];

	return (
		<div className={`max-w-sm mx-auto bg-white rounded-2xl shadow-lg `}>
			<Header />
			<div className="p-4">
				{sectionOne ? (
					<SectionOne
						type={searchStore.getLanguageType(
							language,
							webPage,
							word,
							sectionOne
						)}
						title={searchStore.getLanguageTitle(
							language,
							webPage,
							word,
							sectionOne
						)}
						content={searchStore.getLanguageContent(
							language,
							webPage,
							word,
							sectionOne
						)}
					/>
				) : (
					""
				)}
				{sectionTwo ? (
					<SectionTwo
						id={searchStore.getLanguageId(language, webPage, word, sectionTwo)}
						timestamp={searchStore.getLanguageTimestamp(
							language,
							webPage,
							word,
							sectionTwo
						)}
						type={searchStore.getLanguageType(
							language,
							webPage,
							word,
							sectionTwo
						)}
						title={searchStore.getLanguageTitle(
							language,
							webPage,
							word,
							sectionTwo
						)}
						content={searchStore.getLanguageContent(
							language,
							webPage,
							word,
							sectionTwo
						)}
					/>
				) : (
					""
				)}
				{sortedResponses.map((response) => (
					<Response
						key={searchStore.getLanguageId(language, webPage, word, {
							[webPage]: { [word]: { [language]: response } },
						})}
						type={searchStore.getLanguageType(language, webPage, word, {
							[webPage]: { [word]: { [language]: response } },
						})}
						content={searchStore.getLanguageContent(language, webPage, word, {
							[webPage]: { [word]: { [language]: response } },
						})}
					/>
				))}
				<SectionThree />
				<AskMore />
			</div>
			<Footer />
		</div>
	);
}

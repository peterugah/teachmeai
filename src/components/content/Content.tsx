import { SectionTwo } from "./SectionTwo";
import { Header } from "./Header";
import { SectionOne } from "./SectionOne";
import { searchStore } from "../../store/search";
import { settingsStore } from "../../store/settings";
import { Response } from "./Response";
import { SectionThree } from "./SectionThree";
import { TextForm } from "../../components/TextForm";
import { FeatureRequest } from "./FeatureRequest";
import { Settings } from "./Settings";
import { visibilityStore } from "../../store/visibility";
import { useRef } from "react";

export function Content() {
	const searchTerm = "open";
	const webPage = "www.example.com";
	const { language } = settingsStore.useSettingsStore();
	const { showSettings, showPopup, position } =
		visibilityStore.useVisibilityStore();
	const divRef = useRef<HTMLDivElement>(null);

	const { sectionOne, sectionTwo, responses } =
		searchStore.getDetailsForSearchTerm(webPage, searchTerm, language);
	const sortedResponses = searchStore.sortByTimestamp(responses);

	if (!showPopup) {
		return null;
	}

	return (
		<div
			style={{
				top: `${position.top}px`,
				left: `${position.left + 5}px`,
				position: "absolute",
			}}
			ref={divRef}
			className="flex items-start justify-center text-black text-[16px] z-[9999999]"
		>
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

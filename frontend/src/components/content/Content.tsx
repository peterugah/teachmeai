import { Header } from "./Header";
import { SectionThree } from "./SectionThree";
import { TextForm } from "../../components/TextForm";
import { FeatureRequest } from "./FeatureRequest";
import { searchStore } from "../../store/search";
import { Response } from "./Response";
import { useRef } from "react";
import { translationStore } from "../../store/translations";
import { settingsStore } from "../../store/settings";

export function Content() {
	const { conversation, requestState } = searchStore.useSearchStore();
	const { language } = settingsStore.useSettingsStore();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const handleFeatureRequestClick = (show: boolean) => {
		if (show) {
			setTimeout(() => {}, 50);
		}
	};

	return (
		<div className="bg-white rounded-2xl dark:bg-neutral-900 pb-4">
			<Header />
			<div
				ref={scrollContainerRef}
				className="px-3 max-h-120 overflow-auto scrollbar-hidden"
			>
				{conversation.map((msg, i) => (
					<Response key={i} content={msg.content} type={msg.type} />
				))}
				{requestState === "loading" && (
					<span>{translationStore.translate("processing", language)}</span>
				)}
				<SectionThree />
				<TextForm
					onSubmit={searchStore.askQuestion}
					placeholderText={translationStore.translate("askMore", language)}
				/>
				<FeatureRequest
					onClick={handleFeatureRequestClick}
					onSubmit={() => {}}
				/>
			</div>
		</div>
	);
}

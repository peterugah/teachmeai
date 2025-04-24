import { Header } from "./Header";
import { SectionThree } from "./SectionThree";
import { TextForm } from "../../components/TextForm";
import { FeatureRequest } from "./FeatureRequest";
import { searchStore } from "../../store/search";
import { Response } from "./Response";

export function Content() {
	const { conversation, requestState } = searchStore.useSearchStore();

	return (
		<div className="bg-white rounded-2xl dark:bg-neutral-900 pb-4">
			<Header />
			<div className="px-3">
				{conversation.map((msg, i) => (
					<Response key={i} content={msg.content} type={msg.type} />
				))}
				{requestState === "loading" && <p>processing...</p>}
				<SectionThree />
				<TextForm
					onSubmit={searchStore.askQuestion}
					placeholderText="Ask more..."
				/>
				<FeatureRequest
					onSubmit={() => {}}
					placeholderText="I'd like to hear from you :)"
				/>
			</div>
		</div>
	);
}

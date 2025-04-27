import { Header } from "./Header";
import { SectionThree } from "./SectionThree";
import { TextForm } from "../../components/TextForm";
import { FeatureRequest } from "./FeatureRequest";
import { searchStore } from "../../store/search";
import { Response } from "./Response";
import { useLayoutEffect, useRef } from "react";

export function Content() {
	const { conversation, requestState } = searchStore.useSearchStore();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop =
				scrollContainerRef.current.scrollHeight;
		}
	}, [conversation, requestState]);

	return (
		<div className="bg-white rounded-2xl dark:bg-neutral-900 pb-4">
			<Header />
			<div ref={scrollContainerRef} className="px-3 max-h-100 overflow-auto">
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

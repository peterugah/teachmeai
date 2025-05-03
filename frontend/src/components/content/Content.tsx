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

	const setScrollContainerHeight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop =
				scrollContainerRef.current.scrollHeight;
		}
	};

	const handleFeatureRequestClick = (show: boolean) => {
		if (show) {
			setTimeout(() => {
				setScrollContainerHeight();
			}, 50);
		}
	};

	useLayoutEffect(() => {
		setScrollContainerHeight();
	}, [conversation, requestState]);

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
				{requestState === "loading" && <p>processing...</p>}
				<SectionThree />
				<TextForm
					onSubmit={searchStore.askQuestion}
					placeholderText="Ask more..."
				/>
				<FeatureRequest
					onClick={handleFeatureRequestClick}
					onSubmit={() => {}}
					placeholderText="I'd like to hear from you :)"
				/>
			</div>
		</div>
	);
}

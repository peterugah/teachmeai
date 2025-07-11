import { Header } from "./Header";
import { SectionThree } from "./SectionThree";
import { TextForm } from "../../components/TextForm";
import { FeatureRequest } from "./FeatureRequest";
import { searchStore } from "../../store/search";
import { Response } from "./Response";
import { useEffect, useRef } from "react";
import { translationStore } from "../../store/translations";
import { settingsStore } from "../../store/settings";
import { Login } from "../google/Login";
import { visibilityStore } from "../../store/visibility";
import removeMarkdown from "remove-markdown";

export function Content() {
	const { conversation, requestState } = searchStore.store();
	const { language, loggedIn } = settingsStore.store();
	const { showPopup } = visibilityStore.store();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const handleOnCopy = () => {
		const conversation = searchStore.store.getState().conversation;
		const content = conversation.reduce((a, convo) => {
			a += `${
				convo.type === "user"
					? `[${settingsStore.store.getState().firstName}]\n${new Date(
							convo.timestamp
						).toLocaleString()}\n`
					: `[AI]\n${new Date(convo.timestamp).toLocaleString()}\n`
			}${removeMarkdown(convo.content.trim().replace(/\n/g, ""))}\n\n`;
			return a;
		}, "");
		navigator.clipboard.writeText(content);
	};

	const handleFeatureRequestClick = () => {
		setTimeout(() => {
			const scrollContainer = scrollContainerRef.current;
			if (scrollContainer) {
				scrollContainer.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: "smooth",
				});
			}
		}, 50);
	};

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		const scrollHandler = () => {
			if (scrollContainer) {
				settingsStore.setLastContentScrollTopPosition(
					scrollContainer.scrollTop
				);
			}
		};
		if (scrollContainer) {
			scrollContainer.addEventListener("scroll", scrollHandler);
			return () => {
				if (scrollContainer) {
					scrollContainer.removeEventListener("scroll", scrollHandler);
				}
			};
		}
	}, []);

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (showPopup && scrollContainer) {
			scrollContainer.scrollTop =
				settingsStore.store.getState().lastContentScrollTopPosition;
		}
	}, [showPopup]);

	return (
		<div className="bg-white rounded-2xl dark:bg-neutral-900 pb-4 shadow dark:shadow-none">
			<Header />
			<div
				ref={scrollContainerRef}
				className="px-3 max-h-120 overflow-auto scrollbar-hidden"
			>
				{!loggedIn && <Login />}
				{conversation.map((msg, i) => (
					<Response key={i} content={msg.content} type={msg.type} />
				))}
				{requestState === "loading" && (
					<span>{translationStore.translate("processing", language)}</span>
				)}
				<SectionThree onCopy={handleOnCopy} onLike={() => {}} />
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

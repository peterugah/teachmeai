import { AskMore } from "./AskMore";
import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Pronunciation } from "./Pronunciation";

export function Index() {
	return (
		<div className={`max-w-sm mx-auto bg-white rounded-2xl shadow-lg `}>
			<Header />
			<div className="p-4">
				<Pronunciation
					title="Pronunciation"
					content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, fugit
				repudiandae vel aliquid amet saepe cum? Sapiente at, accusantium minus
				adipisci eaque nemo explicabo voluptatem tempore eligendi nobis dolorum
				harum."
				/>
				<Content
					title="Explanation"
					content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, fugit
				repudiandae vel aliquid amet saepe cum? Sapiente at, accusantium minus
				adipisci eaque nemo explicabo voluptatem tempore eligendi nobis dolorum
				harum."
				/>
				<AskMore />
			</div>
			<Footer />
		</div>
	);
}

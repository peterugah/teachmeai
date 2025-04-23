import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { Extension } from "./extension/Extension";
import { ROOT_CONTAINER_ID } from "./constant";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<p>
			But when they opposed him and blasphemed, he shook his garments and said
			to them, “Your blood be upon your own heads; I am clean. From now on I
			will go to the Gentiles.” And he departed from there and entered the house
			of a certain man named Justus, one who worshiped God, whose house was next
			door to the synagogue. Then Crispus, the ruler of the synagogue, believed
			on the Lord with all his household. And many of the Corinthians, hearing,
			believed and were baptized. a. But when they opposed him and blasphemed:
			The blasphemy must have been directed against Jesus, because Paul preached
			Jesus as the Messiah (testified to the Jews that Jesus is the Christ, Acts
			18:5). This is an indirect declaration of the deity of Jesus, because
			someone can only really blaspheme God.
		</p>
		<div id={ROOT_CONTAINER_ID}>
			<Extension />
		</div>
	</StrictMode>
);

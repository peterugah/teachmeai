import { useEffect, useState } from "react";
import { translationStore } from "../../store/translations";
import { settingsStore } from "../../store/settings";
import { isLocalhost } from "../../utils/isLocalHost";
import { ServiceWorkerMessageEvents } from "../../enums/sw";
import { GoogleAuthFlowResponse } from "@shared/types";
import { searchStore } from "../../store/search";

export const Login = () => {
	const { language, email } = settingsStore.store();
	const { pendingRequest } = searchStore.store();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const handleLoginResponse = async (response: GoogleAuthFlowResponse) => {
		if (response.success && response.userInfo) {
			setLoading(false);
			const user = await settingsStore.createUser({
				email: response.userInfo.email,
				firstName: response.userInfo.given_name,
				lastName: response.userInfo.family_name,
			});
			settingsStore.setUserDetails(user);
			settingsStore.setLoggedIn(true);
			// retry the last request
			if (pendingRequest) {
				await searchStore.requestExplanation({
					...pendingRequest,
					userId: user.id,
				});
			}
		} else {
			setError(true);
		}
	};

	const handleLogin = async () => {
		if (isLocalhost()) {
			setLoading(true);
			const user = await settingsStore.createUser({
				email: "demo@demo.com",
				firstName: "demo",
				lastName: "user",
			});
			settingsStore.setUserDetails(user);
			settingsStore.setLoggedIn(true);
			setLoading(false);
			if (pendingRequest) {
				await searchStore.requestExplanation({
					...pendingRequest,
					userId: user.id,
				});
			}
			return;
		}

		setLoading(true);
		chrome.runtime.sendMessage(
			{ type: ServiceWorkerMessageEvents.START_AUTH_FLOW },
			handleLoginResponse
		);
	};

	useEffect(() => {
		if (isLocalhost()) {
			return;
		}
		chrome.runtime.sendMessage(
			{ type: ServiceWorkerMessageEvents.CHECK_LOGIN_STATUS },
			(response) => settingsStore.setLoggedIn(response)
		);
	}, [email]);

	return (
		<div className="flex items-center justify-center flex-col">
			<div className="flex flex-col justify-center items-center gap-1 mb-4">
				<p>{translationStore.translate("hiThere", language)}</p>
				<p>{translationStore.translate("helpYou", language)}</p>
			</div>
			<button
				onClick={handleLogin}
				className="p-2 bg-blue-500 text-white rounded"
			>
				{translationStore.translate(
					loading ? "processing" : "loginWithGoogle",
					language
				)}
			</button>
			{error && (
				<p className="py-2 text-center text-red-700 dark:text-red-100">
					{translationStore.translate("loginErrorMessage", language)}
				</p>
			)}
		</div>
	);
};

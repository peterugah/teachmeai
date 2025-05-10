import { useEffect, useState } from "react";
import { translationStore } from "../../store/translations";
import { settingsStore } from "../../store/settings";

export const Login = () => {
	const { language } = settingsStore.useSettingsStore();
	const [loggedIn, setLoggedIn] = useState(false);

	// Check login status on mount
	useEffect(() => {
		chrome.runtime.sendMessage({ type: "CHECK_LOGIN_STATUS" }, (response) => {
			setLoggedIn(response?.loggedIn);
		});
	}, []);

	const handleLogin = () => {
		chrome.runtime.sendMessage({ type: "START_AUTH_FLOW" }, (response) => {
			if (response?.success) {
				console.log("Logged in with token:", response);
				setLoggedIn(true);
			} else {
				console.error("Login failed");
			}
		});
	};

	return (
		<div className="flex items-center justify-center flex-col">
			<div className="flex flex-col justify-center items-center gap-1 mb-4">
				<p>{translationStore.translate("hiThere", language)}</p>
				<p>{translationStore.translate("helpYou", language)}</p>
			</div>
			{loggedIn ? (
				<p>You are already logged in</p>
			) : (
				<button
					onClick={handleLogin}
					className="p-2 bg-blue-500 text-white rounded"
				>
					{translationStore.translate("loginWithGoogle", language)}
				</button>
			)}
		</div>
	);
};

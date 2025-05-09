import {
	CredentialResponse,
	GoogleLogin,
	GoogleOAuthProvider,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect, useState } from "react";
import { settingsStore } from "../../store/settings";
import { translationStore } from "../../store/translations";

interface LoggingWrapperProp {
	children: ReactNode;
}
const LoggingWrapper = ({ children }: LoggingWrapperProp) => {
	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			{children}
		</GoogleOAuthProvider>
	);
};

export const Login = () => {
	const [details, setDetails] = useState();
	const { language } = settingsStore.useSettingsStore();
	const handleOnSuccess = (e: CredentialResponse) => {
		if (e.credential) {
			console.log(jwtDecode(e.credential));
			setDetails(jwtDecode(e.credential));
			settingsStore.setLoggedIn(true);
		}
	};

	useEffect(() => {
		console.log({ details });
	}, [details]);

	return (
		<LoggingWrapper>
			<div className="flex items-center justify-center ">
				<div className="bg-white rounded-2xl dark:bg-neutral-900 flex flex-col items-center justify-center mx-auto p-8 gap-3 w-[220px]">
					<h1>{translationStore.translate("logInToContinue", language)}</h1>
					<GoogleLogin
						onSuccess={handleOnSuccess}
						onError={() => console.log("error")}
						shape="pill"
						auto_select={true}
						text="continue_with"
						size="medium"
						theme="filled_blue"
						width={80}
					/>
				</div>
			</div>
		</LoggingWrapper>
	);
};

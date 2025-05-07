import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export const Login = () => {
	const [details, setDetails] = useState();
	const handleOnSuccess = (e: CredentialResponse) => {
		if (e.credential) {
			setDetails(jwtDecode(e.credential));
		}
	};

	useEffect(() => {
		console.log({ details });
	}, [details]);

	return (
		<GoogleLogin
			onSuccess={handleOnSuccess}
			onError={() => console.log("error")}
			shape="pill"
			auto_select={true}
			text="continue_with"
			size="medium"
			theme="filled_blue"
			width={80}
		></GoogleLogin>
	);
};

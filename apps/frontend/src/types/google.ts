interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale?: string; // Optional, in case you request locale scope
}

export interface GoogleAuthFlowResponse {
  success: boolean;
  token?: string;
  userInfo?: GoogleUserInfo;
  error?: string;
}

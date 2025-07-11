import { Language } from "./languageEnum";

export type RequestState = "loading" | "error" | "done"

export type ResponseType = "user" | "ai";
export interface AskDto {
  userId: number;
  context: string;
  language: Language;
  searchTerm: string;
}
export interface ResponseDto {
  userId: number;
  askId: number;
  type: ResponseType;
  content: string;
}
export type AskType = "firstQuestion" | "continuation"


export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason: string;
  context: number[]
}

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

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  paying: boolean;
}
export type CreateUserDto = Omit<UserDto, "id" | "paying">
import { Language } from "./languageEnum";

export type RequestState = "loading" | "error" | "done"

export type ResponseType = "user" | "ai";
export interface AskDto {
  context: string;
  language: Language;
  searchTerm: string;
}
export interface ResponseDto {
  askId: number;
  type: ResponseType;
  content: string;
}
export type AskType = "firstQuestion" | "continuation"

export interface TranslationDto {
  key: string;
  value: string;
}

export interface TranslateDto {
  language: Language;
  translations: TranslationDto[];
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason: string;
  context: number[]
}
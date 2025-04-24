import { Language } from "./languageEnum";

export type RequestState = "loading" | "error" | "done"

export type ResponseType = "user" | "ai";
export interface SearchDto {
  context: string;
  language: Language;
  searchTerm: string;
}
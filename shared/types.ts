export type RequestState = "loading" | "error" | "done";
export type SearchType = "user" | "ai";

export interface SearchBaseContent {
  webPage: string;
  id: string;
  title: string;
  content: string;
  timestamp: number;
  type: SearchType;
}

export interface SearchSectionTwo extends SearchBaseContent {
  mainReference: boolean; // indicates which object is the user's main reference
}

export interface AskDto {
  webpageContent: string;
  searchTerm: string;
  language: string;
  translations: string[]; //the list of items to be translated
}
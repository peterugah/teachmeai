export type RequestState = "loading" | "error" | "done";
export type SearchType = "user" | "ai";

export interface SearchBaseContent {
  id: string;
  title: string;
  webPage: string;
  content: string;
  type: SearchType;
  timestamp: number;
}

export interface SearchSectionTwo extends SearchBaseContent {
  mainReference: boolean; // indicates which object is the user's main reference
}

export interface AskDto extends Omit<SearchBaseContent, "type" | "title"> {
  language: string;
  searchTerm: string;
  additionalContext: string[]; // exiting conversations between the user and the teach me
}
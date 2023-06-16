import { createContext } from "react";

export type WordsStateType = string[];
export type WordsContextType = [
    WordsStateType,
    React.Dispatch<React.SetStateAction<WordsStateType>>
];

export const WordsContext = createContext<WordsContextType | null>(null);

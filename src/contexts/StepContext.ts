import React, { createContext } from "react";

export type StepStateType = "SELECT" | "DROP";
export type StepContextType = [
    StepStateType,
    React.Dispatch<React.SetStateAction<StepStateType>>
];

export const StepContext = createContext<StepContextType | null>(null);

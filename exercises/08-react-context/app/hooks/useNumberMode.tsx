import { useContext, createContext } from "react";

const NumberModeContext = createContext("arabic");

export function useNumberMode() {
  return useContext(NumberModeContext);
}

export const NumberModeProvider = NumberModeContext.Provider;

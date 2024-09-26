"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { useWindowDimensions } from "@clientFunctions";
import { SearchResult } from "@types";

interface NavBarContextProps {
  searchFocused: boolean;
  setSearchFocused: (value: boolean) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  results: SearchResult | undefined;
  setResults: (value: SearchResult) => void;
  deleteResults: () => void;
  narrowScreen: boolean;
  handleBlur: () => void;
}

const NavBarContext = createContext<NavBarContextProps>(
  {} as NavBarContextProps
);

export const useNavBarContext = () => {
  return useContext(NavBarContext);
};

type NavBarContextProviderProps = {
  children: ReactNode;
};

export const NavBarContextProvider = ({
  children,
}: NavBarContextProviderProps) => {
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<SearchResult>(null);

  const deleteResults = () => {
    setResults(null);
    setSearchTerm("");
  };

  const handleBlur = () => {
    setSearchFocused(false);
    if (searchTerm.length === 0) {
      deleteResults();
    }
  };

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const narrowScreen = windowWidth! < 670;

  return (
    <NavBarContext.Provider
      value={{
        searchFocused,
        setSearchFocused,
        searchTerm,
        setSearchTerm,
        results,
        setResults,
        deleteResults,
        narrowScreen,
        handleBlur,
      }}
    >
      {children}
    </NavBarContext.Provider>
  );
};

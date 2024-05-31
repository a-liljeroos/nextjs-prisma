"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { useWindowDimensions } from "@functions";

interface NavBarContextProps {
  searchFocused: boolean;
  setSearchFocused: (value: boolean) => void;
  windowWidth: number;
  windowHeight: number;
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
  const handleBlur = () => {
    setSearchFocused(false);
  };
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const narrowScreen = windowWidth < 670;
  return (
    <NavBarContext.Provider
      value={{
        searchFocused,
        setSearchFocused,
        windowWidth,
        windowHeight,
        narrowScreen,
        handleBlur,
      }}
    >
      {children}
    </NavBarContext.Provider>
  );
};

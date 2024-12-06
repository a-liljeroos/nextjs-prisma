"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { useLocalStorage } from "@clientFunctions";

interface DocContextProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  closeFoldersTrigger: boolean;
  closeAllFolders: () => void;
  closeByClick: boolean;
  setCloseByClick: (value: boolean) => void;
}

const DocContext = createContext<DocContextProps>({} as DocContextProps);

export const useDocContext = () => {
  return useContext(DocContext);
};

type DocContextProviderProps = {
  children: ReactNode;
};

export const DocContextProvider = ({ children }: DocContextProviderProps) => {
  const [menuOpen, setMenuOpen] = useLocalStorage<boolean>("docMenu", true);
  const [closeByClick, setCloseByClick] = useLocalStorage<boolean>(
    "closeMenu",
    false
  );
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [closeFoldersTrigger, setCloseFoldersTrigger] =
    useState<boolean>(false);

  function closeAllFolders() {
    setCloseFoldersTrigger(!closeFoldersTrigger);
  }

  return (
    <DocContext.Provider
      value={{
        menuOpen,
        toggleMenu,
        closeFoldersTrigger,
        closeAllFolders,
        closeByClick,
        setCloseByClick,
      }}
    >
      {children}
    </DocContext.Provider>
  );
};

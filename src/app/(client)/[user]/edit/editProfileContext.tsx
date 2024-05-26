"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface EditProfileContextProps {
  toggleForms: (indexNo: number) => void;
  formList: EditProfileForm[];
}

const EditProfileContext = createContext<EditProfileContextProps>(
  {} as EditProfileContextProps
);

export const useEditProfileContext = () => {
  return useContext(EditProfileContext);
};

type EditProfileContextProviderProps = {
  children: ReactNode;
};

export type EditProfileForm = {
  open: boolean;
  indexNo: number;
};

export const EditProfileContextProvider = ({
  children,
}: EditProfileContextProviderProps) => {
  const [formList, setFormList] = useState<EditProfileForm[]>([
    { open: false, indexNo: 0 },
    { open: false, indexNo: 1 },
    { open: false, indexNo: 2 },
  ]);

  const toggleForms = (indexNo: number) => {
    const isOpen = formList[indexNo].open;
    setFormList(
      formList.map((form) => {
        if (isOpen) {
          return { ...form, open: false };
        } else {
          return form.indexNo === indexNo
            ? { ...form, open: true }
            : { ...form, open: false };
        }
      })
    );
  };
  return (
    <EditProfileContext.Provider
      value={{
        toggleForms,
        formList,
      }}
    >
      {children}
    </EditProfileContext.Provider>
  );
};

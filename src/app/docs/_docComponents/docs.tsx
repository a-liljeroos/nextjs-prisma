"use client";
import React from "react";
//import Link from "next/link";
import { useRouter } from "next/navigation";
// components
import { SlimFolderUS, SlimFolderLS } from "./slimFolder";
import GoBackButton from "@components/buttons/goBackButton";
import Button from "@components/buttons/Button";
import {
  CloseFoldersBtn,
  Color,
  Description,
  FreeText,
  FolderWrap,
  Introduction,
  Hr,
  Menu,
  Table,
  TitleText,
  type ColorProps,
} from "./docParts";
import MenuContents from "./menuContents";
import PageContainer from "@components/pageContainer/pageContainer";

// -----------------------------------------------------------

interface DocsProps {
  children: React.ReactNode;
  title?: string;
}

const Docs = ({ children, title }: DocsProps) => {
  const router = useRouter();

  function goRoot() {
    router.push("/docs");
  }

  return (
    <PageContainer>
      <header className="flex flex-col gap-3">
        <Menu
          boardItem={
            <div className="w-14">
              <GoBackButton />
            </div>
          }
        >
          <MenuContents />
        </Menu>
        <div className="p-3">
          <div className="flex flex-col items-baseline">
            <Button
              classBtn="transparent-button
            "
              tooltip="Go to root"
              click={goRoot}
            >
              <h1
                className={`text-2xl font-bold underline-offset-4 hover:text-backgroundSecondary hover:opacity-100 ${
                  title ? " text-lg opacity-40 -translate-x-2" : "underline"
                }`}
              >
                Documentation
              </h1>
            </Button>
            {title && <TitleText title={title} />}
          </div>
        </div>
      </header>
      <div className="p-4  flex flex-col">{children}</div>
    </PageContainer>
  );
};

// -----------------------------------------------------------

Docs.CloseFoldersBtn = CloseFoldersBtn;
Docs.Color = Color;
Docs.Description = Description;
Docs.Folder = SlimFolderUS;
Docs.FolderLocalStorage = SlimFolderLS;
Docs.FolderWrap = FolderWrap;
Docs.FreeText = FreeText;
Docs.Introduction = Introduction;
Docs.Hr = Hr;
Docs.Table = Table;

export default Docs;

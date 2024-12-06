"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useLocalStorage } from "@clientFunctions";
import { useDocContext } from "./docContext";
// icons
import { LuFolder } from "react-icons/lu";
import { LuFolderOpen } from "react-icons/lu";

type SlimFolderProps = {
  children: React.ReactNode;
  title: string;
};

/**
 * Slim folder component with useState open/close.
 * @param title - The title of the folder.
 * @param closeDisabled - Disable the close folder trigger. Default is false.
 * @param children - The content to be displayed inside the folder.
 *
 */

export const SlimFolderUS = ({
  title,
  children,
  closeDisabled = false,
}: SlimFolderProps & {
  closeDisabled?: boolean;
}) => {
  const [folderOpen, setFolderOpen] = useState<boolean>(false);
  const { closeFoldersTrigger } = useDocContext();

  useEffect(() => {
    if (closeDisabled !== true) {
      setFolderOpen(false);
    }
  }, [closeFoldersTrigger]);

  return (
    <SlimFolder
      folderOpen={folderOpen}
      setFolderOpen={setFolderOpen}
      title={title}
    >
      {children}
    </SlimFolder>
  );
};

/**
 * Slim folder component with local storage open/close state.
 * @param title - The title of the folder.
 * @param children - The content to be displayed inside the folder.
 *
 */

export const SlimFolderLS = ({ title, children }: SlimFolderProps) => {
  const [folderOpen, setFolderOpen] = useLocalStorage<boolean>(
    title.replace(" ", "_"),
    false
  );
  return (
    <SlimFolder
      folderOpen={folderOpen}
      setFolderOpen={setFolderOpen}
      title={title}
    >
      {children}
    </SlimFolder>
  );
};

const SlimFolder = ({
  title,
  children,
  folderOpen,
  setFolderOpen,
}: SlimFolderProps & {
  setFolderOpen: React.Dispatch<React.SetStateAction<boolean>>;
  folderOpen: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current && shadowRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const shadow = shadowRef.current;
      shadow.style.width = `${containerWidth}px`;
      shadow.style.height = `${containerHeight}px`;
    }
  }, [folderOpen]);

  return (
    <div>
      <div className="relative">
        <div
          ref={shadowRef}
          className="pattern-bg-shadow z-0 select-none rounded-lg pointer-events-none z-30"
        ></div>
      </div>
      <div
        ref={containerRef}
        className={`flex items-center gap-2 cursor-pointer pattern-bg py-2 px-2 select-none z-20   ${
          folderOpen ? "shadow-lg sticky top-20 rounded-t-lg " : " rounded-lg "
        }`}
        onClick={() => setFolderOpen(!folderOpen)}
      >
        <div
          className={`flex items-center gap-2 px-3 min-w-40 rounded-lg bg-neutral-800 ${
            folderOpen && " translate-x-2"
          }`}
        >
          <FolderButton
            click={() => setFolderOpen(!folderOpen)}
            folderOpen={folderOpen}
          />
          <h2 className={`text-l font-bold py-2 ${folderOpen && "underline"}`}>
            {title}
          </h2>
        </div>
      </div>
      {folderOpen && (
        <div className="flex flex-col fade-in p-2 rounded-b-lg bg-neutral-800 bg-gradient noise">
          {children}
        </div>
      )}
    </div>
  );
};

interface FolderButtonProps {
  click: () => void;
  folderOpen: boolean;
}

const FolderButton = ({ click, folderOpen }: FolderButtonProps) => {
  function handleClick() {
    click();
  }
  function ButtonIcon() {
    const styles = {
      color: folderOpen ? "rgb(199, 201, 80)" : "rgb(229 229 229)",
      size: 25,
    };
    return folderOpen ? <LuFolderOpen {...styles} /> : <LuFolder {...styles} />;
  }
  return (
    <button
      className="flex items-center gap-1 transparent-button"
      onClick={handleClick}
    >
      <ButtonIcon />
    </button>
  );
};

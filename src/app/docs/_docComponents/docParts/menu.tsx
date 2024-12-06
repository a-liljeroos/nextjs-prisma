"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// context
import { useDocContext } from "../docContext";
// components
import Button from "@components/buttons/Button";
// icons
import { IoMenu } from "react-icons/io5";

interface MenuProps {
  boardItem?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Menu component that provides a collapsible menu interface.
 *
 * @param {MenuProps} props - The properties for the Menu component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the menu.
 * @param {React.ReactNode} props.boardItem - The item to be displayed in the menu header.
 *
 * @returns {JSX.Element} The rendered Menu component.
 */

export const Menu = ({ children, boardItem }: MenuProps) => {
  const { menuOpen, toggleMenu } = useDocContext();
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
  }, []);
  return (
    <div className={`flex flex-col rounded-lg `}>
      <div className="relative">
        <div
          ref={shadowRef}
          className="pattern-bg-shadow select-none rounded-lg pointer-events-none z-50"
        ></div>
      </div>
      <div
        ref={containerRef}
        className={`sticky top-20 flex items-center gap-2 p-2 w-full pattern-bg rounded-b-lg z-40   ${
          menuOpen && " shadow-lg  "
        }`}
      >
        <div
          id="menu-board"
          className="flex items-center gap-1 rounded-lg px-2 py-1 min-w-40 bg-neutral-800/80 relative overflow-hidden"
        >
          <div
            id="menu-highlight"
            className="absolute transition w-full h-4 bg-neutral-200/40 -top-1 left-0 blur-lg z-60 select-none pointer-events-none mix-blend-lighten"
          />
          {boardItem}
          <div className="ml-2">
            <Button
              click={toggleMenu}
              classBtn="transparent-button"
              tooltip="Menu"
            >
              <IoMenu
                color={`${menuOpen ? "rgb(199, 201, 80)" : "rgb(229 229 229)"}`}
                size={30}
              />
            </Button>
          </div>
        </div>
      </div>
      <div
        className={`ml-2 mr-2 transition origin-top overflow-hidden bg-neutral-800 bg-gradient noise rounded-b-lg   ${
          menuOpen ? "p-4 border-b-2 border-neutral-800" : "scale-y-0 h-0"
        }`}
      >
        <CloseAfterClick />
        {children}
      </div>
    </div>
  );
};

const CloseAfterClick = () => {
  const { closeByClick, setCloseByClick } = useDocContext();
  return (
    <div
      role="button"
      id="cac-button"
      className="flex gap-2 items-center opacity-60 px-2 bg-neutral-800 rounded-b-md -translate-y-3 cursor-pointer"
      onClick={() => setCloseByClick(!closeByClick)}
    >
      <input
        type="checkbox"
        checked={closeByClick}
        onChange={() => setCloseByClick(!closeByClick)}
      />
      <span className="text-sm">Close after click</span>
    </div>
  );
};

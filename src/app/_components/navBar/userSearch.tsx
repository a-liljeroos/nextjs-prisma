"use client";
import React, { useRef, useEffect } from "react";
// context
import { useNavBarContext } from "./navBarContext";
// icons
import { BiSearchAlt } from "react-icons/bi";
// styles
import "./navBar.scss";

const UserSearch = () => {
  const inputContRef = useRef<HTMLLIElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    searchFocused,
    setSearchFocused,
    handleBlur,
    narrowScreen,
    windowWidth,
  } = useNavBarContext();
  useEffect(() => {}, [searchFocused]);

  const focusSearch = () => {
    if (inputRef.current) {
      if (!searchFocused) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  };

  const inputWidth = narrowScreen ? (searchFocused ? 300 : 40) : 300;
  const inputClassName = narrowScreen ? "nav-input-narrow" : "nav-input";
  const focusBg = narrowScreen ? "rgb(199, 201, 80)" : "rgb(248, 248, 248)";
  const inputBg = searchFocused ? "rgb(248, 248, 248)" : focusBg;
  const centerContainer = (windowWidth - inputWidth) / 2;
  const containerStyles: React.CSSProperties =
    searchFocused && narrowScreen
      ? {
          position: "absolute",
          left: centerContainer,
          transition: "0.2s",
        }
      : {};

  return (
    <li ref={inputContRef} style={containerStyles}>
      <div className="relative">
        <input
          name="search"
          ref={inputRef}
          type="text"
          placeholder=""
          autoCorrect="off"
          style={{
            paddingRight: 35,
            transition: "0.5s",
            width: inputWidth,
            zIndex: 20,
            backgroundColor: inputBg,
          }}
          className={`nav-search-input ${inputClassName}`}
          onFocus={() => setSearchFocused(true)}
          onBlur={handleBlur}
        />
        <BiSearchAlt
          color="rgb(61, 61, 61)"
          size={22}
          className="absolute user-select-none cursor-pointer"
          style={{ top: 10, right: 8 }}
          onClick={focusSearch}
        />
      </div>
    </li>
  );
};

const SearchResults = () => {
  const { searchFocused, setSearchFocused, windowHeight } = useNavBarContext();
  const searchResultsHeight = windowHeight - 80;
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: searchResultsHeight,
        backgroundColor: "black",
        opacity: 0.5,
        top: 80,
        zIndex: 10,
        backdropFilter: "blur(10px)",
      }}
    >
      Results
    </div>
  );
};

export { UserSearch, SearchResults };

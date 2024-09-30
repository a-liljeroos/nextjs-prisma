"use client";
import React, { useRef, useEffect } from "react";
// function
import { useDebounce, useWindowDimensions } from "@clientFunctions";
// fetch
import makeSearch from "./_fetch/makeSearch";
// context
import { useNavBarContext } from "./navBarContext";
// icons
import { BiSearchAlt } from "react-icons/bi";
// styles
import "./navBar.scss";

const Search = () => {
  const inputContRef = useRef<HTMLLIElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    searchFocused,
    setSearchFocused,
    searchTerm,
    setSearchTerm,
    setResults,
    handleBlur,
    narrowScreen,
  } = useNavBarContext();

  const { width: windowWidth } = useWindowDimensions();

  const handleChange = (term: string) => {
    if (term.length > 2) {
      makeSearch(term).then((reponse) => {
        setResults(reponse);
      });
    }
  };

  const debouncedChange = useDebounce(handleChange, 1000);

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
  const focusBg = narrowScreen
    ? "rgba(199, 201, 80, 0)"
    : "rgba(248, 248, 248, 0.5)";
  const inputBg = searchFocused ? "rgb(248, 248, 248)" : focusBg;
  const centerContainer = (windowWidth! - inputWidth) / 2;
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
          name="q"
          ref={inputRef}
          type="text"
          placeholder=""
          autoCorrect="off"
          value={searchTerm}
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
          onChange={(e) => {
            const term = e.target.value;
            setSearchTerm(term);
            debouncedChange(term);
          }}
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

export default Search;

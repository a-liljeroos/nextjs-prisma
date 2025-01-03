import React from "react";
import Link from "next/link";

/**
 * Detect and replace **LINK[]() patterns in the given string with <a> tags.
 * @param inputText The string to parse and replace.
 * @returns A JSX element with replaced <a> tags.
 */
export function parseLinks(inputText: string): (string | JSX.Element)[] {
  // Main function to parse and replace
  const parseAndReplace = (text: string): (string | JSX.Element)[] => {
    const linkPattern = /\*\*LINK\[(.*?)\]\((.*?)\)/g;
    const segments: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = linkPattern.exec(text)) !== null) {
      const linkText = match[1];
      const hyperlink = match[2];
      // Add the text before the match
      if (match.index > lastIndex) {
        segments.push(text.slice(lastIndex, match.index));
      }
      // Replace with <a> tag
      segments.push(createLinkElement(linkText || hyperlink, hyperlink));
      lastIndex = linkPattern.lastIndex;
    }

    // Add remaining text after the last match
    if (lastIndex < text.length) {
      segments.push(text.slice(lastIndex));
    }
    return segments;
  };

  return parseAndReplace(inputText);
}

/**
 * Create a JSX <a> element from the link text and hyperlink.
 * If linkText is empty, use the hyperlink as the text.
 * @param linkText The text to display for the link.
 * @param hyperlink The actual URL for the hyperlink.
 * @returns A JSX <a> element.
 */
function createLinkElement(linkText: string, hyperlink: string): JSX.Element {
  return (
    <Link
      href={hyperlink}
      target="_blank"
      rel="noopener ugc"
      className="underline"
    >
      {linkText}
    </Link>
  );
}

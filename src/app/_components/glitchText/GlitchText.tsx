"use client";
import React from "react";

// components
import Letter from "./Letter";

interface GlitchTextProps {
  text: string;
}

const GlitchText = ({ text }: GlitchTextProps) => {
  return (
    <div className="flex">
      {text.split("").map((letter, index) => (
        <span key={index}>
          <Letter letter={letter} />
        </span>
      ))}
    </div>
  );
};

export default GlitchText;

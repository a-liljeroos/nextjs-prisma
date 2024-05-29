"use client";
import React, { useState, useEffect, useRef } from "react";
// utils
import {
  delay,
  getRandomNumber,
  getRandomChar,
  getRandomArrayItem,
} from "@functions";
import { tailTornado } from "./tailTornado";
// styles
import "./Letter.scss";

interface LetterProps {
  letter: string;
}

const Letter = ({ letter, ...props }: LetterProps) => {
  const [classNames, setClassNames] = useState("");
  const delayStart = getRandomNumber(250, 700);
  useEffect(() => {
    const changeClass = async (rounds: number, effectDelay: number) => {
      setClassNames(tailTornado());
      await delay(getRandomNumber(250, 700));
      if (rounds > 0) {
        changeClass(rounds - 1, effectDelay + 50);
      }
      if (rounds === 0) {
        setClassNames("");
        await delay(getRandomNumber(15000, 25000));
        changeClass(getRandomNumber(2, 7), delayStart);
      }
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      changeClass(getRandomNumber(2, 7), delayStart);
    }
  }, []);

  if (letter === " " || letter === "") {
    return <div className={"letter-space " + classNames}></div>;
  }

  return (
    <div className="letter-wrapper">
      <div className={`letter ${classNames}`}>
        <LetterSpinner input={letter} />
      </div>
    </div>
  );
};

interface LetterSpinnerProps {
  input: string;
}

const LetterSpinner = ({ input }: LetterSpinnerProps) => {
  const [letter, setLetter] = useState<string>(input);

  const letterRef = useRef<HTMLDivElement>(null);
  const letters =
    "abcdefghijklmnopqrstuvwxyzäåöABCDEFGHIJKLMNOPQRSTUVWXYZÄÅÖ€$%&/=?!#*+-<>{}[]1234567890";
  const emotes = ["🤔", "😂", "😎", "💗", "🥳", "🤯", "🤪", "💩", "🐄", "🦴"];

  const delayStart = getRandomNumber(120, 250);

  const changeLetter = async (rounds: number, effectDelay: number) => {
    const random = Math.random();

    const animation = letterRef.current?.animate(
      [
        { transform: `translateY(-67px)`, opacity: 0 },
        { transform: `translateY(0px)`, opacity: 1 },
      ],
      {
        duration: effectDelay,
        easing: "ease-in-out",
        iterations: 1,
        fill: "forwards",
      }
    );
    animation?.pause();

    if (rounds === 0) {
      setLetter(input);
    } else {
      if (random < 0.05) {
        setLetter(getRandomArrayItem(emotes));
      } else {
        setLetter(getRandomChar(letters));
      }
    }
    animation?.play();

    await delay(effectDelay);
    animation?.finish();
    if (rounds > 0) {
      changeLetter(rounds - 1, effectDelay + 70);
    }
    if (rounds === 0) {
      setLetter(input);
      await delay(getRandomNumber(15000, 25000));

      changeLetter(getRandomNumber(2, 7), delayStart);
    }
  };

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      changeLetter(8, delayStart);
    }
  }, []);
  return (
    <div
      onClick={() => changeLetter(8, delayStart)}
      ref={letterRef}
      className="letter-spinner font-semibold hover:text-backgroundSecondary cursor-pointer"
    >
      {letter}
    </div>
  );
};

export default Letter;

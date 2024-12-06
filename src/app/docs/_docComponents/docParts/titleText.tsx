"use client";
import React, { useState, useEffect, useRef } from "react";
// functions
import { calculateEaseOutDelays } from "@clientFunctions";

export const TitleText = ({ title }: { title: string }) => {
  const titleArray = title.split("");
  const delays = calculateEaseOutDelays(titleArray, 0.2);
  const [anim, setAnim] = useState<boolean>(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setAnim(true);
    }, 20000);
  };

  useEffect(() => {
    titleRef.current?.animate(
      { transform: [`rotate(0deg)`, `rotate(5deg)`] },
      {
        duration: 150,
        easing: "ease-out",
        iterations: 1,
        fill: "forwards",
      }
    );
    startTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (anim) {
      titleRef.current?.animate(
        { transform: [`rotate(0deg)`, `rotate(5deg)`] },
        {
          duration: 150,
          easing: "ease-out",
          iterations: 1,
          fill: "forwards",
        }
      );
    } else {
      titleRef.current?.animate(
        { transform: [`rotate(5deg)`, `rotate(0deg)`] },
        {
          duration: 150,
          easing: "ease-out",
          iterations: 1,
          fill: "forwards",
        }
      );
      startTimer();
    }
  }, [anim]);

  return (
    <h1
      ref={titleRef}
      onClick={() => {
        if (anim) setAnim(false);
      }}
      className={`text-2xl font-bold pb-6 bg-neutral-700/50 shadow-lg z-10 w-1/2 origin-top-left `}
      style={{ fontSize: 30 }}
    >
      {titleArray.map((word, i) => {
        const delay = delays[i];
        return (
          <span
            key={i}
            className="transition cursor-default hover:text-backgroundSecondary"
            style={{
              animation: "renderIn forwards 0.5s",
              animationDelay: `${delay}s`,
            }}
          >
            {word}
          </span>
        );
      })}
    </h1>
  );
};

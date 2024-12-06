import React from "react";
// icons
import { ImArrowDown } from "react-icons/im";
// components
import { Method, type MethodProps } from "./method";
import { Path } from "./path";

interface InteractionMapProps {
  path: string;
  method: MethodProps["method"];
  kids: [React.ReactNode, React.ReactNode];
}

export const InteractionMap = ({ method, path, kids }: InteractionMapProps) => {
  return (
    <div className="flex flex-col w-full p-2 rounded-lg bg-neutral-700 noise">
      {kids[0]}
      <div className="flex flex-col items-center justify-center gap-4 py-3 px-2">
        <div className="flex items-center justify-center relative z-10">
          <div className="flex z-10 bg-neutral-600 py-2 px-8 rounded-lg shadow-lg">
            <span className="font-bold pr-1">{method}</span>
            <Path path={path} displayTitle={false} />
          </div>
          <div className="absolute top-8">
            <ImArrowDown size={45} className="text-backgroundSecondary" />
          </div>
        </div>
      </div>
      <div>{kids[1]}</div>
    </div>
  );
};

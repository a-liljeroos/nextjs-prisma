import { getRandomArrayItem } from "@functions";

interface Styles {
  appearance: number;
  styles: string[];
}

const bgColors: Styles = {
  appearance: 0.2,
  styles: [
    "bg-blue-100",
    "bg-blue-500",
    "bg-green-100",
    "bg-green-300",
    "bg-green-500",
    "bg-indigo-100",
    "bg-indigo-300",
    "bg-indigo-500",
    "bg-pink-100",
    "bg-pink-300",
    "bg-pink-500",
    "bg-purple-100",
    "bg-purple-300",
    "bg-purple-500",
    "bg-red-100",
    "bg-red-300",
    "bg-red-500",
    "bg-yellow-100",
    "bg-yellow-300",
    "bg-yellow-500",
  ],
};

const textColors: Styles = {
  appearance: 0.5,
  styles: [
    "text-blue-100",
    "text-blue-300",
    "text-blue-500",
    "text-green-100",
    "text-green-300",
    "text-green-500",
    "text-indigo-100",
    "text-indigo-300",
    "text-indigo-500",
    "text-pink-100",
    "text-pink-300",
    "text-pink-500",
    "text-purple-100",
    "text-purple-300",
    "text-purple-500",
    "text-red-100",
    "text-red-300",
    "text-red-500",
    "text-yellow-100",
    "text-yellow-300",
    "text-yellow-500",
  ],
};

const textDecorations: Styles = {
  appearance: 0.4,
  styles: ["line-through", "underline", "overline"],
};

const textDecorationStyle: Styles = {
  appearance: 0.2,
  styles: ["decoration-double", "decoration-dashed", "decoration-wavy"],
};

const textTransfrom: Styles = { appearance: 0.4, styles: ["uppercase"] };

const borderRadius: Styles = {
  appearance: 0.2,
  styles: [
    "rounded-tl-lg",
    "rounded-tr-lg",
    "rounded-bl-lg",
    "rounded-br-lg",
    //"rounded-full",
  ],
};

const borders: Styles = {
  appearance: 0.3,
  styles: ["border-t-2", "border-r-2", "border-b-2", "border-l-2"],
};

const skew: Styles = { appearance: 0.1, styles: ["skew-x-6", "skew-y-6"] };

const rotate: Styles = {
  appearance: 0.1,
  styles: ["rotate-180"],
};

const htmlEmotes = {
  appearance: 0.1,
  styles: ["🤔", "😂", "😎", "🤩", "🥳", "🤯", "🤪", "🤓"],
};

const fontStyle: Styles = {
  appearance: 0.1,
  styles: ["italic", "not-italic"],
};

const fontFamily: Styles = {
  appearance: 0.1,
  styles: ["font-sans", "font-serif", "font-mono"],
};

const customStyles: Styles = {
  appearance: 0.1,
  styles: [
    "g1",
    "g2",
    "g3",
    "g4",
    "g5",
    "g6",
    "g7",
    "g8",
    "g9",
    "g10",
    "g11",
    "g12",
    "g13",
    "g14",
  ],
};

const styles = [
  fontFamily,
  fontStyle,
  //rotate,
  //skew,
  borders,
  borderRadius,
  textDecorationStyle,
  textDecorations,
  textTransfrom,
  textColors,
  bgColors,
  customStyles,
];

export const tailTornado = () => {
  let stylesToApply = "";
  for (const style of styles) {
    const random = Math.random();
    if (random < style.appearance) {
      stylesToApply += getRandomArrayItem(style.styles) + " ";
    }
  }
  return stylesToApply;
};

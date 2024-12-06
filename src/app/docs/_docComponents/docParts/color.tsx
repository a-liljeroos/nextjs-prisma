export interface ColorProps {
  color?:
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "purple"
    | "pink"
    | "orange"
    | "amber"
    | "emerald";
}

/**
 *
 * @param color - color.
 * @returns color class.
 */

export const Color = ({ color }: ColorProps) => {
  const colors = {
    red: "bg-red-900/30",
    green: "bg-green-900/30",
    blue: "bg-blue-900/30",
    yellow: "bg-yellow-900/30",
    purple: "bg-purple-900/30",
    pink: "bg-pink-900/30",
    orange: "bg-orange-900/30",
    amber: "bg-amber-900/30",
    emerald: "bg-emerald-900/30",
  };

  const colorClass = color ? colors[color] : "";

  return colorClass;
};

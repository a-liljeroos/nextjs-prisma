import React from "react";
import "./button.scss";

interface ButtonProps {
  classContainer?: string;
  text?: string;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  classBtn?: string;
  children?: React.ReactNode;
  tooltip?: string;
  classTooltip?: string;
  click?: () => void;
}

/**
 * Button component that renders a button with optional text, children, and tooltip.
 *
 * @param {string} classContainer - Additional classes for the container div.
 * @param {string} text - Text to be displayed inside the button.
 * @param {string} classBtn - Additional classes for the button element.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} buttonProps - Additional properties for the button element.
 * @param {React.ReactNode} children - Child elements to be rendered inside the button.
 * @param {() => void} click - Click event handler for the button.
 * @param {string} tooltip - Text to be displayed inside the tooltip.
 * @param {string} classTooltip - Additional classes for the tooltip element.
 *
 * @returns {JSX.Element} The rendered Button component.
 */

const Button = ({
  classContainer,
  text,
  classBtn,
  buttonProps,
  children,
  click,
  tooltip,
  classTooltip,
}: ButtonProps) => {
  return (
    <div className={`tooltip-trigger ${classContainer}`}>
      <div className="relative max-w-min">
        <button
          {...buttonProps}
          onClick={click}
          className={`p-4 flex items-center justify-center text-nowrap ${classBtn}`}
        >
          {text && text}
          {children && children}
        </button>
        {tooltip && <ToolTip text={tooltip} classTooltip={classTooltip} />}
      </div>
    </div>
  );
};

export default Button;

const ToolTip = ({
  text,
  classTooltip,
}: {
  text: string;
  classTooltip?: string;
}) => {
  return (
    <div
      className={`px-2 text-sm text-nowrap text-black bg-neutral-200 rounded-md opacity-0 absolute top-2 left-full shadow-lg tooltip ${classTooltip}`}
    >
      {text}
      <div className="relative bg-neutral-200">
        <div className="tooltip-handle"></div>
      </div>
    </div>
  );
};

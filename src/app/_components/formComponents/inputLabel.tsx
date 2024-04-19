import React from "react";

interface InputLabelProps {
  name: string;
}

const InputLabel = ({
  name,

  ...props
}: InputLabelProps & React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label {...props} htmlFor="name">
      {name}
    </label>
  );
};

export default InputLabel;

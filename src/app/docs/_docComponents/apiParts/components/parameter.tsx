interface ParameterProps {
  param: string;
}

/**
 * @param param - Parameter value
 */

export const Parameter = ({ param }: ParameterProps) => {
  return (
    <div className="flex gap-1">
      <p className="">Parameter: </p>
      <span className="font-bold">{param}</span>
    </div>
  );
};

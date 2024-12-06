interface DescriptionProps {
  children: React.ReactNode;
}

/**
 *
 * @param children - The description of the documentation.

 * @returns
 */

export const Description = ({ children }: DescriptionProps) => {
  return <div className="my-3 text-pretty">{children}</div>;
};

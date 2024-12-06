export type MethodProps = {
  method:
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
    | "OPTIONS"
    | "HEAD"
    | "CONNECT"
    | "TRACE";
};

/**
 * @param method - HTTP method
 */

export const Method = ({ method }: MethodProps) => {
  return (
    <div className="flex gap-1">
      <p className="">Method: </p>
      <span className="font-bold">{method}</span>
    </div>
  );
};

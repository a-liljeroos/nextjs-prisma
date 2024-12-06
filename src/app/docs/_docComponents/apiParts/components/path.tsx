import { useClipboard } from "@clientFunctions";

/**
 * @param path - Path of the API route
 */

export const Path = ({
  path,
  displayTitle,
}: {
  path: string;
  displayTitle?: boolean;
}) => {
  const [copyToClipboard] = useClipboard();

  const renderPathWithHighlight = (path: string) => {
    const segments = path.split(/(\[.*?\])/);
    return segments.map((segment, index) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return (
          <span key={index} className="text-backgroundSecondary">
            {segment}
          </span>
        );
      }
      return <span key={index}>{segment}</span>;
    });
  };

  return (
    <div className="flex gap-1 overflow-x-auto">
      {displayTitle !== false && <p className="">Path: </p>}
      <span
        className="font-bold cursor-pointer"
        onClick={() => copyToClipboard(path)}
      >
        {renderPathWithHighlight(path)}
      </span>
    </div>
  );
};

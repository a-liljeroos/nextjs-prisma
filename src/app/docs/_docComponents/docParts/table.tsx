import { Color, ColorProps } from "./color";

type TableProps = {
  title?: string;
  description?: string;
  items: { [key: string]: any }[];
} & ColorProps;

export const Table = ({
  title,
  description,
  items,
  color: inputColor,
}: TableProps) => {
  if (items.length === 0) return null;

  const headers = Object.keys(items[0]);

  const color = Color({ color: inputColor });

  return (
    <div className={`flex flex-col gap-2 my-2  ${color}`}>
      {title && <h3 className="text-xl font-bold mb-2 underline">{title}</h3>}
      {description && <p className="p-1">{description}</p>}
      <div className="relative">
        <div className="overflow-x-auto  ">
          <table className="w-full border-collapse border border-gray-200 ">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={header}
                    className={`${
                      index === 0 && "sticky left-0 z-10"
                    } border border-gray-500 px-4 py-2 text-left bg-neutral-800`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  {headers.map((header, hIndex) => {
                    return (
                      <td
                        key={header}
                        className={`border border-gray-500 px-4 py-2 bg-neutral-800  ${
                          hIndex === 0 &&
                          "text-backgroundSecondary font-bold sticky left-0 z-10"
                        }`}
                      >
                        {item[header].toString()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

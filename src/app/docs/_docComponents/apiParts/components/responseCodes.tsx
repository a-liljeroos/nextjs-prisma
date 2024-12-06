type TResponseCode = {
  code: number;
  message: string;
};

interface ResponseCodeProps {
  codes: TResponseCode[];
  title: string;
  description?: string;
}

/**
 *
 * @param title - Title of the response codes
 * @param codes - Array of response codes
 * @param description - Description of the response codes
 */

export const ResponseCodes = ({
  title,
  codes,
  description,
}: ResponseCodeProps) => {
  return (
    <div className="flex flex-col gap-2 my-2">
      <h3 className=" px-1 font-bold mb-2 underline">{title}</h3>
      {description && <p className="py-2 px-1">{description}</p>}
      <table className="table-auto border-collapse border border-gray-500 bg-neutral-800">
        <thead>
          <tr>
            <th className="border border-gray-500 px-4 py-2 text-left">Code</th>
            <th className="border border-gray-500 px-4 py-2 text-left">
              Message
            </th>
          </tr>
        </thead>
        <tbody>
          {codes &&
            codes.map((code, index) => (
              <tr key={index}>
                <td className="border border-gray-500 px-4 py-2 w-10 font-bold text-backgroundSecondary">
                  {code.code}
                </td>
                <td className="border border-gray-500 px-4 py-2">
                  {code.message}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

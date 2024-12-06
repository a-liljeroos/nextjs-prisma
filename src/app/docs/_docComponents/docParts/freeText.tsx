// functions
import { readTextFile } from "./actions/readTextFile";

interface FreeTextProps {
  txtFilePath: string;
}

export const FreeText = async ({ txtFilePath }: FreeTextProps) => {
  const lines = await readTextFile(txtFilePath);
  return (
    <div>{lines && lines.map((line, index) => <p key={index}>{line}</p>)}</div>
  );
};

export async function getStaticProps(path: string) {
  const lines = readTextFile(path);
  return {
    props: {
      lines,
    },
  };
}

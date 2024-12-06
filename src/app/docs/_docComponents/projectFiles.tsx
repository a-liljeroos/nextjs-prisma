function buildFolderStructureJSX(
  tree: Record<string, any>,
  depth: number = 0
): JSX.Element[] {
  const result: JSX.Element[] = [];
  const keys = Object.keys(tree);

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;

    const prefix = (
      <>
        <span className="text-backgroundSecondary">
          {"│   ".repeat(depth)}
          {isLast ? "└── " : "├── "}
        </span>
      </>
    );

    result.push(
      <div key={key + index}>
        {prefix}
        {key}
      </div>
    );

    if (tree[key] && typeof tree[key] === "object") {
      result.push(...buildFolderStructureJSX(tree[key], depth + 1));
    }
  });

  return result;
}

import { useQuery } from "@tanstack/react-query";

const useFolderStructure = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["folderStructure"],
    queryFn: async () => {
      const response = await fetch(
        "https://uithub.com/a-liljeroos/nextjs-prisma/tree/main?accept=application%2Fjson&maxFileSize=10000",
        {
          next: { revalidate: 10000 },
        }
      );
      return response.json();
    },
  });

  return { data, isError, isLoading };
};

export const ProjectFiles = () => {
  const { data, isLoading, isError } = useFolderStructure();

  if (isLoading) return <p className="p-2">Loading...</p>;

  if (isError) return <p className="p-2">Error loading folders.</p>;

  return (
    <div className="overflow-x-scroll">
      <pre className="py-4 fade-in" style={{ lineHeight: 1.2 }}>
        {buildFolderStructureJSX(data.tree).map((item, index) => {
          const delay = index * 0.018;
          return (
            <div
              key={index}
              className="fade-in"
              style={{
                opacity: 0,
                animationFillMode: "forwards",
                animationDelay: `${delay.toString()}s`,
              }}
            >
              {item}
            </div>
          );
        })}
      </pre>
    </div>
  );
};

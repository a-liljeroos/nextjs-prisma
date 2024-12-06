import { CloseFoldersBtn } from "./closeFoldersBtn";

interface FolderWrapProps {
  children: React.ReactNode;
}

/**
 *
 * @task Intended to wrap a group of SlimFolderLs components.
 * @plus Comes with a close button.
 */

export const FolderWrap = ({ children }: FolderWrapProps) => {
  return (
    <div className="flex flex-col gap-1">
      <CloseFoldersBtn />
      {children}
    </div>
  );
};

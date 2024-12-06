// context
import { useDocContext } from "../docContext";
// icons
import { RiFolderUploadFill } from "react-icons/ri";
// components
import Button from "@components/buttons/Button";

/**
 * Button to close all folders. Works with SilmFolderUS component
 * from "@docComponents/slimFolder";
 *
 */

export const CloseFoldersBtn = () => {
  const { closeAllFolders } = useDocContext();
  return (
    <div className="py-2">
      <Button
        tooltip="Close folders"
        classBtn="plain-button"
        click={closeAllFolders}
      >
        <RiFolderUploadFill size={30} color="rgb(199, 201, 80)" />
      </Button>
    </div>
  );
};

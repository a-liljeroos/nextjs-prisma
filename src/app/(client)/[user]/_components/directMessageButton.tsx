import { useRouter } from "next/navigation";
// react-query
import { useQuery } from "@tanstack/react-query";
// functions
import { conversationExist } from "@crudFunctions";
// components
import Button from "@components/buttons/Button";
// icons
import { PiEnvelope } from "react-icons/pi";

interface DirectMessageButtonProps {
  profileId: number;
  showDmModal: boolean;
  setShowDmModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * A React component that renders a button for initiating a direct message.
 * The button either navigates to an existing conversation or toggles a modal
 * for starting a new conversation.
 *
 * @component
 * @param {DirectMessageButtonProps} props - The props for the component.
 * @param {string} props.profileId - The ID of the profile to check for an existing conversation.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setShowDmModal - A function to toggle the visibility of the direct message modal.
 * @param {boolean} props.showDmModal - A boolean indicating whether the direct message modal is currently visible.
 *
 * @returns {JSX.Element} A button element for sending a direct message.
 *
 * @remarks
 * - Uses `useQuery` to check if a conversation exists with the given profile ID.
 * - If a conversation exists, clicking the button navigates to the conversation.
 * - If no conversation exists, clicking the button toggles the direct message modal.
 *
 * @example
 * ```tsx
 * <DirectMessageButton
 *   profileId="12345"
 *   setShowDmModal={setShowDmModal}
 *   showDmModal={showDmModal}
 * />
 * ```
 */

const DirectMessageButton = ({
  profileId,
  setShowDmModal,
  showDmModal,
}: DirectMessageButtonProps) => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["conversation", profileId],
    queryFn: () => conversationExist(profileId),
  });

  if (isLoading || isError || data === undefined) return <></>;

  const handleClick = (data: number | null) => {
    if (data) {
      router.push(`/direct/t/${data}`);
    } else {
      setShowDmModal(!showDmModal);
    }
  };
  return (
    <Button
      click={() => handleClick(data)}
      classBtn="transparent-button"
      tooltip="Send message"
    >
      <PiEnvelope size={28} color="white" />
    </Button>
  );
};

export default DirectMessageButton;

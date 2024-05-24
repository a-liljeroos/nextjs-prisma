"use client";
// context
import { EditProfileContextProvider } from "./editProfileContext";
// components
import PageContainer from "@components/pageContainer/pageContainer";
import ChangePassword from "./_components/changePassword";
import ChangeBio from "./_components/changeBio";
import ChangeUsername from "./_components/changeUsername";
// icons
import { IoCaretBackOutline } from "react-icons/io5";

const EditProfile = () => {
  return (
    <PageContainer>
      <div className="p-4 mt-4 flex items-center">
        <div role="button">
          <IoCaretBackOutline
            className="cursor-pointer"
            size={25}
            color="white"
            onClick={() => {
              window.history.back();
            }}
          />
        </div>
        <h1 className="ml-4 text-bold text-lg">Edit Profile</h1>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <EditProfileContextProvider>
          <ChangeBio />
          <ChangeUsername />
          <ChangePassword />
        </EditProfileContextProvider>
      </div>
    </PageContainer>
  );
};

export default EditProfile;

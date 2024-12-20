"use client";
// context
import { EditProfileContextProvider } from "./editProfileContext";
// react-query
import useGetProfile from "../_fetchProfile/useGetProfile";
// components
import PageContainer from "@components/pageContainer/pageContainer";
import ChangePassword from "./_components/changePassword";
import ChangeBio from "./_components/changeBio";
import ChangeUsername from "./_components/changeUsername";
import GoBackButton from "@components/buttons/goBackButton";
import ErrorMsg1 from "@components/spinner/errorMsg1";

interface EditProfileProps {
  user: string;
}

const EditProfile = ({ user }: EditProfileProps) => {
  const { data, isError } = useGetProfile(user);

  return (
    <PageContainer>
      <div className="p-4 mt-4 flex items-center">
        <GoBackButton />
        <h1 className="ml-4 text-bold text-lg">Edit Profile</h1>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {!isError ? (
          <EditProfileContextProvider userData={data!} user={user}>
            <ChangeBio />
            <ChangeUsername />
            <ChangePassword />
          </EditProfileContextProvider>
        ) : (
          <ErrorMsg1 message="Something went wrong." />
        )}
      </div>
    </PageContainer>
  );
};

export default EditProfile;

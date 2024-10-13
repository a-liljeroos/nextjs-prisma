"use client";
import Link from "next/link";
import { useRef, ElementRef } from "react";
// react-query
import { useQuery } from "@tanstack/react-query";
import getUserPosts from "./_fetchProfile/getUserPosts";
// context
import {
  useImageViewContext,
  ImageViewContextProvider,
} from "@components/imagePreview/imagePreviewContext";
// types
import { ProfileFetch } from "@types";
// components
import { ImageView } from "@components/imagePreview/imagePreviewContext";
import PostList from "@components/post/postList";
import Spinner from "@components/spinner/spinner";
import ErrorMsg1 from "@components/spinner/errorMsg1";
import PageContainer from "@components/pageContainer/pageContainer";
import ProfileHeader from "./_components/profileHeader";
import ErrorPage from "@components/errorPage/errorPage";
// styles
import "./profile.scss";

interface ProfileProps {
  profile: ProfileFetch;
  isOwner: boolean;
}

const Profile = ({ profile, isOwner }: ProfileProps) => {
  const mainRef = useRef<ElementRef<"main">>(null);
  if (!profile) {
    return <ErrorPage message={"Page not found."} />;
  }

  return (
    <PageContainer mainRef={mainRef}>
      <ImageViewContextProvider>
        <ImageView
          containerRef={mainRef}
          className="rounded-lg shadow-lg"
          relativeWidth={80}
          topPosition={200}
          style={{
            objectFit: "cover",
            zIndex: 100,
          }}
        />
        <ProfileHeader
          profile={profile}
          name={profile.name}
          isOwner={isOwner}
        />
        <div
          className="profile-bio-cont bg-neutral-600"
          style={{ marginTop: -1 }}
        >
          <h2 className="text-backgroundSecondary text-lg text-pretty w-7/12 min-h-7">
            {profile?.profile?.bio && profile?.profile?.bio}
          </h2>
        </div>
        <FetchPosts name={profile.name} isOwner={isOwner} />
      </ImageViewContextProvider>
    </PageContainer>
  );
};

export default Profile;

interface FetchPostsProps {
  name: string;
  isOwner: boolean;
}

const FetchPosts = ({ name, isOwner }: FetchPostsProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", name],
    queryFn: () => getUserPosts({ name: name }),
  });

  return (
    <>
      <ProfileSubHeader title="Posts">
        {isOwner && (
          <Link href={`/post/write`}>
            <button className="plain-button">Write New</button>
          </Link>
        )}
      </ProfileSubHeader>
      {isError && <ErrorMsg1 message="Failed to load posts." />}
      {isLoading && (
        <div className="flex justify-center items-center h-52">
          <Spinner />
        </div>
      )}
      {!isLoading && <PostList posts={data?.posts} name={name}></PostList>}
    </>
  );
};

interface ProfileSubHeaderProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSubHeader = ({ title, children }: ProfileSubHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-2 py-4 px-8 bg-neutral-700">
      <h1 className="text-xl font-bold">{title}</h1>
      {children}
    </div>
  );
};

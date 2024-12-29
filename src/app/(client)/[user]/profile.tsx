"use client";
import Link from "next/link";
import { useRef, ElementRef } from "react";
// react-query
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getUserPosts from "./_fetchProfile/getUserPosts";
// functions
import { getCommentsByUser } from "@crudFunctions";
import { useIntersectionObserver } from "@clientFunctions";
// context
import {
  useImageViewContext,
  ImageViewContextProvider,
} from "@components/imagePreview/imagePreviewContext";
// types
import { ProfileFetch, ProfileCommentFetch } from "@types";
// components
import { ImageView } from "@components/imagePreview/imagePreviewContext";
import Comment from "@components/comments/commentList/comment";
import ErrorMsg1 from "@components/spinner/errorMsg1";
import ErrorPage from "@components/errorPage/errorPage";
import PageContainer from "@components/pageContainer/pageContainer";
import PostList from "@components/post/postList";
import ProfileHeader from "./_components/profileHeader";
import Spinner from "@components/spinner/spinner";
// styles
import "./profile.scss";

interface ProfileProps {
  profile: ProfileFetch;
  isOwner: boolean;
}

const Profile = ({ profile, isOwner }: ProfileProps) => {
  const mainRef = useRef<ElementRef<"main">>(null);
  const [isVisible, elementRef] = useIntersectionObserver();

  if (profile === null || profile === undefined) {
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
        <ProfileSubHeader title="Posts">
          {isOwner && (
            <Link href={`/post/write`}>
              <button className="plain-button">Write New</button>
            </Link>
          )}
        </ProfileSubHeader>
        <FetchPosts name={profile.name} isOwner={isOwner} />
        <ProfileSubHeader title="Comments" />
        <div ref={elementRef}>
          {isVisible && <FetchComments profileInput={profile} />}
        </div>
      </ImageViewContextProvider>
    </PageContainer>
  );
};

export default Profile;

interface ProfileSubHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const ProfileSubHeader = ({ title, children }: ProfileSubHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-2 py-4 px-8 bg-neutral-700">
      <h1 className="text-xl font-bold">{title}</h1>
      {children}
    </div>
  );
};

// ------------------------------------------------------------

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

// ------------------------------------------------------------

interface FetchCommentsProps {
  profileInput: ProfileFetch;
}

const FetchComments = ({ profileInput }: FetchCommentsProps) => {
  const { name, profile } = profileInput!;
  const queryClient = useQueryClient();
  const queryKeys = ["comments", name];
  const invalidateQueries = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys });
  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys,
    queryFn: () => getCommentsByUser(name),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-52">
        <Spinner />
      </div>
    );
  }

  if (isError || comments === null || comments === undefined) {
    return <ErrorMsg1 message="Failed to load comments." />;
  }

  if (comments?.length === 0)
    return (
      <div className="p-2 pl-8 w-full h-40 flex items-center ">
        The user have not made any comments.
      </div>
    );

  return (
    <div className="p-2">
      {!isLoading && (
        <CommentList
          comments={comments}
          name={name}
          profileImage={profile?.image}
          invalidateQueries={invalidateQueries}
        />
      )}
    </div>
  );
};

// ------------------------------------------------------------

import { useSession } from "next-auth/react";

interface CommentListProps {
  comments: ProfileCommentFetch[];
  name: string;
  profileImage: string | null | undefined;
  invalidateQueries: () => void;
}

const CommentList = ({
  comments,
  name,
  profileImage,
  invalidateQueries,
}: CommentListProps) => {
  const { data: session } = useSession();
  return (
    <ul className="flex flex-col gap-2">
      {comments.map((comment) => {
        const extractedComment = {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          contentHistory: comment.contentHistory,
          author: { name: name, profile: { image: profileImage } },
        };
        return (
          <Comment
            key={comment.id}
            postId={comment.postId.toString()}
            comment={extractedComment}
            sessionName={session?.user?.name}
            invalidateQuery={invalidateQueries}
            postTitle={
              <>
                <div className="py-2 leading-tight" style={{ fontSize: 18 }}>
                  <Link href={`/${comment.post.author.name}`}>
                    <span className="py-2 font-bold text-backgroundSecondary">
                      @{comment.post.author.name}{" "}
                    </span>
                  </Link>
                  <span className="py-2 font-bold text-neutral-400">/ </span>
                  <Link href={`/${comment.post.author.name}/${comment.postId}`}>
                    <span className="py-2 font-bold text-neutral-500 text-pretty">
                      {comment.post.title}
                    </span>
                  </Link>
                </div>
                <hr className="border-neutral-700" />
              </>
            }
          />
        );
      })}
    </ul>
  );
};

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// functions
import { useWindowDimensions } from "@clientFunctions";
// query
import { getUsername } from "./_fetch/getUsername";
// context
import { useNavBarContext } from "./navBarContext";
// components
import toast from "react-hot-toast";
// styles
import "./navBar.scss";

const SearchResults = () => {
  const { results, deleteResults } = useNavBarContext();
  const { height: windowHeight } = useWindowDimensions();

  const searchResultsHeight = windowHeight! - 80;

  if (results === undefined || results === null) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        color: "white",
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        top: 80,
        left: 0,
        zIndex: 5,
        backdropFilter: "blur(10px)",
      }}
      className="flex justify-center p-4 border"
    >
      <div className="py-1 flex flex-col w-96">
        {results.users.length > 0 && (
          <ResultContainer header="Users">
            {results.users.map((user) => {
              return (
                <ResultListItem key={user.name}>
                  <Link
                    onClick={deleteResults}
                    href={{
                      pathname: `/${user.name}`,
                    }}
                  >
                    <div className=" w-full h-full p-2">{user.name}</div>
                  </Link>
                </ResultListItem>
              );
            })}
          </ResultContainer>
        )}
        {results.posts.length > 0 && (
          <ResultContainer header="Posts">
            {results.posts.map((post) => {
              return (
                <ResultListItem key={post.id}>
                  <PostLink authorId={post.authorId} postId={post.id}>
                    <div className="py-3">
                      <h3 className="text-pretty px-2 pb-2 text-lg text-background underline">
                        {post.title}
                      </h3>
                      <p className="text-pretty text-xs italic p-2 bg-background">
                        ...{post.sample}...
                      </p>
                    </div>
                  </PostLink>
                </ResultListItem>
              );
            })}
          </ResultContainer>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

const PostLink = ({
  children,
  authorId,
  postId,
}: {
  children: React.ReactNode;
  authorId: number;
  postId: number;
}) => {
  const router = useRouter();
  const { deleteResults } = useNavBarContext();
  const handleClick = () => {
    getUsername(authorId)
      .then((name) => {
        router.push(`/${name!.name}/${postId}`);
        deleteResults();
      })
      .catch(() => {
        toast.error("Failed to get author name");
      });
  };
  return <div onClick={handleClick}>{children}</div>;
};

const ResultContainer = ({
  children,
  header,
}: {
  children: React.ReactNode;
  header: string;
}) => {
  return (
    <div className="py-2 w-full">
      <ResultHeader header={header} />
      <ResultList>{children}</ResultList>
    </div>
  );
};

const ResultHeader = ({ header }: { header: string }) => {
  return <h2 className="text-pretty text-xl pb-2">{header}</h2>;
};

const ResultList = ({ children }: { children: React.ReactNode }) => {
  return <ul className="flex flex-col gap-2">{children}</ul>;
};

const ResultListItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="bg-backgroundSecondary w-full px-2 cursor-pointer">
      {children}
    </li>
  );
};

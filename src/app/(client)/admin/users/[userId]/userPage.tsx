"use client";
import React from "react";
import Link from "next/link";
// types
import { TUserRoles } from "@types";
// components
import PageContainer from "@components/pageContainer/pageContainer";

interface UserPageProps {
  user: {
    id: number;
    createdAt: Date;
    email: string | null;
    name: string;
    password: string;
    role: TUserRoles;
    comments: {
      id: number;
      createdAt: Date;
      post: {
        id: number;
        title: string;
      };
      content: string;
    }[];
    posts: {
      id: number;
      createdAt: Date;
      published: boolean;
      title: string;
    }[];
  };
}

const UserPage = ({ user }: UserPageProps) => {
  return (
    <PageContainer backButton={true}>
      <div className="p-2 pt-8">
        <Link href={`/${user.name}`}>
          <h1 className="text-2xl">{user.name}</h1>
        </Link>
        <div className="py-4 px-2 flex flex-col gap-2">
          <p>
            created:{" "}
            {user.createdAt.toLocaleDateString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
          <p>role: {user.role}</p>
          <p>email: {user.email}</p>
          <p className="overflow-x-auto text-ellipsis">
            password: {user.password}
          </p>
        </div>
        <section className="my-4">
          <h2 className="text-lg">Posts</h2>
          <div className="p-2 overflow-x-auto">
            {user.posts.length > 0 ? (
              <table className="table-auto text-left w-full ">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Published</th>
                    <th className="px-4 py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {user.posts.map((post) => (
                    <tr key={post.id}>
                      <td className="border px-4 py-2">
                        <Link href={`/${user.name}/${post.id}`}>
                          {post.title}
                        </Link>
                      </td>
                      <td className="border px-4 py-2">
                        {post.published ? "yes" : "no"}
                      </td>
                      <td className="border px-4 py-2">
                        {post.createdAt.toLocaleDateString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No posts</p>
            )}
          </div>
        </section>
        <section className="my-4">
          <h2 className="text-lg">Comments</h2>
          <div className="p-2 overflow-x-auto">
            {user.comments.length > 0 ? (
              <table className="table-auto text-left w-full ">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Id</th>
                    <th className="px-4 py-2">Content</th>
                    <th className="px-4 py-2">Created</th>
                    <th className="px-4 py-2">Post</th>
                  </tr>
                </thead>
                <tbody>
                  {user.comments.map((comment) => (
                    <tr key={comment.id}>
                      <td className="border px-4 py-2">{comment.id}</td>
                      <td className="border px-4 py-2">{comment.content}</td>
                      <td className="border px-4 py-2">
                        {comment.createdAt.toLocaleDateString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="border px-4 py-2">
                        <Link href={`/${user.name}/${comment.post.id}`}>
                          {comment.post.title}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No comments</p>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default UserPage;

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// functions
import { deleteUser, deletePost } from "@adminFunctions";
// types
import { TUserRoles } from "@types";
// components
import PageContainer from "@components/pageContainer/pageContainer";
import toast from "react-hot-toast";

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
  const router = useRouter();

  const postDelete = (id: number) => {
    deletePost(id)
      .then((res) => {
        if (res) {
          toast.success("Post deleted.");
          router.refresh();
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete post.");
      });
  };

  return (
    <PageContainer backButton={true}>
      <div className="p-2 pt-8">
        <section className="my-4">
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
          <DeleteUser id={user.id} />
        </section>
        <hr />
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
                      <td className="border px-4 py-2">
                        <DeleteItem deleteFunc={() => postDelete(post.id)} />
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
        <hr />
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
        <hr />
      </div>
    </PageContainer>
  );
};

export default UserPage;

const DeleteUser = ({ id }: { id: number }) => {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);
  return (
    <div className="flex items-center gap-2 my-2">
      <button
        className="plain-button select-none"
        onClick={() => setDeleteModal(!deleteModal)}
      >
        {deleteModal ? "Cancel" : "Delete User"}
      </button>
      {deleteModal && (
        <>
          <div className="bg-red-700/30 rounded-md">
            <button
              onClick={() => {
                deleteUser(id)
                  .then((res) => {
                    if (res) {
                      toast.success("User deleted.");
                      router.push("/admin/users");
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                    toast.error("Failed to delete user.");
                  });
              }}
              className="plain-button"
            >
              Delete
            </button>
          </div>
          <p className="text-backgroundSecondary text-xs p-1 px-2 rounded underline bg-red-100/20">
            Note: This cannot be reversed.
          </p>
        </>
      )}
    </div>
  );
};

import { FaRegTrashAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

interface DeleteItemProps {
  deleteFunc: () => void | Promise<void>;
}

const DeleteItem = ({ deleteFunc }: DeleteItemProps) => {
  const [deleteModal, setDeleteModal] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <button
        className="transparent-button"
        onClick={() => setDeleteModal(!deleteModal)}
      >
        {deleteModal ? <MdCancel size={20} /> : <FaRegTrashAlt size={20} />}
      </button>

      {deleteModal && (
        <button
          className="transparent-button"
          onClick={() => {
            setDeleteModal(false);
            deleteFunc();
          }}
        >
          <FaRegTrashAlt size={20} color="ca4848" />
        </button>
      )}
    </div>
  );
};

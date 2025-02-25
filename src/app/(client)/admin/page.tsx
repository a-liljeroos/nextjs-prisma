"use server";
import React from "react";
import { redirect } from "next/navigation";
// functions
import { isAdmin } from "@adminFunctions";
// components
import AdminPage from "./adminPage";

const Page = async () => {
  const admin = await isAdmin();
  if (admin === false) {
    redirect("/");
  }

  return <AdminPage />;
};

export default Page;

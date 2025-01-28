"use client";
import React from "react";
import Link from "next/link";
// types
import { ProfileFetch } from "@types";
// components
import PageContainer from "@components/pageContainer/pageContainer";

interface AdminPageProps {
  profile?: ProfileFetch;
}

const AdminPage = ({ profile }: AdminPageProps) => {
  return (
    <PageContainer backButton={true}>
      <div className="p-2 pt-8">
        <h1 className="text-2xl font-bold my-4 fade-in">Admin Pages 🔧</h1>
        <section className="py-2 px-4 border-l font-bold flex gap-2">
          <Link href={"admin/users"} className="underline">
            Users
          </Link>
        </section>
      </div>
    </PageContainer>
  );
};

export default AdminPage;

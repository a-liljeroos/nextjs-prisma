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
        <section className="p-2 border rounded-xl font-bold flex gap-2">
          <Link href={"admin"} className="underline">
            Admin
          </Link>
        </section>
      </div>
    </PageContainer>
  );
};

export default AdminPage;

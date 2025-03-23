"use server";
import Link from "next/link";
// components
import PageContainer from "@components/pageContainer/pageContainer";

export default async function DirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContainer backButton={true}>
      <div className="pt-6">
        <div>
          <Link href="/direct">
            <h1 className="text-lg font-bold bg-neutral-800 px-2 py-4">
              Messages
            </h1>
          </Link>
        </div>
        <div className="flex flex-col h-full">{children}</div>
      </div>
    </PageContainer>
  );
}

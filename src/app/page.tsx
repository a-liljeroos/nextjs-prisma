"use client";
// auth
import { useSession } from "next-auth/react";
import GlitchText from "@components/glitchText/GlitchText";
import FrontPagePosts from "@/app/_components/post/frontPagePosts";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <main className="flex flex-col items-center pt-10">
      <div className="pt-6">
        <div className="pl-6">
          <GlitchText text="  " />
          <GlitchText text="Hi       " />
          <GlitchText text="There... " />
          <GlitchText text="    " />
        </div>
        <div className="mt-4">
          <FrontPagePosts />
        </div>
      </div>
    </main>
  );
}

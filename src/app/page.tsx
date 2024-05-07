"use client";
// auth
import { useSession } from "next-auth/react";
import GlitchText from "./_components/glitchText/GlitchText";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <main className="flex flex-col items-center p-24">
      <GlitchText text="  " />
      <GlitchText text="Hi       " />
      <GlitchText text="There... " />
      <GlitchText text="    " />
    </main>
  );
}

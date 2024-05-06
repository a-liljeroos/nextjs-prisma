"use client";
// auth
import { useSession } from "next-auth/react";
import GlitchText from "./_components/glitchText/GlitchText";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {session && (
        <div className="text-xs user-select-none">
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}
      {/*   <pre>{status}</pre> */}
      <GlitchText text="  " />
      <GlitchText text="Hi       " />
      <GlitchText text="There... " />
      <GlitchText text="    " />
    </main>
  );
}

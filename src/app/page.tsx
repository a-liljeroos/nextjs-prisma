"use client";
// auth
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {session && (
        <div className="text-xs user-select-none">
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}

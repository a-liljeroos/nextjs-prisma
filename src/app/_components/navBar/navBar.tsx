"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const NavBar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <nav className="bg-backgroundSecondary text-background font-semibold">
      <ul className="flex gap-3 list-none p-4">
        <li
          className={` p-2 ${
            pathname === "/"
              ? "underline underline-offset-4 decoration-background decoration-2"
              : ""
          }`}
        >
          <Link className="h-full" href="/">
            Home
          </Link>
        </li>

        {session && (
          <>
            <li
              className={`p-2 cursor-pointer  ${
                pathname === `/${session.user?.name}`
                  ? "underline underline-offset-4 decoration-background decoration-2"
                  : ""
              }`}
            >
              <Link href={`/${session.user?.name}`}>Profile</Link>
            </li>
            <li
              className={`p-2 cursor-pointer ml-auto`}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </li>
          </>
        )}

        {!session && (
          <>
            <li
              className={`p-2 ${
                pathname === "/register"
                  ? "underline underline-offset-4 decoration-background decoration-2"
                  : ""
              }`}
            >
              <Link href="/register">Register</Link>
            </li>
            <li
              className={`p-2 ml-auto cursor-pointer`}
              onClick={() => signIn("credentials", { callbackUrl: "/" })}
            >
              Sign In
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;

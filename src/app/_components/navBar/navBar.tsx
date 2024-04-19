"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const NavBar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <nav className="bg-neutral-800">
      <ul className="flex gap-3 list-none p-4">
        <li
          className={` p-2 ${
            pathname === "/"
              ? "underline underline-offset-4 decoration-emerald-500"
              : ""
          }`}
        >
          <Link className="h-full" href="/">
            Home
          </Link>
        </li>
        {session ? (
          <li className={`p-2 cursor-pointer`} onClick={() => signOut()}>
            Sign Out
          </li>
        ) : (
          <>
            <li
              className={`p-2 ${
                pathname === "/user/register"
                  ? "underline underline-offset-4 decoration-emerald-500"
                  : ""
              }`}
            >
              <Link href="/user/register">Register</Link>
            </li>
            <li className={`p-2 cursor-pointer`} onClick={() => signIn()}>
              Sign In
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;

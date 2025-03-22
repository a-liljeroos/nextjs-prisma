"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// auth
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
// functions
import { delay } from "@functions";
import { useMounted } from "@clientFunctions";
// context
import { useNavBarContext, NavBarContextProvider } from "./navBarContext";
// components
import Search from "@components/navBar/search";
import SearchResults from "@components/navBar/searchResults";
// icons
import { PiEnvelope } from "react-icons/pi";
// styles
import "./navBar.scss";

interface NavBarProps {
  navBarRendered: boolean;
  setNavBarRendered: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar = ({ navBarRendered, setNavBarRendered }: NavBarProps) => {
  const { data: session } = useSession();

  useEffect(() => {
    setNavBarRendered(true);
    return () => setNavBarRendered(false);
  }, [setNavBarRendered]);

  if (!navBarRendered) return null;

  return (
    <NavBarContextProvider>
      <NavBarContent session={session} />
    </NavBarContextProvider>
  );
};

export default NavBar;

interface NavBarContentProps {
  session: Session | null;
}

const NavBarContent = ({ session }: NavBarContentProps) => {
  const pathname = usePathname();
  const { searchFocused, narrowScreen, handleBlur, results } =
    useNavBarContext();

  const homeRef = useRef<HTMLLIElement>(null);
  const profileRef = useRef<HTMLLIElement>(null);
  const registerRef = useRef<HTMLLIElement>(null);
  const signOutRef = useRef<HTMLLIElement>(null);
  const signInRef = useRef<HTMLLIElement>(null);
  const directRef = useRef<HTMLLIElement>(null);
  const refs = [homeRef, profileRef, registerRef, signOutRef, signInRef];

  const visible = searchFocused ? "content-hidden" : "content-visible";
  const justifyNav = narrowScreen ? "justify-start" : "justify-center";
  const navPadding = searchFocused && narrowScreen ? "pl-0" : "pl-4";

  useEffect(() => {
    if (narrowScreen) {
      inputFocusChange({ elements: refs, isFocused: searchFocused });
    }
  }, [narrowScreen, searchFocused]);

  return (
    <>
      <nav
        className={`bg-backgroundSecTransparent hover:bg-backgroundSecondary backdrop-blur-sm sticky top-0 text-background text-nowrap font-bold h-20 ${navPadding} flex ${justifyNav} items-center overflow-hidden z-10 ${
          results ? "bg-backgroundSecondary" : ""
        }`}
      >
        <ul
          className={`flex gap-3 justify-center list-none relative nav-list `}
        >
          <li
            ref={homeRef}
            className={`${visible} p-2 ${
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
                ref={profileRef}
                className={`${visible} p-2 cursor-pointer text-nowrap ${
                  pathname === `/${session.user?.name}`
                    ? "underline underline-offset-4 decoration-background decoration-2"
                    : ""
                }`}
              >
                <Link
                  href={{
                    pathname: `/${session.user?.name}`,
                  }}
                  prefetch={true}
                >
                  Profile
                </Link>
              </li>
              <li
                ref={directRef}
                className={`${visible} p-2 cursor-pointer text-nowrap relative `}
              >
                <Link
                  href={{
                    pathname: `/direct`,
                  }}
                >
                  <PiEnvelope
                    size={28}
                    color="rgb(49, 49, 49)"
                    className="-translate-y-0.5"
                  />
                </Link>
                {/\/direct/.test(pathname) && (
                  <div className="border-b-2 border-background absolute w-4/6 bottom-2.5" />
                )}
              </li>
            </>
          )}
          {!session && (
            <>
              {" "}
              <li
                ref={registerRef}
                className={`${visible} p-2 text-nowrap ${
                  pathname === "/register"
                    ? "underline underline-offset-4 decoration-background decoration-2"
                    : ""
                }`}
              >
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
          <Search />
          {session && (
            <li
              ref={signOutRef}
              className={`${visible} p-2 cursor-pointer ml-auto text-nowrap`}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </li>
          )}
          {!session && (
            <li
              ref={signInRef}
              className={`${visible} p-2 ml-auto cursor-pointer text-nowrap`}
              onClick={() => signIn("credentials", { callbackUrl: "/" })}
            >
              Sign In
            </li>
          )}
        </ul>
      </nav>

      <SearchResults />
    </>
  );
};

interface InputFocusChangeProps {
  elements: React.RefObject<HTMLLIElement>[];
  isFocused: boolean;
}

const inputFocusChange = async ({
  elements,
  isFocused,
}: InputFocusChangeProps) => {
  if (isFocused) {
    elements.forEach((ref) => {
      if (ref.current) {
        ref.current.style.opacity = "0";
        ref.current.style.userSelect = "none";
      }
    });
  } else {
    await delay(500);
    elements.forEach((ref) => {
      if (ref.current) {
        ref.current.style.opacity = "1";
        ref.current.style.userSelect = "auto";
      }
    });
  }
};

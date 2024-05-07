"use client";
import { useState } from "react";
// auth
import { useSession } from "next-auth/react";
// icons
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

const Footer = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  return (
    <footer
      className={
        "flex items-start gap-5 w-100 p-4 bg-neutral-800 italic relative mt-auto "
      }
    >
      <div
        role="button"
        className="rounded-full bg-neutral-300 w-9 h-9 cursor-pointer absolute"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <MdKeyboardArrowDown color="black" size={35} />
        ) : (
          <MdKeyboardArrowUp color="black" size={35} />
        )}
      </div>
      <div className="w-9 h-9"></div>
      {open ? (
        <pre className="opacity-50 text-xs h-40 pt-2">
          session: {session && JSON.stringify(session, null, 2)}{" "}
          {!session && "null"}
        </pre>
      ) : (
        <div className="flex gap-4 mt-1">
          <p className="opacity-50">|</p>
          <p className="opacity-50 whitespace-nowrap">status: {status}</p>
          <p className="opacity-50">|</p>
          <p className="opacity-50">
            <a
              className="underline"
              href="https://github.com/a-liljeroos/nextjs-prisma"
              target="_blank"
              rel="noopener noreferrer"
            >
              source
            </a>
          </p>
        </div>
      )}
    </footer>
  );
};

export default Footer;

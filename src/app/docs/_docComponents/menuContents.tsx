import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
// context
import { useDocContext } from "@docComponents/docContext";
// contents
import { apiRoutes } from "@docComponents/../endpoints";

const MenuContents = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { menuOpen, toggleMenu, closeByClick } = useDocContext();
  function handleClick(url: string) {
    router.push(url);
    if (closeByClick) toggleMenu();
  }

  return (
    <>
      <ul className="flex flex-col py-1 list-none border-y-2 border-y-neutral-700/20">
        {apiRoutes &&
          apiRoutes.map((route, index) => {
            const routeUrl = "/docs" + route;
            return (
              <li
                role="link"
                onClick={() => handleClick(routeUrl)}
                className={`border-none cursor-pointer px-6 hover:text-backgroundSecondary  shift-right ${
                  pathname === routeUrl ? " text-backgroundSecondary" : ""
                }`}
                key={index}
                style={{ fontSize: "1rem" }}
              >
                {route}
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default MenuContents;

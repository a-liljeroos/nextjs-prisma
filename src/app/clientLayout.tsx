"use client";
import React, { useState } from "react";
// react-query
import QueryProvider from "@react-query/QueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// components
import NavBar from "@components/navBar/navBar";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [navBarRendered, setNavBarRendered] = useState(false);
  return (
    <>
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <QueryProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <NavBar
            navBarRendered={navBarRendered}
            setNavBarRendered={setNavBarRendered}
          />
          <Toaster />
          {navBarRendered ? <>{children}</> : null}
        </QueryProvider>
      </AnimatePresence>
    </>
  );
};

export default ClientLayout;

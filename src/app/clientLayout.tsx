"use client";
import React, { useState } from "react";
// react-query
import QueryProvider from "@react-query/QueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// components
import NavBar from "@components/navBar/navBar";
import { Toaster } from "react-hot-toast";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [navBarRendered, setNavBarRendered] = useState(false);
  return (
    <>
      <QueryProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <NavBar
          navBarRendered={navBarRendered}
          setNavBarRendered={setNavBarRendered}
        />
        <Toaster />
        {navBarRendered ? children : null}
      </QueryProvider>
    </>
  );
};

export default ClientLayout;

"use client";
import React, { ElementRef, forwardRef } from "react";
import { motion } from "framer-motion";
// components
import GoBackButton from "@components/buttons/goBackButton";
// styles
import "./pageContainer.scss";

interface PageContainerProps {
  children: React.ReactNode;
  backButton?: boolean;
  mainRef?: React.RefObject<ElementRef<"main">>;
}

const PageContainer = ({
  children,
  backButton,
  mainRef,
}: PageContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      exit={{ opacity: 0 }}
    >
      <main
        ref={mainRef}
        id="main"
        className="flex flex-col items-center w-full"
      >
        <div
          className="content-container relative"
          style={{
            minHeight: "100%",
          }}
        >
          {backButton && (
            <div className="w-14 bg-neutral-800 shadow-lg rounded-full absolute sticky top-24 left-1 z-50">
              <GoBackButton />
            </div>
          )}
          {children}
        </div>
      </main>
    </motion.div>
  );
};

export default PageContainer;

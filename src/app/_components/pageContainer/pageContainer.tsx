"use client";
import React, { ElementRef, forwardRef } from "react";
import { motion } from "framer-motion";
// styles
import "./pageContainer.scss";

interface PageContainerProps {
  children: React.ReactNode;
  mainRef?: React.RefObject<ElementRef<"main">>;
}

const PageContainer = ({ children, mainRef }: PageContainerProps) => {
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
          {children}
        </div>
      </main>
    </motion.div>
  );
};

export default PageContainer;

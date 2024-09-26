import React, { ElementRef, forwardRef } from "react";
// styles
import "./pageContainer.scss";

interface PageContainerProps {
  children: React.ReactNode;
  mainRef?: React.RefObject<ElementRef<"main">>;
}

const PageContainer = ({ children, mainRef }: PageContainerProps) => {
  return (
    <main ref={mainRef} id="main" className="flex flex-col items-center w-full">
      <div
        className="content-container relative"
        style={{
          minHeight: "100%",
        }}
      >
        {children}
      </div>
    </main>
  );
};

export default PageContainer;

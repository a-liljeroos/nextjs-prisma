import React from "react";
// styles
import "./pageContainer.scss";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <main className="flex flex-col items-center w-full">
      <div
        className="content-container"
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

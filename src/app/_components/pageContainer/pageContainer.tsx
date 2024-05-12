import React from "react";
// styles
import "./pageContainer.scss";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <main style={{ margin: "0 auto" }}>
      <div
        className="content-container px-5"
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

"use client";
import React from "react";
// components
import Docs from "@docComponents/docs";
import MenuContents from "@docComponents/menuContents";
import { ProjectFiles } from "@docComponents/projectFiles";
import { SlimFolderLS } from "@docComponents/slimFolder";

const Page = () => {
  return (
    <Docs>
      <div className="flex flex-col gap-1">
        <section>
          <SlimFolderLS title="API routes">
            <MenuContents />
          </SlimFolderLS>
        </section>
        <section>
          <SlimFolderLS title="Files">
            <ProjectFiles />
          </SlimFolderLS>
        </section>
      </div>
    </Docs>
  );
};

export default Page;

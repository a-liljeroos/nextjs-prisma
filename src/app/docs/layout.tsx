"use client";
// context
import { DocContextProvider } from "@docComponents/docContext";
import "./styles.scss";

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocContextProvider>{children}</DocContextProvider>;
}

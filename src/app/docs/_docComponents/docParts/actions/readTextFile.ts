"use server";
import { promises as fs } from "fs";
import path from "path";

export const readTextFile = async (filePath: string) => {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContent = await fs.readFile(fullPath, "utf-8");
  return fileContent.split("\n");
};

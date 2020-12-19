import { promises as fs } from "fs";

export const readJSON = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, "utf8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error(err);
  }
};

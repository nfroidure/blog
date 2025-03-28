import fm from "front-matter";
import { pathJoin, readDir, readFile } from "./files";
import type { FrontMatterResult } from "front-matter";

export async function readEntry<T>(
  filePath: string,
): Promise<FrontMatterResult<T>> {
  const content = await readFile(filePath);
  const entry = fm(content);

  return {
    ...entry,
    attributes: JSON.parse(JSON.stringify(entry.attributes)),
  };
}

export async function readEntries<T>(
  dirPath: string,
): Promise<FrontMatterResult<T>[]> {
  const files = await readDir(dirPath);

  return await Promise.all(
    files.map((file) => readEntry<T>(pathJoin(dirPath, file))),
  );
}

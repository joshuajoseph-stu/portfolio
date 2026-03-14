import FS from "../data/filesystem.json";
import type { FSNode, DirNode } from "./types";

const FILESYSTEM = FS as Record<string, FSNode>;
export const HOME = "home/joshua";

export function resolvePath(path: string): FSNode | null {
  if (FILESYSTEM[path]) return FILESYSTEM[path];
  for (const base of Object.keys(FILESYSTEM)) {
    if (path.startsWith(base)) {
      const parts = path.slice(base.length + 1).split("/").filter(Boolean);
      let current = FILESYSTEM[base];
      for (const part of parts) {
        if (current.type !== "dir" || !current.children[part]) return null;
        current = current.children[part];
      }
      return current;
    }
  }
  return null;
}

export function resolveFSArg(arg: string, cwd: string): FSNode | null {
  if (arg.startsWith("/")) return resolvePath(arg.slice(1));
  return resolvePath(`${cwd}/${arg}`);
}

export function getChildren(cwd: string): { name: string; type: string }[] {
  const node = resolvePath(cwd);
  if (!node || node.type !== "dir") return [];
  return Object.entries((node as DirNode).children).map(([name, n]) => ({
    name,
    type: n.type,
  }));
}
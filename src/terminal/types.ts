export type FileNode = {
  type: "file";
  content: string | string[];
};

export type DirNode = {
  type: "dir";
  children: Record<string, FSNode>;
};

export type FSNode = FileNode | DirNode;

export type OutputLine =
  | { type: "text"; content: string }
  | { type: "dir"; content: string };

export type PrintFn = (...lines: string[]) => void;
export type PrintLsFn = (entries: { name: string; type: string }[]) => void;
export type SetCwdFn = (cwd: string) => void;
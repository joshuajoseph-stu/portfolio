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
  | { type: "dir"; content: string }
  | { type: "link"; label: string; url: string };

export type PrintFn = (...lines: string[]) => void;
export type PrintLsFn = (entries: { name: string; type: string }[]) => void;
export type PrintLinkFn = (label: string, url: string) => void;

export type Pager = {
  lines: string[];
  offset: number;
  pageSize: number;
} | null;

export type SetCwdFn = (cwd: string) => void;

export type Mode = "landing" | "terminal" | "simple";
export type SetModeFn = (mode: Mode) => void;

export type SetBoolFn = (val: boolean) => void;
export type SetTextGlowFn = (glow: TextGlow) => void;
export type SetFontSizeFn = (size: number) => void;
export type TextGlow = "full" | "reduced" | "disabled";

export type ClearLinesFn = () => void;

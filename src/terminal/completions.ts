import { getChildren } from "./filesystem";

const COMMANDS = [
  "help",
  "ls",
  "cd",
  "cat",
  "pwd",
  "clear",
  "history",
  "theme",
  "settings",
  "contact",
];

export function getCompletions(
  input: string,
  cwd: string,
): { completions: string[]; completed: string | null } {
  const parts = input.split(/\s+/);

  if (parts.length === 1) {
    const partial = parts[0];
    const matches = COMMANDS.filter((c) => c.startsWith(partial));
    if (matches.length === 1) return { completions: [], completed: matches[0] };
    return { completions: matches, completed: null };
  }

  const cmd = parts[0];
  const arg = parts[1] ?? "";

  const slashIdx = arg.lastIndexOf("/");
  const dirPart = slashIdx >= 0 ? arg.slice(0, slashIdx) : "";
  const partial = slashIdx >= 0 ? arg.slice(slashIdx + 1) : arg;

  const searchDir = dirPart ? `${cwd}/${dirPart}` : cwd;
  const children = getChildren(searchDir);
  const matches = children.filter((c) => c.name.startsWith(partial));

  if (matches.length === 1) {
    const match = matches[0];
    const suffix = match.type === "dir" ? "/" : "";
    const completedArg = dirPart
      ? `${dirPart}/${match.name}${suffix}`
      : `${match.name}${suffix}`;
    return { completions: [], completed: `${cmd} ${completedArg}` };
  }

  return {
    completions: matches.map((m) => m.name + (m.type === "dir" ? "/" : "")),
    completed: null,
  };
}

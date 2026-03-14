import { resolvePath, resolveFSArg, HOME } from "./filesystem";
import type { PrintFn, PrintLsFn, SetCwdFn } from "./types";
import { THEMES, applyTheme } from "./themes";
import type { Theme } from "./themes";

export function executeCommand(
  input: string,
  cwd: string,
  commandHistory: string[],
  print: PrintFn,
  printLs: PrintLsFn,
  setCwd: SetCwdFn,
  setTheme: (theme: Theme) => void
) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts[1];

  switch (cmd) {
    case "help":
      print(
        "  help           - Show this help message",
        "  theme          - Change theme of the terminal",
        "  ls             - List directory contents",
        "  cd <dir>       - Change directory",
        "  cat <file>     - Read a file",
        "  pwd            - Print working directory",
        "  clear          - Handled by App",
        "  history        - Show command history",
        ""
      );
      break;

    case "pwd":
      print(`/${cwd}`, "");
      break;

    case "ls": {
      const target = arg ? resolveFSArg(arg, cwd) : resolvePath(cwd);
      if (!target || target.type !== "dir") { print("ls: not a directory", ""); break; }
      const entries = Object.entries(target.children).map(([name, n]) => ({ name, type: n.type }));
      printLs(entries);
      break;
    }

    case "cd": {
      if (!arg || arg === "~") { setCwd(HOME); break; }
      const cleanArg = arg.replace(/\/+$/, "");
      if (cleanArg === "..") {
        if (cwd === HOME) { print("cd: already at home directory", ""); break; }
        const p = cwd.split("/"); p.pop();
        setCwd(p.join("/"));
        break;
      }
      const target = (cleanArg.startsWith("/") ? cleanArg.slice(1) : `${cwd}/${cleanArg}`).replace(/\/+/g, "/");
      const node = resolveFSArg(cleanArg, cwd);
      if (!node) print(`cd: no such file or directory: ${cleanArg}`, "");
      else if (node.type !== "dir") print(`cd: not a directory: ${cleanArg}`, "");
      else setCwd(target);
      break;
    }

    case "cat": {
      if (!arg) { print("cat: missing operand", ""); break; }
      const node = resolveFSArg(arg, cwd);
      if (!node) print(`cat: ${arg}: No such file or directory`, "");
      else if (node.type === "dir") print(`cat: ${arg}: Is a directory`, "");
      else {
        const lines = Array.isArray(node.content) ? node.content : node.content.split("\n");
        print(...lines, "");
      }
      break;
    }

    case "history":
      print(...commandHistory.map((c, i) => `${i + 1}  ${c}`), "");
      break;

      case "theme": {
      if (!arg) {
        print(
          "Available themes:",
          ...Object.keys(THEMES).map((t) => `  ${t}`),
          ""
        );
        break; 
      }
      if (!(arg in THEMES)) {
        print(`theme: unknown theme '${arg}'. Run 'theme' to see options.`, "");
        break;
      }
      applyTheme(arg as Theme);
      setTheme(arg as Theme);
      print(`Theme set to '${arg}'.`, "");
      break;
    }

    case "":
      break;

    default:
      print(`Command not found: ${cmd}. Type 'help' for available commands.`, "");
  }
}
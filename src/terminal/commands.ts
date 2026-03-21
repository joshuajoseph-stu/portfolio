import { resolvePath, resolveFSArg, HOME } from "./filesystem";
import type {
  PrintFn,
  PrintLsFn,
  PrintLinkFn,
  SetCwdFn,
  SetModeFn,
  ClearLinesFn,
  SetBoolFn,
  SetTextGlowFn,
  SetFontSizeFn,
  TextGlow,
} from "./types";

import { THEMES, applyTheme } from "./themes";
import type { Theme } from "./themes";

export function executeCommand(
  input: string,
  cwd: string,
  commandHistory: string[],
  print: PrintFn,
  printLs: PrintLsFn,
  printLink: PrintLinkFn,
  setCwd: SetCwdFn,
  setTheme: (theme: Theme) => void,
  setMode: SetModeFn,
  clearLines: ClearLinesFn,
  setCrt: SetBoolFn,
  setTextGlow: SetTextGlowFn,
  setFontSize: SetFontSizeFn,
  crtEnabled: boolean,
  textGlow: TextGlow,
  fontSize: number,
) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts[1];

  switch (cmd) {
    case "help":
      print(
        "  help           - Show this help message",
        "  theme          - Change theme of the terminal",
        "  settings       - Change font size, CRT effects or text glow intensity",
        "  contact        - View my contact information",
        "  ls             - List directory contents",
        "  cd <dir>       - Change directory",
        "  cat <file>     - Read a file",
        "  pwd            - Print current working directory",
        "  clear          - Clear the terminal",
        "  history        - Show command history",
        "  exit           - Return to landing page",
        "",
      );
      break;

    case "pwd":
      print(`/${cwd}`, "");
      break;

    case "ls": {
      const target = arg ? resolveFSArg(arg, cwd) : resolvePath(cwd);
      if (!target || target.type !== "dir") {
        print("ls: not a directory", "");
        break;
      }
      const entries = Object.entries(target.children).map(([name, n]) => ({
        name,
        type: n.type,
      }));
      printLs(entries);
      break;
    }

    case "cd": {
      if (!arg || arg === "~") {
        setCwd(HOME);
        break;
      }
      const cleanArg = arg.replace(/\/+$/, "");
      if (cleanArg === "..") {
        if (cwd === HOME) {
          print("cd: already at home directory", "");
          break;
        }
        const p = cwd.split("/");
        p.pop();
        setCwd(p.join("/"));
        break;
      }
      const target = (
        cleanArg.startsWith("/") ? cleanArg.slice(1) : `${cwd}/${cleanArg}`
      ).replace(/\/+/g, "/");
      const node = resolveFSArg(cleanArg, cwd);
      if (!node) print(`cd: no such file or directory: ${cleanArg}`, "");
      else if (node.type !== "dir")
        print(`cd: not a directory: ${cleanArg}`, "");
      else setCwd(target);
      break;
    }

    case "cat": {
      if (!arg) {
        print("cat: missing operand", "");
        break;
      }
      const node = resolveFSArg(arg, cwd);
      if (!node) print(`cat: ${arg}: No such file or directory`, "");
      else if (node.type === "dir") print(`cat: ${arg}: Is a directory`, "");
      else {
        const lines = Array.isArray(node.content)
          ? node.content
          : node.content.split("\n");
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
          "Choose a theme using 'theme <chosen-theme>'",
          "",
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
    case "settings": {
      if (!arg) {
        print(
          "Current settings:",
          `  crt       ${crtEnabled ? "enabled" : "disabled"}`,
          `  glow      ${textGlow}`,
          `  fontsize  ${fontSize}px`,
          "",
          "Usage:",
          "  settings crt <enabled|disabled>",
          "  settings glow <full|reduced|disabled>",
          "  settings fontsize <10-30>",
          "",
        );
        break;
      }

      const sub = parts[1];
      const val = parts[2];

      if (sub === "crt") {
        if (val !== "enabled" && val !== "disabled") {
          print("settings crt: expected 'enabled' or 'disabled'", "");
          break;
        }
        setCrt(val === "enabled");
        print(`crt effects set to '${val}'.`, "");
        break;
      }

      if (sub === "glow") {
        if (val !== "full" && val !== "reduced" && val !== "disabled") {
          print("settings glow: expected 'full', 'reduced', or 'disabled'", "");
          break;
        }
        setTextGlow(val as TextGlow);
        print(`text glow set to '${val}'.`, "");
        break;
      }

      if (sub === "fontsize") {
        const size = Number(val);
        if (isNaN(size) || size < 10 || size > 30) {
          print("settings fontsize: expected a number between 10 and 30", "");
          break;
        }
        setFontSize(size);
        print(`font size set to ${size}px.`, "");
        break;
      }

      print(
        `settings: unknown option '${sub}'. Run 'settings' to see options.`,
        "",
      );
      break;
    }
    case "contact":
      print("Here's where you can reach me:", "");
      printLink(
        "  email      joshuajoseph1012@gmail.com",
        "mailto:joshuajoseph1012@gmail.com",
      );
      printLink(
        "  github     github.com/joshuajoseph-stu",
        "https://github.com/joshuajoseph-stu",
      );
      printLink(
        "  linkedin   linkedin.com/in/joshua-joseph-1894b4203",
        "https://www.linkedin.com/in/joshua-joseph-1894b4203",
      );
      print("");
      break;
    case "exit":
      clearLines();
      setMode("landing");
      break;
    case "":
      break;
    default:
      print(
        `Command not found: ${cmd}. Type 'help' for available commands.`,
        "",
      );
  }
}

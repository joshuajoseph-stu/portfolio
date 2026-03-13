import { useState, useEffect, useRef } from "react";
import "./App.css";

const FILESYSTEM: Record<string, any> = {
  "home/joshua": {
    type: "dir",
    children: {
      "README.md": {
        type: "file",
        content: ["TODO"],
      },
      projects: {
        type: "dir",
        children: {
          "README.md": {
            type: "file",
            content: [
              "# Projects",
              "",
              "Here are some of the projects I've worked on",
              "Use 'ls' to see them all.",
            ],
          },
          professional: {
            type: "dir",
            children: {
              "opsAI.md": {
                type: "file",
                content: ["# OpsAI"],
              },
            },
          },
          "portfolio.md": {
            type: "file",
            content: [
              "# Terminal Portfolio",
              "A mock terminal built with React + TypeScript.",
            ],
          },
          "project2.md": {
            type: "file",
            content: ["# Project 2", "Description coming soon..."],
          },
        },
      },
      skills: {
        type: "dir",
        children: {
          "frontend.md": {
            type: "file",
            content: [
              "# Frontend",
              "- React / TypeScript",
              "- HTML / CSS",
              "- Tailwind CSS",
            ],
          },
          "backend.md": {
            type: "file",
            content: [
              "# Backend",
              "- Node.js / Express",
              "- PostgreSQL / MongoDB",
              "- REST APIs",
            ],
          },
        },
      },
    },
  },
};

const COMMANDS = ["help", "ls", "cd", "cat", "pwd", "clear", "history"];
const HOME = "home/joshua";

function resolvePath(path: string): any | null {
  if (FILESYSTEM[path]) return FILESYSTEM[path];
  for (const base of Object.keys(FILESYSTEM)) {
    if (path.startsWith(base)) {
      const parts = path
        .slice(base.length + 1)
        .split("/")
        .filter(Boolean);
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

function getChildren(cwd: string): { name: string; type: string }[] {
  const node = resolvePath(cwd);
  if (!node || node.type !== "dir") return [];
  return Object.entries(node.children).map(([name, n]: any) => ({
    name,
    type: n.type,
  }));
}

function getCompletions(
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
  let children = getChildren(searchDir);

  if (cmd === "cd") children = children.filter((c) => c.type === "dir");
  if (cmd === "cat") children = children.filter((c) => c.type === "file");

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

function App() {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [currentCommand, setCurrentCommand] = useState("");
  const [outputLines, setOutputLines] = useState<string[]>([
    "Hi there! I'm Joshua — welcome to my portfolio :)",
    "This site works like a terminal: just type commands to explore my work, skills, and more.",
    "Not sure where to start? Type 'help' to see everything you can do.",
    "",
  ]);
  const [cwd, setCwd] = useState(HOME);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = document.querySelector(".terminal-content");
    if (el) el.scrollTop = el.scrollHeight;
  }, [outputLines]);

  const prompt = `~/home/joshua${cwd === HOME ? "" : "/" + cwd.slice(HOME.length + 1)}`;

  const print = (...lines: string[]) =>
    setOutputLines((prev) => [...prev, ...lines]);

  const executeCommand = (command: string, currentCwd: string) => {
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts[1];

    switch (cmd) {
      case "help":
        print(
          "  help           - Show this help message",
          "  ls             - List directory contents",
          "  cd <dir>       - Change directory",
          "  cat <file>     - Read a file",
          "  pwd            - Print working directory",
          "  clear          - Clear the terminal",
          "  history        - Shows command history for this session",
          "",
        );
        break;
      case "pwd":
        print(`/${currentCwd}`, "");
        break;
      case "ls": {
        const node = resolvePath(currentCwd);
        if (!node || node.type !== "dir") {
          print("ls: not a directory", "");
          break;
        }
        const entries = Object.entries(node.children).map(([name, n]: any) =>
          n.type === "dir" ? `${name}/` : name,
        );
        print(...entries, "");
        break;
      }
      case "cd": {
        if (!arg || arg === "~") {
          setCwd(HOME);
          break;
        }
        if (arg === "..") {
          if (currentCwd === HOME) {
            print("cd: already at home directory", "");
            break;
          }
          const p = currentCwd.split("/");
          p.pop();
          setCwd(p.join("/"));
          break;
        }
        const target = `${currentCwd}/${arg}`;
        const node = resolvePath(target);
        if (!node) print(`cd: no such file or directory: ${arg}`, "");
        else if (node.type !== "dir") print(`cd: not a directory: ${arg}`, "");
        else setCwd(target);
        break;
      }
      case "cat": {
        if (!arg) {
          print("cat: missing operand", "");
          break;
        }
        const node = resolvePath(`${currentCwd}/${arg}`);
        if (!node) print(`cat: ${arg}: No such file or directory`, "");
        else if (node.type === "dir") print(`cat: ${arg}: Is a directory`, "");
        else print(...node.content, "");
        break;
      }
      case "clear":
        setOutputLines([]);
        break;
      case "history":
        print(...commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`));
        break;
      case "":
        break;
      default:
        print(
          `Command not found: ${cmd}. Type 'help' for available commands.`,
          "",
        );
    }
  };

  const handleCommand = () => {
    print(`${prompt} $ ${currentCommand}`);
    executeCommand(currentCommand, cwd);
    setCommandHistory((prev) => [...prev, currentCommand]);
    setHistoryIndex(null);
    setCurrentCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const { completions, completed } = getCompletions(currentCommand, cwd);
      if (completed !== null) {
        setCurrentCommand(completed);
      } else if (completions.length > 0) {
        print(`${prompt} $ ${currentCommand}`, completions.join("   "), "");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCommandHistory((hist) => {
        const newIndex =
          historyIndex === null
            ? hist.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(hist[newIndex] ?? "");
        return hist;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCommandHistory((hist) => {
        const newIndex = historyIndex === null ? null : historyIndex + 1;
        if (newIndex === null || newIndex >= hist.length) {
          setHistoryIndex(null);
          setCurrentCommand("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(hist[newIndex]);
        }
        return hist;
      });
    }
  };

  return (
    <div id="main">
      <div id="terminal" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-content">
          <div className="output-area">
            {outputLines.map((line, index) => (
              <div key={index} className="output-line">
                {line}
              </div>
            ))}
          </div>
          <div className="input-area">
            <span className="prompt">
              {prompt} →{" "}
              <input
                type="text"
                id="command-input"
                ref={inputRef}
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
              />
            </span>
          </div>
        </div>
      </div>
      <div id="assistant"></div>
    </div>
  );
}

export default App;

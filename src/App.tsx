import { useState, useEffect, useRef } from "react";
import "./App.css";
import type { OutputLine } from "./terminal/types";
import { HOME } from "./terminal/filesystem";
import { executeCommand } from "./terminal/commands";
import { getCompletions } from "./terminal/completions";
import { applyTheme } from "./terminal/themes";
import type { Theme } from "./terminal/themes";

function App() {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [currentCommand, setCurrentCommand] = useState("");
  const [theme, setTheme] = useState<Theme>("green");
  const [outputLines, setOutputLines] = useState<OutputLine[]>([
    {
      type: "text",
      content: "Hi there! I'm Joshua — welcome to my portfolio :)",
    },
    {
      type: "text",
      content:
        "This site works like a terminal: just type commands to explore my work, skills, and more.",
    },
    {
      type: "text",
      content:
        "Not sure where to start? Type 'help' to see everything you can do.",
    },
    { type: "text", content: "" },
  ]);
  const [cwd, setCwd] = useState(HOME);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    applyTheme(theme);
  }, []);

  useEffect(() => {
    const el = document.querySelector(".terminal-content");
    if (el) el.scrollTop = el.scrollHeight;
  }, [outputLines]);

  const prompt = `~/home/joshua${cwd === HOME ? "" : "/" + cwd.slice(HOME.length + 1)}`;

  const print = (...lines: string[]) =>
    setOutputLines((prev) => [
      ...prev,
      ...lines.map((content) => ({ type: "text" as const, content })),
    ]);

  const printLs = (entries: { name: string; type: string }[]) =>
    setOutputLines((prev) => [
      ...prev,
      ...entries.map(({ name, type }) => ({
        type: (type === "dir" ? "dir" : "text") as OutputLine["type"],
        content: type === "dir" ? `${name}/` : name,
      })),
      { type: "text" as const, content: "" },
    ]);

  const handleCommand = () => {
    print(`${prompt} $ ${currentCommand}`);
    if (currentCommand.trim() === "clear") {
      setOutputLines([]);
    } else {
      executeCommand(
        currentCommand,
        cwd,
        commandHistory,
        print,
        printLs,
        setCwd,
        setTheme,
      );
    }
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
      <div id="terminal">
        <div className="terminal-content">
          <div className="output-area">
            {outputLines.map((line, index) => (
              <div
                key={index}
                className={`output-line ${line.type === "dir" ? "dir-entry" : ""}`}
              >
                {line.content}
              </div>
            ))}
          </div>
          <div className="input-area" onClick={() => inputRef.current?.focus()}>
            <span className="prompt">
              {prompt} →{" "}
              <input
                type="text"
                id="command-input"
                ref={inputRef}
                value={currentCommand}
                onChange={(e) => {
                  setCurrentCommand(e.target.value);
                  setHistoryIndex(null);
                }}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
              />
            </span>
          </div>
        </div>
      </div>
      <div id="assistant"></div>
      <div id="copyright">
        <div className="copyright-box">
          <div>© 2026 Joshua Joseph</div>
          <div>WARNING: Very early WIP</div>
        </div>
      </div>
    </div>
  );
}

export default App;

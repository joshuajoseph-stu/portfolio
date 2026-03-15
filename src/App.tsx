import { useState, useEffect, useRef } from "react";

import type { OutputLine, Mode } from "./terminal/types";
import type { Theme } from "./terminal/themes";

import { Landing } from "./components/Landing";
import { HOME } from "./terminal/filesystem";
import { executeCommand } from "./terminal/commands";
import { getCompletions } from "./terminal/completions";

import { applyTheme } from "./terminal/themes";
import "./App.css";

const BOOT_SEQUENCE = [
  "BIOS v2.1.0 ...",
  "Initializing memory... OK",
  "Loading kernel... OK",
  "Starting joshua-os v1.0.0...",
  "Hi there! I'm Joshua — welcome to my portfolio :)",
  "This site works like a terminal: just type commands to explore my work, skills, and more.",
  "Not sure where to start? Type 'help' to see everything you can do.",
  "",
];

function App() {
  const [mode, setMode] = useState<Mode>("landing");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [currentCommand, setCurrentCommand] = useState("");
  const [theme, setTheme] = useState<Theme>("green");
  const [booting, setBooting] = useState(true);
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [cwd, setCwd] = useState(HOME);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const clearLines = () => setOutputLines([]);

  const handleCommand = () => {
    print(`${prompt} $ ${currentCommand}`);
    if (currentCommand.trim() === "clear") {
      clearLines();
    } else {
      executeCommand(
        currentCommand,
        cwd,
        commandHistory,
        print,
        printLs,
        setCwd,
        setTheme,
        setMode,
        clearLines,
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

  const handleSetFocus = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (mode !== "terminal") return;
    applyTheme(theme);
    setBooting(true);
    const delay_amount = 300;
    for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
      const delay =
        i < 3
          ? i * delay_amount
          : 3 * delay_amount + (i - 3) * (delay_amount * 4);
      setTimeout(() => {
        setOutputLines((prev) => [
          ...prev,
          { type: "text" as const, content: BOOT_SEQUENCE[i] },
        ]);
        if (i === BOOT_SEQUENCE.length - 1) {
          setBooting(false);
          setTimeout(() => handleSetFocus(), 50);
        }
      }, delay);
    }
  }, [mode]);

  useEffect(() => {
    const el = document.querySelector(".terminal-content");
    if (el) el.scrollTop = el.scrollHeight;
  }, [outputLines]);

  return (
    <div id="main">
      {mode === "landing" && (
        <Landing
          onSelectTerminal={() => setMode("terminal")}
          onSelectSimple={() => setMode("simple")}
        />
      )}
      {mode === "terminal" && (
        <>
          <div id="terminal">
            <div className="crt">
              <div className="terminal-content">
                <div
                  className="output-area"
                  aria-live="polite"
                  aria-atomic="false"
                >
                  {outputLines.map((line, index) => (
                    <div
                      key={index}
                      className={`output-line ${line.type === "dir" ? "dir-entry" : ""}`}
                    >
                      {line.content}
                    </div>
                  ))}
                </div>
                {booting ? (
                  <></>
                ) : (
                  <div
                    className="input-area"
                    onClick={() => inputRef.current?.focus()}
                  >
                    <span className="prompt">
                      {prompt} →{" "}
                      <input
                        type="text"
                        id="command-input"
                        aria-label="terminal input"
                        ref={inputRef}
                        value={currentCommand}
                        onChange={(e) => {
                          setCurrentCommand(e.target.value);
                          setHistoryIndex(null);
                        }}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        autoComplete="off"
                        disabled={booting}
                      />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div id="assistant"></div>
        </>
      )}
      {mode === "simple" && <div>simple mode coming soon!!</div>}
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

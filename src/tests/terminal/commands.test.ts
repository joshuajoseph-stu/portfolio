import { executeCommand } from "../../terminal/commands";

const HOME = "home/joshua";
const FONT_SIZE = 16;

const call = (
  input: string,
  cwd: string,
  print: (...lines: string[]) => void,
  setCwd: (dir: string) => void,
) =>
  executeCommand(
    input,
    cwd,
    [],
    print,
    () => {},
    () => {},
    setCwd,
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    true,
    "full",
    FONT_SIZE,
  );

describe("executeCommand", () => {
  let output: string[];
  let cwd: string;
  const print = (...lines: string[]) => output.push(...lines);
  const setCwd = (dir: string) => {
    cwd = dir;
  };

  beforeEach(() => {
    output = [];
    cwd = HOME;
  });

  it("prints help text", () => {
    call("help", cwd, print, setCwd);
    expect(output.some((l) => l.includes("help"))).toBe(true);
  });

  it("changes directory", () => {
    call("cd projects", cwd, print, setCwd);
    expect(cwd).toBe("home/joshua/projects");
  });

  it("rejects cd into a file", () => {
    call("cd README.md", cwd, print, setCwd);
    expect(output.some((l) => l.includes("not a directory"))).toBe(true);
  });

  it("handles unknown command", () => {
    call("fakecommand", cwd, print, setCwd);
    expect(output.some((l) => l.includes("Command not found"))).toBe(true);
  });

  it("cd .. goes up one level", () => {
    cwd = "home/joshua/projects";
    call("cd ..", cwd, print, setCwd);
    expect(cwd).toBe("home/joshua");
  });
});

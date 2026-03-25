import { getCompletions } from "../../terminal/completions";

const HOME = "home/joshua";

describe("getCompletions", () => {
  it("completes a partial command", () => {
    const { completed } = getCompletions("hel", HOME);
    expect(completed).toBe("help");
  });

  it("returns multiple matches for ambiguous input", () => {
    const { completions } = getCompletions("h", HOME);
    expect(completions.length).toBeGreaterThan(1);
  });

  it("completes a dir arg for cd", () => {
    const { completed } = getCompletions("cd pro", HOME);
    expect(completed).toBe("cd projects/");
  });

  it("completes a file arg for cat", () => {
    const { completed } = getCompletions("cat RE", HOME);
    expect(completed).toBe("cat README.md");
  });

  it("returns empty when no matches", () => {
    const { completions, completed } = getCompletions("cd zzz", HOME);
    expect(completions).toEqual([]);
    expect(completed).toBeNull();
  });
});

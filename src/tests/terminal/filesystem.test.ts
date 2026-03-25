import {
  resolvePath,
  resolveFSArg,
  getChildren,
} from "../../terminal/filesystem";

describe("resolvePath", () => {
  it("resolves the home directory", () => {
    expect(resolvePath("home/joshua")).not.toBeNull();
  });

  it("resolves a nested file", () => {
    expect(resolvePath("home/joshua/projects/portfolio.md")).not.toBeNull();
  });

  it("returns null for nonexistent path", () => {
    expect(resolvePath("home/joshua/fake")).toBeNull();
  });

  it("returns null for a path that looks valid but isnt", () => {
    expect(resolvePath("home/joshua/projects/fake.md")).toBeNull();
  });
});

describe("resolveFSArg", () => {
  it("resolves a relative path from cwd", () => {
    expect(resolveFSArg("projects", "home/joshua")).not.toBeNull();
  });

  it("resolves an absolute path", () => {
    expect(resolveFSArg("/home/joshua/projects", "home/joshua")).not.toBeNull();
  });

  it("returns null for nonexistent relative path", () => {
    expect(resolveFSArg("fake", "home/joshua")).toBeNull();
  });
});

describe("getChildren", () => {
  it("returns children of home dir", () => {
    const children = getChildren("home/joshua");
    expect(children.map((c) => c.name)).toContain("projects");
    expect(children.map((c) => c.name)).toContain("skills");
  });

  it("marks dirs correctly", () => {
    const children = getChildren("home/joshua");
    const projects = children.find((c) => c.name === "projects");
    expect(projects?.type).toBe("dir");
  });

  it("marks files correctly", () => {
    const children = getChildren("home/joshua");
    const readme = children.find((c) => c.name === "README.md");
    expect(readme?.type).toBe("file");
  });

  it("returns empty array for nonexistent dir", () => {
    expect(getChildren("home/joshua/fake")).toEqual([]);
  });
});

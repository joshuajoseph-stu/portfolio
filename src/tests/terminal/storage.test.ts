import { loadSettings, saveSettings } from "../../terminal/storage";

describe("storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns defaults when nothing is saved", () => {
    const settings = loadSettings();
    expect(settings.theme).toBe("green");
    expect(settings.fontSize).toBe(16);
    expect(settings.crtEnabled).toBe(true);
    expect(settings.textGlow).toBe("full");
  });

  it("saves and loads a setting", () => {
    saveSettings({ theme: "amber" });
    expect(loadSettings().theme).toBe("amber");
  });

  it("partial save preserves other defaults", () => {
    saveSettings({ fontSize: 20 });
    const settings = loadSettings();
    expect(settings.fontSize).toBe(20);
    expect(settings.theme).toBe("green");
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("portfolio-settings", "not-valid-json");
    expect(() => loadSettings()).not.toThrow();
  });
});

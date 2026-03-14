export type Theme = "green" | "amber" | "blue" | "white" | "light";

export const THEMES: Record<Theme, { primary: string; background: string; shadow: string }> = {
  green: {
    primary: "#00ff00",
    background: "#000000",
    shadow: "rgba(0, 255, 0, 0.3)",
  },
  amber: {
    primary: "#ffb000",
    background: "#0a0500",
    shadow: "rgba(255, 176, 0, 0.3)",
  },
  blue: {
    primary: "#00b4ff",
    background: "#000a0f",
    shadow: "rgba(0, 180, 255, 0.3)",
  },
  white: {
    primary: "#ffffff",
    background: "#0d0d0d",
    shadow: "rgba(255, 255, 255, 0.3)",
  },
  light: {
    primary: "#1f1f1f",
    background: "#c1c1c1",
    shadow: "rgba(255, 255, 255, 0.3)",
  },
};

export function applyTheme(theme: Theme) {
  const t = THEMES[theme];
  document.documentElement.style.setProperty("--primary", t.primary);
  document.documentElement.style.setProperty("--background", t.background);
  document.documentElement.style.setProperty("--shadow", t.shadow);
}
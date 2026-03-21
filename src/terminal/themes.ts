export type Theme = "green" | "amber" | "blue" | "white" | "light";

export const THEMES: Record<
  Theme,
  { primary: string; background: string; shadow: string }
> = {
  green: {
    primary: "#00ff00",
    background: "#001000",
    shadow: "rgba(0, 255, 0, 0.3)",
  },
  amber: {
    primary: "#ffb000",
    background: "#100800",
    shadow: "rgba(255, 176, 0, 0.3)",
  },
  blue: {
    primary: "#00b4ff",
    background: "#000b10",
    shadow: "rgba(0, 180, 255, 0.3)",
  },
  white: {
    primary: "#ffffff",
    background: "#282828",
    shadow: "rgba(255, 255, 255, 0.3)",
  },
  light: {
    primary: "#282828",
    background: "#c1c1c1",
    shadow: "rgba(255, 255, 255, 0.3)",
  },
};

function applyFavicon(theme: Theme) {
  const selectors: Record<string, string> = {
    "link[rel='icon'][type='image/x-icon']": `/favicon_${theme}.ico`,
    "link[rel='icon'][sizes='16x16']": `/favicon_${theme}-16x16.png`,
    "link[rel='icon'][sizes='32x32']": `/favicon_${theme}-32x32.png`,
    "link[rel='apple-touch-icon']": `/apple-touch-icon_${theme}.png`,
  };

  for (const [selector, href] of Object.entries(selectors)) {
    const el = document.querySelector<HTMLLinkElement>(selector);
    if (el) el.href = href;
  }
}

export function applyTheme(theme: Theme) {
  const t = THEMES[theme];
  document.documentElement.style.setProperty("--primary", t.primary);
  document.documentElement.style.setProperty("--background", t.background);
  document.documentElement.style.setProperty("--shadow", t.shadow);
  applyFavicon(theme);
}

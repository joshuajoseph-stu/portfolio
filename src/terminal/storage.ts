const STORAGE_KEY = "portfolio-settings";

export type StoredSettings = {
  theme: string;
  fontSize: number;
  crtEnabled: boolean;
  textGlow: string;
};

const DEFAULTS: StoredSettings = {
  theme: "green",
  fontSize: 16,
  crtEnabled: true,
  textGlow: "full",
};

export function loadSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(settings: Partial<StoredSettings>) {
  try {
    const current = loadSettings();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...current, ...settings }),
    );
  } catch {
    // localStorage unavailable, fail silently
  }
}

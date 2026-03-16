import type { Theme } from "../terminal/themes";

type Props = {
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  crtEnabled: boolean;
  onCrtToggle: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  textGlow: "full" | "reduced" | "disabled";
  onTextGlowChange: (glow: "full" | "reduced" | "disabled") => void;
};

const THEMES: Theme[] = ["green", "amber", "blue", "white", "light"];

export function SettingsModal({
  onClose,
  theme,
  onThemeChange,
  crtEnabled,
  onCrtToggle,
  fontSize,
  onFontSizeChange,
  textGlow,
  onTextGlowChange,
}: Props) {
  return (
    <div id="modal-overlay" onClick={onClose}>
      <div id="modal" onClick={(e) => e.stopPropagation()}>
        <div id="modal-header">
          <span>settings</span>
          <button id="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-section">
          <div className="modal-label">theme</div>
          <div className="modal-options">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`modal-btn ${theme === t ? "active" : ""}`}
                onClick={() => onThemeChange(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-label">font size</div>
          <div
            className="modal-options"
            style={{ alignItems: "center", gap: "1rem" }}
          >
            <button
              className="modal-btn"
              onClick={() => onFontSizeChange(Math.max(8, fontSize - 2))}
            >
              −
            </button>
            <span>{fontSize}px</span>
            <button
              className="modal-btn"
              onClick={() => onFontSizeChange(Math.min(40, fontSize + 2))}
            >
              +
            </button>
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-label">crt effects</div>
          <div className="modal-options">
            <button
              className={`modal-btn ${crtEnabled ? "active" : ""}`}
              onClick={() => !crtEnabled && onCrtToggle()}
            >
              enabled
            </button>
            <button
              className={`modal-btn ${!crtEnabled ? "active" : ""}`}
              onClick={() => crtEnabled && onCrtToggle()}
            >
              disabled
            </button>
          </div>
          <div className="modal-warning">
            ⚠ crt effects include flashing and flickering which may affect users
            with photosensitive epilepsy.
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-label">text glow</div>
          <div className="modal-options">
            {(["full", "reduced", "disabled"] as const).map((option) => (
              <button
                key={option}
                className={`modal-btn ${textGlow === option ? "active" : ""}`}
                onClick={() => onTextGlowChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

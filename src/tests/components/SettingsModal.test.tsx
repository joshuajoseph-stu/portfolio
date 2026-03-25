import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsModal } from "../../components/SettingsModal";

const defaultProps = {
  onClose: vi.fn(),
  theme: "green" as const,
  onThemeChange: vi.fn(),
  crtEnabled: true,
  onCrtToggle: vi.fn(),
  fontSize: 16,
  onFontSizeChange: vi.fn(),
  textGlow: "full" as const,
  onTextGlowChange: vi.fn(),
};

describe("SettingsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the modal", () => {
    render(<SettingsModal {...defaultProps} />);
    expect(screen.getByText("settings")).toBeInTheDocument();
  });

  it("renders all theme options", () => {
    render(<SettingsModal {...defaultProps} />);
    expect(screen.getByText("green")).toBeInTheDocument();
    expect(screen.getByText("amber")).toBeInTheDocument();
    expect(screen.getByText("blue")).toBeInTheDocument();
    expect(screen.getByText("white")).toBeInTheDocument();
  });

  it("renders all text glow options", () => {
    render(<SettingsModal {...defaultProps} />);
    expect(screen.getByText("full")).toBeInTheDocument();
    expect(screen.getByText("reduced")).toBeInTheDocument();
    expect(screen.getAllByText("disabled").length).toBeGreaterThan(0);
  });

  it("renders crt enabled and disabled buttons", () => {
    render(<SettingsModal {...defaultProps} />);
    expect(screen.getByText("enabled")).toBeInTheDocument();
    expect(screen.getAllByText("disabled").length).toBeGreaterThan(0);
  });

  it("calls onClose when close button is clicked", async () => {
    render(<SettingsModal {...defaultProps} />);
    await userEvent.click(screen.getByText("✕"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", async () => {
    render(<SettingsModal {...defaultProps} />);
    await userEvent.click(document.getElementById("modal-overlay")!);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onThemeChange when a theme is clicked", async () => {
    render(<SettingsModal {...defaultProps} />);
    await userEvent.click(screen.getByText("amber"));
    expect(defaultProps.onThemeChange).toHaveBeenCalledWith("amber");
  });

  it("calls onTextGlowChange when a glow option is clicked", async () => {
    render(<SettingsModal {...defaultProps} />);
    await userEvent.click(screen.getByText("reduced"));
    expect(defaultProps.onTextGlowChange).toHaveBeenCalledWith("reduced");
  });

  it("marks the active theme as active", () => {
    render(<SettingsModal {...defaultProps} />);
    const greenBtn = screen.getByText("green").closest("button");
    expect(greenBtn).toHaveClass("active");
  });

  it("marks the active glow as active", () => {
    render(<SettingsModal {...defaultProps} />);
    const fullBtn = screen.getByText("full").closest("button");
    expect(fullBtn).toHaveClass("active");
  });

  it("marks crt enabled as active when crtEnabled is true", () => {
    render(<SettingsModal {...defaultProps} />);
    const enabledBtn = screen.getByText("enabled").closest("button");
    expect(enabledBtn).toHaveClass("active");
  });

  it("marks crt disabled as active when crtEnabled is false", () => {
    render(<SettingsModal {...defaultProps} crtEnabled={false} />);
    const disabledBtns = screen.getAllByText("disabled");
    const crtDisabledBtn = disabledBtns[0].closest("button");
    expect(crtDisabledBtn).toHaveClass("active");
  });

  it("calls onFontSizeChange when + is clicked", async () => {
    render(<SettingsModal {...defaultProps} />);
    await userEvent.click(screen.getByText("+"));
    expect(defaultProps.onFontSizeChange).toHaveBeenCalledWith(18);
  });

  it("calls onFontSizeChange when − is clicked", async () => {
    render(<SettingsModal {...defaultProps} />);
    await userEvent.click(screen.getByText("−"));
    expect(defaultProps.onFontSizeChange).toHaveBeenCalledWith(14);
  });

  it("does not go below min font size", async () => {
    render(<SettingsModal {...defaultProps} fontSize={8} />);
    await userEvent.click(screen.getByText("−"));
    expect(defaultProps.onFontSizeChange).toHaveBeenCalledWith(8);
  });

  it("does not go above max font size", async () => {
    render(<SettingsModal {...defaultProps} fontSize={40} />);
    await userEvent.click(screen.getByText("+"));
    expect(defaultProps.onFontSizeChange).toHaveBeenCalledWith(40);
  });
});

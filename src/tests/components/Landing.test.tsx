import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Landing } from "../../components/Landing";

const defaultProps = {
  onSelectTerminal: vi.fn(),
  onSelectSimple: vi.fn(),
  onOpenSettings: vi.fn(),
  theme: "green" as const,
};

describe("Landing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the name", () => {
    render(<Landing {...defaultProps} />);
    expect(screen.getByText("Joshua Joseph")).toBeInTheDocument();
  });

  it("renders both mode buttons", () => {
    render(<Landing {...defaultProps} />);
    expect(screen.getByText("Terminal mode")).toBeInTheDocument();
    expect(screen.getByText("Simple mode")).toBeInTheDocument();
  });

  it("renders the settings button", () => {
    render(<Landing {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /settings/i }),
    ).toBeInTheDocument();
  });

  it("calls onSelectTerminal when terminal mode is clicked", async () => {
    render(<Landing {...defaultProps} />);
    await userEvent.click(screen.getByText("Terminal mode"));
    expect(defaultProps.onSelectTerminal).toHaveBeenCalledTimes(1);
  });

  it("calls onSelectSimple when simple mode is clicked", async () => {
    render(<Landing {...defaultProps} />);
    await userEvent.click(screen.getByText("Simple mode"));
    expect(defaultProps.onSelectSimple).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenSettings when settings is clicked", async () => {
    render(<Landing {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: /settings/i }));
    expect(defaultProps.onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("renders the crt warning", () => {
    render(<Landing {...defaultProps} />);
    expect(screen.getByText(/flashing/i)).toBeInTheDocument();
  });
});

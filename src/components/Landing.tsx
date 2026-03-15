type Props = {
  onSelectTerminal: () => void;
  onSelectSimple: () => void;
};

export function Landing({ onSelectTerminal, onSelectSimple }: Props) {
  return (
    <div id="landing">
      <div id="landing-content">
        <h1>Joshua Joseph</h1>
        <p>Software Developer</p>
        <div id="landing-options">
          <button onClick={onSelectTerminal} className="landing-btn primary">
            <span className="btn-title">Terminal mode</span>
            <span className="btn-sub">Navigate with commands</span>
          </button>
          <button onClick={onSelectSimple} className="landing-btn">
            <span className="btn-title">Simple mode</span>
            <span className="btn-sub">Just show me the info</span>
          </button>
        </div>
      </div>
    </div>
  );
}

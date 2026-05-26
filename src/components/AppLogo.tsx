interface AppLogoProps {
  variant?: "panel" | "paper";
  showTagline?: boolean;
}

export function AppLogo({ variant = "panel", showTagline = true }: AppLogoProps) {
  return (
    <div className={`app-logo app-logo-${variant}`} aria-label="学級名簿メーカー">
      <svg className="app-logo-mark" viewBox="0 0 48 48" role="img" aria-hidden="true">
        <rect x="5" y="4" width="38" height="40" rx="8" />
        <path d="M15 15h18M15 23h18M15 31h12" />
        <circle cx="34" cy="31" r="4" />
        <text x="17" y="29">名</text>
      </svg>
      <span className="app-logo-text">
        <span className="app-logo-name">学級名簿メーカー</span>
        {showTagline ? <span className="app-logo-tagline">画面で整えて、そのまま印刷</span> : null}
      </span>
    </div>
  );
}

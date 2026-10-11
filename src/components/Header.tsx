export const Logo = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <rect width="64" height="64" rx="14" fill="var(--color-accent-solid)" />
    <path
      d="M18 33l9 9 19-20"
      fill="none"
      stroke="var(--color-text-on-accent)"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Header = () => (
  <header className="site-header">
    <div className="container">
      <a className="brand" href="#top">
        <Logo />
        <span>Agent Ready</span>
      </a>
      <nav className="site-nav" aria-label="Site">
        <ul>
          <li>
            <a href="#checklist">Checklist</a>
          </li>
          <li>
            <a href="#principles">Principles</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

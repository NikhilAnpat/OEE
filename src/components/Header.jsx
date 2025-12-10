import './Header.css';

function Header({ isNavOpen, setIsNavOpen }) {
  const toggle = () => setIsNavOpen((s) => !s);

  return (
    <header className={`header ${isNavOpen ? 'nav-open' : 'nav-closed'}`}>
      <div className={`header-left ${isNavOpen ? 'shifted' : ''}`}>
        <button
          className={`nav-toggle ${isNavOpen ? 'open' : 'closed'}`}
          onClick={toggle}
          aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>
        <span className="header-text">Demo</span>
      </div>
      <div className="header-right">
        <span className="header-text">Test</span>
      </div>
    </header>
  );
}

export default Header;


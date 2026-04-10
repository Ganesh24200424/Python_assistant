const Header = ({ status = 'Online' }) => {
  return (
    <header className="header glass-panel">
      <div className="header-left">
        <h1 className="logo">J.A.R.V.I.S</h1>
        <span className="tagline">Just A Rather Very Intelligent System</span>
      </div>
      
      <div className="header-center">
        <div className="mode-switch mode-switch-single">
          <div className="mode-slider"></div>
          <button className="mode-btn active" data-mode="jarvis">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span>Jarvis</span>
          </button>
        </div>
      </div>

      <div className="header-right">
        <div className="status-badge">
          <span className="status-dot"></span>
          <span className="status-text">{status}</span>
        </div>
        <button className="btn-icon" title="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        <button className="btn-icon" title="New Chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header


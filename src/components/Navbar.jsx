// src/components/Navbar.jsx
import { useState } from 'react';

export default function Navbar({ onNavigate, isLoggedIn, onSignOut, onSignIn, theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setIsMenuOpen(false); 
  };

  return (
    <nav className="navbar-container">
      
      {/* LOGO */}
      <div className="nav-logo" onClick={() => handleNavClick('landing')}>
        <img src="/logo.jpg" alt="" />
        
        <span>Maal Tracker</span>
      </div>

      {/* LINKS */}
      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <span onClick={() => handleNavClick('landing')}>Home</span>
        <span onClick={() => handleNavClick('about')}>About</span>
        <span onClick={() => handleNavClick('contact')}>Contact Support</span>

        {/* MOBILE THEME TOGGLE */}
        <div className="mobile-only-btn">
            <button onClick={toggleTheme} className="theme-btn" style={{width:'100%', justifyContent:'center', marginBottom:'10px'}}>
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            
            {isLoggedIn ? (
                <button onClick={() => { onSignOut(); setIsMenuOpen(false); }} className="btn-login" style={{background:'#dc3545', width:'100%'}}>Sign Out</button>
            ) : (
                <button onClick={() => { onSignIn(); setIsMenuOpen(false); }} className="btn-login" style={{width:'100%'}}>Login</button>
            )}
        </div>
      </div>

      {/* DESKTOP RIGHT SIDE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        
        {/* DESKTOP THEME TOGGLE */}
        <button onClick={toggleTheme} className="theme-btn desktop-only-btn" title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        {/* DESKTOP LOGIN BUTTON */}
        <div className="desktop-only-btn">
            {isLoggedIn ? (
                <button onClick={onSignOut} className="btn-login" style={{background:'#dc3545'}}>Sign Out</button>
            ) : (
                <button onClick={onSignIn} className="btn-login">Login</button>
            )}
        </div>

        {/* HAMBURGER ICON */}
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
        </div>
      </div>

    </nav>
  );
}
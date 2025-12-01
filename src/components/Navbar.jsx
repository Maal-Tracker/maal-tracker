// src/components/Navbar.jsx
import { useState } from 'react';

export default function Navbar({ onNavigate, isLoggedIn, onSignOut, onSignIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    // Waxaan xiraynaa menu-ga haddii uu furan yahay
    setIsMenuOpen(false); 
  };

  return (
    <nav className="navbar-container">
      
      {/* Qeybta Bidix: LOGO */}
      <div className="nav-logo" onClick={() => handleNavClick('landing')} style={{cursor: 'pointer'}}>
        <div style={{
            width:'30px', 
            height:'30px', 
            background:'#FFD600', 
            borderRadius:'4px', 
            display:'flex', 
            alignItems:'center', 
            justifyContent:'center',
            marginRight: '10px',
            fontSize: '18px'
        }}>
            <img src="" alt="" />
        </div>
        <span>Maal Tracker</span>
      </div>

      {/* Qeybta Dhexe: LINKS (Waa loo kala dhex qabtay CSS ahaan) */}
      {/* Waxaan isticmaalnaa class 'nav-links' oo design-ka desktop-ka ah */}
      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <span onClick={() => handleNavClick('landing')}>Home</span>
        <span onClick={() => handleNavClick('about')}>About</span>
        <span onClick={() => handleNavClick('contact')}>Contact Support</span>
        
        {/* Badhanka Login/SignOut-ka ee ku dhex jira Mobile Menu-ga */}
        <div className="mobile-only-btn">
            {isLoggedIn ? (
                <button onClick={() => { onSignOut(); setIsMenuOpen(false); }} className="btn-login" style={{background:'#dc3545', marginTop: '10px'}}>Sign Out</button>
            ) : (
                <button onClick={() => { onSignIn(); setIsMenuOpen(false); }} className="btn-login" style={{marginTop: '10px'}}>Login</button>
            )}
        </div>
      </div>

      {/* Qeybta Midig: LOGIN BUTTON (Desktop Style) & HAMBURGER (Mobile Style) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        
        {/* Badhanka Login/SignOut-ka ee Desktop-ka. Kani wuxuu u eg yahay sawirka 3aad. */}
        <div className="desktop-only-btn">
            {isLoggedIn ? (
                <button onClick={onSignOut} className="btn-login" style={{background:'#dc3545'}}>Sign Out</button>
            ) : (
                <button onClick={onSignIn} className="btn-login">Login</button>
            )}
        </div>

        {/* Hamburger Icon. Kani wuxuu muuqanayaa oo kaliya Mobile-ka, Desktop-ka waa ka qarsoon yahay CSS-ka. */}
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
        </div>
      </div>

    </nav>
  );
}
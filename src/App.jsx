// src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Account from './components/Account';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import About from './components/About';
import Contact from './components/Contact';
import ReactGA from "react-ga4";

// Ku bilow Google Analytics ID-gaaga
ReactGA.initialize("G-CBYZZ6455R");

// Track-garee bogga koowaad (Initial Page View)
ReactGA.send({ hitType: "pageview", page: window.location.pathname });

export default function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('landing'); 
  const [targetFeature, setTargetFeature] = useState('daily'); 
  const [isGuestMode, setIsGuestMode] = useState(false);
  
  // 1. Theme State (Default: light)
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // 2. Apply Theme to <html> tag
    document.documentElement.setAttribute('data-theme', theme);
    
    // Auth Check
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setView('landing');
        setIsGuestMode(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [theme]); // Re-run when theme changes

  // 3. Toggle Function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Feature Handling
  const handleFeatureClick = (feature) => {
      setTargetFeature(feature);
      if (session) {
          setIsGuestMode(false);
          setView('dashboard');
      } else {
          setIsGuestMode(true);
          setView('dashboard');
      }
  };

  const renderContent = () => {
    switch(view) {
        case 'landing': return <LandingPage onNavigate={handleFeatureClick} />;
        case 'about': return <About />;
        case 'contact': return <Contact />;
        case 'auth': return <div className="container" style={{marginTop:'50px', maxWidth:'400px', margin:'50px auto', padding:'20px', borderRadius:'8px'}}><Auth /></div>;
        case 'dashboard': return <Account key={session ? session.user.id : 'guest'} session={session} isGuest={isGuestMode} initialView={targetFeature} onBackToHome={() => setView('landing')} onGoToLogin={() => setView('auth')} />;
        default: return <LandingPage onNavigate={handleFeatureClick} />;
    }
  };

  return (
    <div>
        {/* Pass Theme Props to Navbar */}
        <Navbar 
            onNavigate={setView} 
            isLoggedIn={!!session} 
            onSignOut={() => supabase.auth.signOut()}
            onSignIn={() => setView('auth')}
            theme={theme}
            toggleTheme={toggleTheme}
        />
        
        {renderContent()}

        {view !== 'dashboard' && view !== 'auth' && (
            <footer className="footer">
                <div className="footer-links">
                    <span>Home</span> • <span>About</span> • <span>Contact Support</span> • <span>Privacy Policy</span>
                </div>
                <div>© 2025 Maal Tracker — All rights reserved.</div>
            </footer>
        )}
    </div>
  );
}
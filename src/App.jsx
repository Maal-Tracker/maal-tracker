// src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Account from './components/Account';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar'; // New Navbar
import About from './components/About';
import Contact from './components/Contact';

export default function App() {
  const [session, setSession] = useState(null);
  // views: 'landing', 'daily', 'plan', 'about', 'contact', 'auth'
  const [view, setView] = useState('landing'); 
  const [theme, setTheme] = useState('light'); // light or dark

  useEffect(() => {
    // Theme Setup
    document.documentElement.setAttribute('data-theme', theme);
    
    // Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Main Content Renderer
  const renderContent = () => {
    switch(view) {
        case 'landing': return <LandingPage onNavigate={setView} />;
        case 'about': return <About />;
        case 'contact': return <Contact />;
        case 'auth': return <Auth />;
        case 'daily': 
        case 'plan': 
            // Account handles both Daily and Plan internally based on initialView prop
            // Waxaan u gudbinaynaa 'view' si Account u ogaado midka la furayo
            return <Account 
                key={session ? session.user.id : 'guest'} // Reset on login/out
                session={session} 
                isGuest={!session} 
                initialView={view} 
                onBackToHome={() => setView('landing')} 
            />;
        default: return <LandingPage onNavigate={setView} />;
    }
  };

  return (
    <div>
        {/* Global Navbar */}
        <Navbar 
            onNavigate={setView} 
            isLoggedIn={!!session} 
            onSignOut={() => { supabase.auth.signOut(); setView('landing'); }}
            onSignIn={() => setView('auth')}
            theme={theme}
            toggleTheme={toggleTheme}
        />
        
        {/* Page Content */}
        {renderContent()}

        {/* Global Footer (waxaad ka saari kartaa landing page footer-ka si aysan u noqon laba) */}
        <footer style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#888' }}>
            &copy; 2025 Maal Tracker
        </footer>
    </div>
  );
}
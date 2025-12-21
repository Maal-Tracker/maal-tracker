import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Components
import LandingPage from './components/LandingPage';
import AppLayout from './components/AppLayout';
import Today from './components/Today';
import Challenge from './components/Challenge'; // Faylka cusub ee Challenge

export default function App() {
  const [session, setSession] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();

  // 1. Hubinta Session-ka (Backend Logic ma beddelmin)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Navigation-ka Landing Page-ka
  const handleStartTracking = (type) => {
    if (type === 'guest') {
      setIsGuest(true);
      navigate('/today'); 
    } else if (type === 'login') {
      // Logic-ga Login-ka halkaan ayuu galayaa
    }
  };

  const handleSignOut = async () => {
    if (!isGuest) {
      await supabase.auth.signOut();
    }
    setIsGuest(false);
    setSession(null);
    navigate('/'); 
  };

  return (
    <div className="app-container">
      <Routes>
        {/* BOGGA HORE (LANDING PAGE) */}
        {!session && !isGuest ? (
          <Route path="*" element={<LandingPage onNavigate={handleStartTracking} />} />
        ) : (
          /* QAABKA GUDHA APP-KA (APP LAYOUT) */
          <Route element={<AppLayout onSignOut={handleSignOut} />}>
            {/* Si toos ah ugu gee Today marka uu soo galo */}
            <Route path="/" element={<Navigate to="/today" replace />} />
            
            {/* TODAY PAGE: Lama taaban design-kiisa iyo logic-giisa */}
            <Route path="/today" element={<Today session={session} isGuest={isGuest} />} />
            
            {/* CHALLENGE PAGE: Bogga cusub ee tababarka */}
            <Route path="/challenge" element={<Challenge session={session} isGuest={isGuest} />} />
            
            {/* Redirection haddii uu isku dayo bogag hore u jiray */}
            <Route path="/week" element={<Navigate to="/today" replace />} />
            <Route path="/month" element={<Navigate to="/today" replace />} />
            <Route path="/plan" element={<Navigate to="/today" replace />} />
          </Route>
        )}
      </Routes>
    </div>
  );
}
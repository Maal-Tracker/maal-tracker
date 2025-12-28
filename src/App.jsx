import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { TrackerProvider } from './context/TrackerContext';

// Components
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
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
      navigate('/login');
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

  // TrackerProvider will call useTracker(session) and provide tracker via context

  return (
    <div className="app-container">
      <TrackerProvider session={session}>
      <Routes>
        {/* BOGGA HORE (LANDING PAGE) */}
        {!session && !isGuest ? (
          <>
            <Route path="/login" element={<Auth />} />
            <Route path="*" element={<LandingPage onNavigate={handleStartTracking} />} />
          </>
        ) : (
          /* QAABKA GUDHA APP-KA (APP LAYOUT) */
          <Route element={<AppLayout onSignOut={handleSignOut} />}>
            {/* Si toos ah ugu gee Today marka uu soo galo */}
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/today" element={<Today session={session} isGuest={isGuest} />} />
            <Route path="/challenge" element={<Challenge session={session} isGuest={isGuest} />} />
            
            {/* Redirection haddii uu isku dayo bogag hore u jiray */}
            <Route path="/week" element={<Navigate to="/today" replace />} />
            <Route path="/month" element={<Navigate to="/today" replace />} />
            <Route path="/plan" element={<Navigate to="/today" replace />} />
          </Route>
        )}
      </Routes>
      </TrackerProvider>
    </div>
  );
}
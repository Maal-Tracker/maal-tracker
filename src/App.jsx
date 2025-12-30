import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { TrackerProvider } from './context/TrackerContext';

import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import AppLayout from './components/AppLayout';
import Today from './components/Today';
import Challenge from './components/Challenge';

export default function App() {
  const [session, setSession] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Session validation (protect against stale/broken sessions)
  const validateSession = (s) => {
    return s && s.user && s.access_token ? s : null;
  };

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data }) => {
      const validSession = validateSession(data.session);

      if (data.session && !validSession) {
        // stale session → force logout
        supabase.auth.signOut();
      }

      setSession(validSession);
      if (!validSession) setIsGuest(true);
    });

    // 2. Auth state changes (login / logout / refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const validSession = validateSession(session);
        setSession(validSession);
        if (!validSession) setIsGuest(true);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleStartTracking = (type) => {
    if (type === 'guest') setIsGuest(true);
  };

  const handleSignOut = async () => {
    if (!isGuest) await supabase.auth.signOut();
    setSession(null);
    setIsGuest(false);
  };

  return (
    <TrackerProvider session={session}>
      <Routes>

        {/* LANDING */}
        <Route
          path="/"
          element={
            session || isGuest
              ? <Navigate to="/today" replace />
              : <LandingPage onNavigate={handleStartTracking} />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            session
              ? <Navigate to="/today" replace />
              : <Auth />
          }
        />

        {/* APP */}
        <Route element={<AppLayout onSignOut={handleSignOut} />}>
          <Route
            path="/today"
            element={
              session || isGuest
                ? <Today session={session} isGuest={isGuest} />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="/challenge"
            element={
              session || isGuest
                ? <Challenge session={session} isGuest={isGuest} />
                : <Navigate to="/" replace />
            }
          />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </TrackerProvider>
  );
}

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      const isValidSession = Boolean(s && s.user && s.access_token);
      console.log('[AUTH DEBUG] getSession raw session:', s);
      console.log('[AUTH DEBUG]', isValidSession ? 'valid session' : 'invalid / stale session → treating as guest', isValidSession);
      if (s && (!s.user || !s.access_token)) {
        console.warn('[AUTH DEBUG] invalid / stale session → treating as guest');
      }
      setSession(s);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const isValidSession = Boolean(session && session.user && session.access_token);
        console.log('[AUTH DEBUG] onAuthStateChange event:', event);
        console.log('[AUTH DEBUG] session:', session);
        console.log('[AUTH DEBUG]', isValidSession ? 'valid session' : 'invalid / stale session → treating as guest', isValidSession);
        if (session && (!session.user || !session.access_token)) {
          console.warn('[AUTH DEBUG] invalid / stale session → treating as guest');
        }
        setSession(session);
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

        {/* LANDING PAGE */}
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

        {/* APP PAGES */}
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

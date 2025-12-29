import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTracker } from '../hooks/useTracker';
import {
  formatCurrency,
  getCurrencySymbol,
  AVAILABLE_CURRENCIES
} from '../utils/formatCurrency';

const TrackerContext = createContext(null);

export function TrackerProvider({ session, children }) {
  // consider a session valid only if it has expected fields
  const isValidSession = Boolean(session && session.user && session.access_token);
  /* ===============================
     1. DATABASE (LOGGED-IN USERS)
     =============================== */
  const {
    transactions: dbTransactions = [],
    totalSpentToday: dbTotal = 0,
    addExpense: addDbExpense,
    dailyLimit,
    loading
  } = useTracker(isValidSession ? session : null);

  /* ===============================
     2. GUEST TRANSACTIONS (LOCAL)
     =============================== */
  const [guestTransactions, setGuestTransactions] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Load guest data only on client to avoid SSR/localStorage issues
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('guest_transactions');
      if (saved) setGuestTransactions(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // persist guest data
  useEffect(() => {
    if (!isClient) return;
    if (!isValidSession) {
      try {
        localStorage.setItem(
          'guest_transactions',
          JSON.stringify(guestTransactions)
        );
      } catch {}
    }
  }, [guestTransactions, isValidSession, isClient]);

  // marka user login sameeyo → nadiifi guest
  useEffect(() => {
    if (!isClient) return;
    if (isValidSession) {
      setGuestTransactions([]);
      try {
        localStorage.removeItem('guest_transactions');
      } catch {}
    }
  }, [isValidSession, isClient]);

  /* ===============================
     3. CHALLENGE STATE (GLOBAL)
     =============================== */
  const [activeChallenge, setActiveChallenge] = useState(null); // '7day' | '30day' | null

  // 7-Day
  const [sevenDayLimit, setSevenDayLimit] = useState('');
  const [step7, setStep7] = useState('start'); // start | input | active

  // 30-Day
  const [thirtyDayGoal, setThirtyDayGoal] = useState('');
  const [step30, setStep30] = useState('start'); // start | input | active

  /* ===============================
     4. CURRENCY (GLOBAL + PERSIST)
     =============================== */
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('currency') || 'USD';
    } catch {
      return 'USD';
    }
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  /* ===============================
     5. ACTIVE SOURCE (GUEST vs USER)
     =============================== */
  const activeTransactions = isValidSession ? dbTransactions : (isClient ? guestTransactions : []);

  // spent today (works for both) — guard guest logic until client mount
  const totalSpentToday = useMemo(() => {
    if (isValidSession) return dbTotal;
    if (!isClient) return 0;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return guestTransactions
      .filter(t => {
        const d = new Date(t.created_at);
        return d >= start && d <= end && (t.type || 'expense') === 'expense';
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [guestTransactions, dbTotal, isValidSession, isClient]);

  /* ===============================
     6. ADD EXPENSE (SAFE)
     =============================== */
  const addExpense = async (amount, category) => {
    if (!amount) return;

    if (isValidSession) {
      // logged-in → Supabase
      await addDbExpense(amount, category);
    } else {
      // guest → local only
      const newTx = {
        id: crypto.randomUUID(),
        amount: Number(amount),
        category,
        description: category,
        created_at: new Date().toISOString(),
        type: 'expense'
      };
      setGuestTransactions(prev => [newTx, ...prev]);
    }
  };

  /* ===============================
     7. CURRENCY HELPERS
     =============================== */
  const formatAmount = (amount, opts = {}) =>
    formatCurrency(amount, currency, opts);

  const currencySymbol = getCurrencySymbol(currency);

  /* ===============================
     8. CONTEXT VALUE
     =============================== */
  const value = {
    // transactions
    transactions: activeTransactions,
    totalSpentToday,
    addExpense,
    dailyLimit,
    loading,

    // challenge
    activeChallenge,
    setActiveChallenge,
    sevenDayLimit,
    setSevenDayLimit,
    step7,
    setStep7,
    thirtyDayGoal,
    setThirtyDayGoal,
    step30,
    setStep30,

    // currency
    currency,
    setCurrency,
    formatAmount,
    currencySymbol,
    availableCurrencies: AVAILABLE_CURRENCIES
  };

  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTrackerContext() {
  const ctx = useContext(TrackerContext);
  if (!ctx) {
    throw new Error('useTrackerContext must be used inside TrackerProvider');
  }
  return ctx;
}

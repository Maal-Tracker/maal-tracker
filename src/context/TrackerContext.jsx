import { createContext, useContext, useState, useEffect } from 'react';
import { useTracker } from '../hooks/useTracker';
import { formatCurrency, getCurrencySymbol, AVAILABLE_CURRENCIES } from '../utils/formatCurrency';

const TrackerContext = createContext(null);

export function TrackerProvider({ session, children }) {
  // 1. Hel xogta Database-ka (Transactions logic)
  const { 
    transactions: dbTransactions, 
    totalSpentToday: dbTotal, 
    addExpense: addDbExpense, 
    dailyLimit, 
    loading 
  } = useTracker(session);

  // 2. Guest Transactions State
  const [guestTransactions, setGuestTransactions] = useState([]);

  // 3. CHALLENGE STATE (Halkan ayaan kusoo darnay si ay u persist-gareyso)
  const [activeChallenge, setActiveChallenge] = useState(null); // '7day', '30day', or null
  
  // 7-Day Challenge State
  const [sevenDayLimit, setSevenDayLimit] = useState('');
  const [step7, setStep7] = useState('start'); // 'start', 'input', 'active'

  // 30-Day Challenge State
  const [thirtyDayGoal, setThirtyDayGoal] = useState('');
  const [step30, setStep30] = useState('start'); // 'start', 'input', 'active'

  // 4. Currency (global, persisted)
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('currency') || 'USD';
    } catch (e) {
      return 'USD';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('currency', currency);
    } catch (e) {}
  }, [currency]);

  // Nadiifi Guest data marka user-ku soo galo
  useEffect(() => {
    if (session) {
      setGuestTransactions([]);
    }
  }, [session]);

  // Xisaabi wadarta Guest-ka
  const guestTotal = guestTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

  // Go'aami xogta la isticmaalayo
  const activeTransactions = session ? dbTransactions : guestTransactions;
  const activeTotal = session ? dbTotal : guestTotal;

  // Add Expense Function
  const addExpense = async (amount, category) => {
    if (session) {
      await addDbExpense(amount, category);
    } else {
      const newTx = {
        amount: parseFloat(amount),
        category: category,
        description: category,
        created_at: new Date().toISOString(),
        type: 'expense'
      };
      setGuestTransactions(prev => [newTx, ...prev]);
    }
  };

  // Currency helpers exposed to components
  const formatAmount = (amount, opts = {}) => formatCurrency(amount, currency, opts);
  const currencySymbol = getCurrencySymbol(currency);
  const availableCurrencies = AVAILABLE_CURRENCIES;

  const value = {
    // Transaction Data
    transactions: activeTransactions,
    totalSpentToday: activeTotal,
    addExpense,
    dailyLimit,
    loading,

    // Challenge Data (Exposed to Challenge.jsx)
    activeChallenge, setActiveChallenge,
    sevenDayLimit, setSevenDayLimit,
    step7, setStep7,
    thirtyDayGoal, setThirtyDayGoal,
    step30, setStep30
    ,
    // Currency
    currency, setCurrency, formatAmount, currencySymbol, availableCurrencies
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
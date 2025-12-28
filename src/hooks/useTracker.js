// src/hooks/useTracker.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useTracker(session) {
  const [transactions, setTransactions] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const start = new Date();
    start.setDate(start.getDate() - 30);
    start.setHours(0,0,0,0);

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('type', 'expense')
      .gte('created_at', start.toISOString())
      .order('created_at', { ascending: false });

    if (!error) {
      setTransactions(data || []);
    }

    const today = new Date().toISOString().split('T')[0];
    const { data: plan } = await supabase
      .from('plans')
      .select('daily_limit')
      .eq('user_id', session.user.id)
      .lte('start_date', today)
      .gte('end_date', today)
      .maybeSingle();

    if (plan?.daily_limit) setDailyLimit(plan.daily_limit);

    setLoading(false);
  }, [session]);

  const addExpense = async (amount, category) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: session.user.id,
        amount: Number(amount),
        category,
        type: 'expense'
      })
      .select()
      .single();

    if (!error && data) {
      // ⭐️ muhiim: HALKAN ayaa spend-ku ku sii noolaanayaa
      setTransactions(prev => [data, ...prev]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalSpentToday = transactions.reduce((sum, t) => {
    const d = new Date(t.created_at);
    const s = new Date(); s.setHours(0,0,0,0);
    const e = new Date(); e.setHours(23,59,59,999);
    return d >= s && d <= e ? sum + Number(t.amount) : sum;
  }, 0);

  return {
    transactions,
    totalSpentToday,
    dailyLimit,
    addExpense,
    loading
  };
}

// src/components/Plan.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Plan({ session, transactions, isGuest }) { 
  const [month, setMonth] = useState('January');
  const [goal, setGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Guest: Local State array. User: Fetch from DB.
  const [savedPlans, setSavedPlans] = useState([]);

  useEffect(() => {
    if (!isGuest) fetchPlans();
  }, [session, isGuest]);

  const fetchPlans = async () => {
    if (!session?.user) return;
    const { data } = await supabase.from('plans').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    if (data) setSavedPlans(data);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    
    const planData = {
      id: isGuest ? Date.now() : undefined, // Guest gets fake ID
      month,
      budget_target: parseFloat(goal), 
      notes,
      created_at: new Date().toISOString()
    };

    if (isGuest) {
        // GUEST: Save locally
        setSavedPlans([planData, ...savedPlans]);
        alert(`(Demo) Goal for ${month} saved!`);
    } else {
        // USER: Save to DB
        setLoading(true);
        await supabase.from('plans').insert([{...planData, user_id: session.user.id}]);
        alert(`Goal for ${month} saved!`);
        fetchPlans();
        setLoading(false);
    }
    setGoal('');
    setNotes('');
  };

  // --- PROGRESS BAR CALCULATION ---
  const getProgressData = (plan) => {
    const savingsGoal = plan.budget_target || 1;
    const currentMonthTransactions = transactions.filter(t => {
        if (!t.transaction_date) return false;
        // Basic month check (You might need year check in production)
        const tMonth = new Date(t.transaction_date).toLocaleString('en-US', { month: 'long' });
        return tMonth === plan.month;
    });

    const income = currentMonthTransactions.filter(t => t.transaction_type === 'Income').reduce((s, t) => s + (t.amount||0), 0);
    const expense = currentMonthTransactions.filter(t => t.transaction_type === 'Expense').reduce((s, t) => s + (t.amount||0), 0);
    const netBalance = income - expense;

    let percent = (netBalance / savingsGoal) * 100;
    let color = '#28a745'; // Green
    if (percent < 50) color = '#ffc107'; // Orange
    if (netBalance < 0) color = '#dc3545'; // Red

    return { 
        net: netBalance.toFixed(2), 
        pct: Math.max(0, Math.min(100, Math.round(percent))), 
        color,
        remaining: (savingsGoal - netBalance).toFixed(2)
    };
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Monthly Savings Goal</h2>
      
      <form onSubmit={handleSavePlan} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: 'white', marginBottom: '30px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Month:</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Goal Amount ($):</label>
          <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} style={{ width: '100%', padding: '8px' }} required />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: isGuest ? '#555' : '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            {isGuest ? 'Save (Demo)' : (loading ? 'Saving...' : 'Save Goal')}
        </button>
      </form>

      <div>
        {savedPlans.map((plan) => {
            const { net, pct, color, remaining } = getProgressData(plan);
            return (
              <div key={plan.id} style={{ background: 'white', padding: '15px', marginBottom: '15px', borderLeft: `5px solid ${color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{plan.month}</span>
                  <span>Goal: ${plan.budget_target}</span>
                </div>
                <div style={{ marginTop: '10px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span>Net: ${net}</span>
                      <span>Remaining: ${remaining}</span>
                   </div>
                   <div style={{ height: '15px', background: '#eee', borderRadius: '10px', overflow: 'hidden', marginTop: '5px' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color }}></div>
                   </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}
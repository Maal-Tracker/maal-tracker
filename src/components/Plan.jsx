// src/components/Plan.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Plan({ session, transactions, isGuest }) { 
  // State-yada Foomka
  const [selectedMonth, setSelectedMonth] = useState('January'); // Bisha la dooranayo
  const [goalAmount, setGoalAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State-ka Plans-ka la keydiyay
  const [savedPlans, setSavedPlans] = useState([]);

  // 1. Soo rog Plans-ka haddii uusan Guest ahayn
  useEffect(() => {
    if (!isGuest && session?.user) {
        fetchPlans();
    }
  }, [session, isGuest]);

  const fetchPlans = async () => {
    try {
        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSavedPlans(data || []);
    } catch (error) {
        console.error("Error fetching plans:", error.message);
    }
  };

  // 2. Keydinta Plan-ka (Guest vs User)
  const handleSavePlan = async (e) => {
    e.preventDefault();
    
    // Hubi haddii Plan bishan ah uu horey u jiray (Optional: waad cusboonaysiin kartaa)
    const existingPlanIndex = savedPlans.findIndex(p => p.month === selectedMonth);
    
    const newPlan = {
      id: isGuest ? Date.now() : undefined, // Fake ID for guest
      month: selectedMonth,
      budget_target: parseFloat(goalAmount),
      notes: notes,
      user_id: session?.user?.id
    };

    if (isGuest) {
        // GUEST: Local Update
        if (existingPlanIndex >= 0) {
            // Update existing
            const updatedPlans = [...savedPlans];
            updatedPlans[existingPlanIndex] = newPlan;
            setSavedPlans(updatedPlans);
        } else {
            // Add new
            setSavedPlans([newPlan, ...savedPlans]);
        }
        alert(`(Demo) Goal for ${selectedMonth} set to $${goalAmount}`);
    } else {
        // USER: Supabase Insert/Update
        setLoading(true);
        // Halkan waxaan isticmaaleynaa upsert ama delete/insert si fudud
        // Laakiin aan ku darno insert cusub hadda
        const { error } = await supabase.from('plans').insert([
            { month: selectedMonth, budget_target: parseFloat(goalAmount), notes, user_id: session.user.id }
        ]);

        if (error) {
            alert('Error saving plan: ' + error.message);
        } else {
            alert(`Goal for ${selectedMonth} saved successfully!`);
            fetchPlans(); // Refresh list
        }
        setLoading(false);
    }

    // Reset Form
    setGoalAmount('');
    setNotes('');
  };

  // 3. XISAABINTA PROGRESS-KA (CORE LOGIC)
  // Function-kan wuxuu isku xirayaa Plan-ka iyo Transactions-ka dhabta ah
  const calculateProgress = (plan) => {
      const targetMonth = plan.month;
      const targetGoal = plan.budget_target || 1; // Ka hortag in 0 loo qaybiyo

      // A. Shaandhee Transactions-ka bishaas kaliya
      const monthlyTransactions = transactions.filter(t => {
          if (!t.transaction_date) return false;
          // U beddel taariikhda magaca bisha (e.g., "2025-02-12" -> "February")
          const tDate = new Date(t.transaction_date);
          const tMonthName = tDate.toLocaleString('default', { month: 'long' });
          return tMonthName === targetMonth;
      });

      // B. Xisaabi Income iyo Expense bishaas
      const totalIncome = monthlyTransactions
          .filter(t => t.transaction_type === 'Income')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

      const totalExpense = monthlyTransactions
          .filter(t => t.transaction_type === 'Expense')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

      // C. Xisaabi Net Balance (Waa lacagta keydka kuu geli karta)
      const netBalance = totalIncome - totalExpense;

      // D. Xisaabi Boqolleyda (Percentage)
      let percentage = (netBalance / targetGoal) * 100;
      
      // Xaddid boqolleyda inta u dhaxaysa 0 iyo 100 (muuqaalka kaliya)
      const displayPercentage = Math.max(0, Math.min(100, Math.round(percentage)));
      
      // Midabka Progress Bar-ka
      let color = '#dc3545'; // Red (Default/Low)
      if (displayPercentage >= 50) color = '#ffc107'; // Yellow (Medium)
      if (displayPercentage >= 100) color = '#28a745'; // Green (Success)

      return {
          income: totalIncome,
          expense: totalExpense,
          netBalance: netBalance,
          percentage: Math.round(percentage), // Kan dhabta ah (wuu ka badan karaa 100%)
          displayPercentage,
          color,
          remaining: targetGoal - netBalance
      };
  };

  // Liiska Bilaha
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Savings Goals</h2>
          <p style={{ color: '#666' }}>Plan your monthly savings and track your progress.</p>
      </div>
      
      {/* 1. FOOMKA QORSHEYNTA */}
      <div className="transaction-card" style={{ marginBottom: '40px' }}>
        <h3 className="form-title">Set New Goal</h3>
        <form onSubmit={handleSavePlan}>
            <div className="form-grid">
                <div className="input-wrapper">
                    <label>Select Month</label>
                    <select 
                        className="modern-input" 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                
                <div className="input-wrapper">
                    <label>Target Amount ($)</label>
                    <input 
                        type="number" 
                        className="modern-input" 
                        placeholder="e.g. 1000" 
                        value={goalAmount} 
                        onChange={(e) => setGoalAmount(e.target.value)} 
                        required 
                    />
                </div>
            </div>

            <div className="input-wrapper" style={{ marginBottom: '20px' }}>
                <label>Notes (Optional)</label>
                <input 
                    type="text" 
                    className="modern-input" 
                    placeholder="Why are you saving?" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                />
            </div>

            <button type="submit" disabled={loading} className="add-btn">
                {loading ? 'Saving...' : 'Set Goal'}
            </button>
        </form>
      </div>

      {/* 2. LIISKA QORSHAYAASHA & PROGRESS-KA */}
      <div>
        <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>Your Progress</h3>
        
        {savedPlans.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                No savings goals set yet.
            </p>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {savedPlans.map((plan) => {
                    const stats = calculateProgress(plan);
                    
                    return (
                        <div key={plan.id || plan.month} style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div>
                                    <h4 style={{ fontSize: '20px', margin: 0 }}>{plan.month}</h4>
                                    <span style={{ fontSize: '13px', color: '#888' }}>{plan.notes || 'No notes'}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', color: '#666' }}>Goal</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>${plan.budget_target}</div>
                                </div>
                            </div>

                            {/* Financial Summary for Month */}
                            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', marginBottom: '15px', color: '#555' }}>
                                <span style={{ background: '#f0fdf4', padding: '4px 8px', borderRadius: '4px', color: '#166534' }}>
                                    Income: +${stats.income}
                                </span>
                                <span style={{ background: '#fef2f2', padding: '4px 8px', borderRadius: '4px', color: '#991b1b' }}>
                                    Expense: -${stats.expense}
                                </span>
                            </div>

                            {/* Progress Bar Container */}
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px', fontWeight: '600' }}>
                                    <span style={{ color: stats.netBalance >= 0 ? '#28a745' : '#dc3545' }}>
                                        Net Saved: ${stats.netBalance}
                                    </span>
                                    <span>{stats.percentage}%</span>
                                </div>
                                
                                <div style={{ width: '100%', height: '12px', background: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${stats.displayPercentage}%`, 
                                        height: '100%', 
                                        background: stats.color, 
                                        transition: 'width 0.5s ease-in-out' 
                                    }}></div>
                                </div>
                            </div>

                            {/* Status Message */}
                            <div style={{ fontSize: '13px', textAlign: 'right', marginTop: '5px' }}>
                                {stats.netBalance >= plan.budget_target ? (
                                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>🎉 Goal Reached!</span>
                                ) : (
                                    <span style={{ color: '#666' }}>
                                        You need <b>${stats.remaining > 0 ? stats.remaining.toFixed(2) : 0}</b> more to reach your goal.
                                    </span>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>
        )}
      </div>

    </div>
  );
}
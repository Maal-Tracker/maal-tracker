// src/components/Plan.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Plan({ session, transactions, isGuest }) { 
  // State-yada Foomka
  const [selectedMonth, setSelectedMonth] = useState('January'); 
  const [goalAmount, setGoalAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State-ka Plans-ka la keydiyay
  const [savedPlans, setSavedPlans] = useState([]);

  // State cusub: Haynta Plan-ka la Tifaftirayo
  const [editingPlanId, setEditingPlanId] = useState(null); 

  // 1. Soo rog Plans-ka haddii uusan Guest ahayn
  useEffect(() => {
    if (!isGuest && session?.user) {
        fetchPlans();
    }
    // Haddii uu guest yahay, ka hubi local storage-ka ama ha maranaado
  }, [session, isGuest]);

  const fetchPlans = async () => {
    setLoading(true);
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
    } finally {
        setLoading(false);
    }
  };

  // --- DELETE FUNCTION ---
  const handleDeletePlan = async (id) => {
    if (!window.confirm("Ma hubtaa inaad tirtirto qorshahan keydka ah?")) return;

    if (isGuest) {
        // GUEST: Local Delete
        setSavedPlans(prev => prev.filter(p => p.id !== id));
        return;
    }

    try {
        const { error } = await supabase
            .from('plans')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        // Success: Remove from local state
        setSavedPlans(prev => prev.filter(p => p.id !== id));

    } catch (error) {
        console.error("Error deleting plan:", error.message);
        alert("Qorshaha lama tirtiri karo. Hubi Supabase Policy (Delete).");
    }
  };
  
  // --- START EDIT FUNCTION ---
  const startEditPlan = (plan) => {
    // Ka dhig foomka mid ku buuxa xogta qorshaha
    setSelectedMonth(plan.month);
    setGoalAmount(plan.budget_target.toString());
    setNotes(plan.notes || '');
    setEditingPlanId(plan.id); // Set the ID si foomku u ogaado inuu update sameynayo
  };

  // --- SUBMIT/SAVE/UPDATE FUNCTION ---
  const handleSubmitPlan = async (e) => {
    e.preventDefault();
    
    const newGoalAmount = parseFloat(goalAmount);

    if (isNaN(newGoalAmount) || newGoalAmount <= 0) {
        alert("Fadlan geli lacag sax ah.");
        return;
    }

    const planData = {
        month: selectedMonth,
        budget_target: newGoalAmount,
        notes: notes,
        user_id: session?.user?.id
    };

    if (isGuest) {
        // GUEST MODE: INSERT or UPDATE
        if (editingPlanId) {
            // Update existing
            setSavedPlans(prev => prev.map(p => 
                p.id === editingPlanId ? { ...p, ...planData, id: editingPlanId } : p
            ));
        } else {
            // Insert new
            setSavedPlans([{ ...planData, id: Date.now() }, ...savedPlans]);
        }
    } else {
        // USER MODE: Supabase INSERT or UPDATE
        setLoading(true);

        if (editingPlanId) {
            // UPDATE
            const { error } = await supabase.from('plans')
                .update(planData)
                .eq('id', editingPlanId);

            if (error) alert('Error updating plan: ' + error.message);
            else alert('Goal updated successfully!');

        } else {
            // INSERT
            const { error } = await supabase.from('plans').insert([planData]);
            
            if (error) alert('Error saving plan: ' + error.message);
            else alert(`Goal for ${selectedMonth} saved successfully!`);
        }
        fetchPlans(); // Refresh list after any Supabase action
        setLoading(false);
    }

    // Reset form states and editing status
    setGoalAmount('');
    setNotes('');
    setEditingPlanId(null);
  };

  // --- PROGRESS CALCULATION (From previous step) ---
  const calculateProgress = (plan) => {
      const targetMonth = plan.month;
      const targetGoal = plan.budget_target || 1; 

      const monthlyTransactions = transactions.filter(t => {
          if (!t.transaction_date) return false;
          const tDate = new Date(t.transaction_date);
          const tMonthName = tDate.toLocaleString('default', { month: 'long' });
          return tMonthName === targetMonth;
      });

      const totalIncome = monthlyTransactions
          .filter(t => t.transaction_type === 'Income')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

      const totalExpense = monthlyTransactions
          .filter(t => t.transaction_type === 'Expense')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

      const netBalance = totalIncome - totalExpense;
      let percentage = (netBalance / targetGoal) * 100;
      
      const displayPercentage = Math.max(0, Math.min(100, Math.round(percentage)));
      
      let color = '#dc3545'; 
      if (displayPercentage >= 50) color = '#ffc107'; 
      if (displayPercentage >= 100) color = '#28a745'; 

      return {
          income: totalIncome,
          expense: totalExpense,
          netBalance: netBalance,
          percentage: Math.round(percentage), 
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
          <p style={{ color: 'var(--text-muted)' }}>Plan your monthly savings and track your progress.</p>
      </div>
      
      {/* 1. FOOMKA QORSHEYNTA */}
      <div className="transaction-card" style={{ marginBottom: '40px' }}>
        <h3 className="form-title">{editingPlanId ? 'Edit Goal' : 'Set New Goal'}</h3>
        <form onSubmit={handleSubmitPlan}>
            <div className="form-grid">
                <div className="input-wrapper">
                    <label>Select Month</label>
                    <select 
                        className="modern-input" 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        // Ma dooran kartid bisha haddii aad edit ku jirto
                        disabled={!!editingPlanId} 
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

            <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" disabled={loading} className="add-btn">
                    {loading ? 'Processing...' : editingPlanId ? 'Update Goal' : 'Set Goal'}
                </button>
                {editingPlanId && (
                    <button 
                        type="button" 
                        onClick={() => setEditingPlanId(null)} 
                        className="add-btn" 
                        style={{ background: '#6c757d', color: 'white', width: '30%' }}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
      </div>

      {/* 2. LIISKA QORSHAYAASHA & PROGRESS-KA */}
      <div>
        <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>Your Progress</h3>
        
        {loading && !isGuest ? (
            <div style={{textAlign:'center', padding:'30px'}}>Loading plans...</div>
        ) : savedPlans.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                No savings goals set yet.
            </p>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {savedPlans.map((plan) => {
                    const stats = calculateProgress(plan);
                    
                    return (
                        <div key={plan.id || plan.month} style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                            
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div>
                                    <h4 style={{ fontSize: '20px', margin: 0, color:'var(--text-main)' }}>{plan.month}</h4>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{plan.notes || 'No notes'}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Goal</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)' }}>${plan.budget_target}</div>
                                </div>
                            </div>

                            {/* Financial Summary for Month */}
                            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', marginBottom: '15px', color: 'var(--text-muted)' }}>
                                <span style={{ background: 'var(--box-pink)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-main)' }}>
                                    Income: +${stats.income.toFixed(2)}
                                </span>
                                <span style={{ background: 'var(--box-gray)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-main)' }}>
                                    Expense: -${stats.expense.toFixed(2)}
                                </span>
                            </div>

                            {/* Progress Bar Container */}
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px', fontWeight: '600' }}>
                                    <span style={{ color: stats.netBalance >= 0 ? '#28a745' : '#dc3545' }}>
                                        Net Saved: ${stats.netBalance.toFixed(2)}
                                    </span>
                                    <span>{stats.percentage}%</span>
                                </div>
                                
                                <div style={{ width: '100%', height: '12px', background: 'var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${stats.displayPercentage}%`, 
                                        height: '100%', 
                                        background: stats.color, 
                                        transition: 'width 0.5s ease-in-out' 
                                    }}></div>
                                </div>
                            </div>

                            {/* Actions and Status */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center', marginTop: '10px' }}>
                                {/* Status Message */}
                                <div style={{ fontSize: '13px' }}>
                                    {stats.netBalance >= plan.budget_target ? (
                                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>🎉 Goal Reached!</span>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)' }}>
                                            Need <b>${stats.remaining > 0 ? stats.remaining.toFixed(2) : 0}</b> more.
                                        </span>
                                    )}
                                </div>
                                
                                {/* Action Buttons */}
                                <div>
                                    <button onClick={() => startEditPlan(plan)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff', fontWeight: '600', marginRight: '10px' }}>
                                        ✏️ Edit
                                    </button>
                                    <button onClick={() => handleDeletePlan(plan.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontWeight: '600' }}>
                                        🗑️ Delete
                                    </button>
                                </div>
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
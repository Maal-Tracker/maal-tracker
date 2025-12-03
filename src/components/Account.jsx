// src/components/Account.jsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import TransactionForm from './TransactionForm'; 
import Plan from './Plan'; 
import Analysis from './Analysis'; 
import EditTransactionModal from './EditTransactionModal'; // Hadda ma isticmaalno, laakiin waa inuu ku jiraa haddii aad u baahato

export default function Account({ session, isGuest, initialView, onBackToHome, onSignOut, onGoToLogin }) { 
  const [view, setView] = useState(initialView || 'daily'); 
  const [username, setUsername] = useState(isGuest ? 'Guest' : '');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]); 
  const [editingTransaction, setEditingTransaction] = useState(null);

  const user = session?.user;

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    if (isGuest) { 
        setLoading(false); 
        // Xitaa Guest Mode-ka, waa inaan wax u helnaa tusaale ahaan ama haddii aanu ka soo qaadno local storage
        // Laakiin hadda, waxaanu ku tiirsanaanaynaa 'transactions' oo maran haddii isGuest
        return; 
    }
    setLoading(true);
    try {
        // Fetch Profile Username
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).maybeSingle();
        if (profile) setUsername(profile.username);
        
        // Fetch Transactions
        const { data: trans, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('transaction_date', { ascending: false });
        
        if (error) throw error;
        setTransactions(trans || []);
    } catch (error) { 
        console.error("Error fetching data:", error); 
    } finally { 
        setLoading(false); 
    }
  }, [user, isGuest]);

  useEffect(() => { 
      fetchData(); 
  }, [fetchData]);

  // --- ACTIONS ---
  
  // 1. Transaction Insert
  const handleNewTransaction = async (newTransaction) => {
    if (isGuest) {
        // GUEST: Add to local state only
        const guestTrans = { ...newTransaction, id: Date.now() };
        setTransactions([guestTrans, ...transactions]);
        return;
    }
    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert([{...newTransaction, user_id: user.id}])
            .select();
            
        if (error) throw error;
        setTransactions([data[0], ...transactions]);
    } catch (error) { 
        alert(error.message); 
    }
  };

  // 2. Transaction Delete (La Saxay)
  const handleDelete = async (id) => {
    if (!window.confirm("Ma hubtaa inaad tirtirto xogtan?")) return;

    // HADDII UU GUEST YAHAY (Kaliya Local State ka tirtir)
    if (isGuest) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        return;
    }

    // HADDII UU USER YAHAY (Supabase ka tirtir marka hore)
    try {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) {
            throw error; // Haddii qalad jiro, u gudbi catch-ka
        }

        // Hadda oo Supabase laga tirtiray, ka saar shaashadda
        setTransactions(prev => prev.filter(t => t.id !== id));
        
    } catch (error) {
        console.error("Error deleting:", error.message);
        alert("Ma tirtiri karo xogtan! Waxaa laga yaabaa in Supabase Policy-gu uu diiday.");
    }
  };


  const handleUpdateSuccess = (updatedItem) => {
      setTransactions(transactions.map(t => t.id === updatedItem.id ? updatedItem : t));
      setEditingTransaction(null);
  };

  if (loading && !isGuest) return <div style={{textAlign:'center', padding:'50px', color: 'var(--text-main)'}}>Loading...</div>;

  return (
    <div className="dashboard-container">
        
        {/* --- DASHBOARD HEADER --- */}
        <div className="dashboard-header">
            {/* Back Button */}
            <button onClick={onBackToHome} className="back-menu-btn">
                <span>←</span> Back to Menu
            </button>

            {/* Toggle (Daily / Plan) */}
            <div className="view-toggle">
                <button onClick={() => setView('daily')} className={`toggle-btn ${view === 'daily' ? 'active' : ''}`}>Daily</button>
                <button onClick={() => setView('plan')} className={`toggle-btn ${view === 'plan' ? 'active' : ''}`}>Plan</button>
            </div>

            {/* User Info / Login Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {isGuest ? 'Guest Mode' : username || 'User'}
                </span>
                {isGuest ? (
                    <button onClick={onGoToLogin} className="btn-login" style={{background: '#007bff', color:'white'}}>Login</button>
                ) : null}
            </div>
        </div>

        {/* --- CONTENT --- */}
        {view === 'plan' ? (
            <Plan session={session} transactions={transactions} isGuest={isGuest} />
        ) : (
            <>
                {/* TRANSACTION FORM */}
                <TransactionForm session={session} onTransactionInsert={handleNewTransaction} isGuest={isGuest} />
                
                {/* ANALYSIS (Ku tiirsan transactions) */}
                <Analysis transactions={transactions} />

                {/* TRANSACTION HISTORY */}
                <div className="transaction-card" style={{marginTop: '30px'}}>
                    <h3 style={{borderBottom:'1px solid var(--border-color)', paddingBottom:'10px', color: 'var(--text-main)'}}>Recent History</h3>
                    {transactions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No transactions yet.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Date</th>
                                    <th style={{ padding: '10px' }}>Description</th>
                                    <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12px 10px', fontSize: '14px', color: 'var(--text-main)' }}>{t.transaction_date}</td>
                                        <td style={{ padding: '12px 10px', fontWeight: '500', color: 'var(--text-main)' }}>{t.description}</td>
                                        <td style={{ padding: '12px 10px', textAlign: 'right', color: t.transaction_type === 'Income' ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                                            {t.transaction_type === 'Income' ? '+' : '-'}${t.amount}
                                        </td>
                                        <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                            <button onClick={() => handleDelete(t.id)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontSize:'18px' }}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </>
        )}

        {editingTransaction && (
            <EditTransactionModal transaction={editingTransaction} onClose={() => setEditingTransaction(null)} onUpdateSuccess={handleUpdateSuccess} isGuest={isGuest} />
        )}
    </div>
  );
}
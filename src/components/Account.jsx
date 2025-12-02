// src/components/Account.jsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import TransactionForm from './TransactionForm'; 
import Plan from './Plan'; 
import Analysis from './Analysis'; 
import EditTransactionModal from './EditTransactionModal'; 

export default function Account({ session, isGuest, initialView, onBackToHome, onSignOut, onGoToLogin }) { 
  const [view, setView] = useState(initialView || 'daily'); 
  const [username, setUsername] = useState(isGuest ? 'Guest' : '');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]); 
  const [editingTransaction, setEditingTransaction] = useState(null);

  const user = session?.user;

  // --- DATA FETCHING (Sidii hore) ---
  const fetchData = useCallback(async () => {
    if (isGuest) { setLoading(false); return; }
    setLoading(true);
    try {
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).maybeSingle();
        if (profile) setUsername(profile.username);
        const { data: trans, error } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('transaction_date', { ascending: false });
        if (error) throw error;
        setTransactions(trans || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, [user, isGuest]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- ACTIONS (Sidii hore) ---
  const handleNewTransaction = async (newTransaction) => {
    if (isGuest) {
        const guestTrans = { ...newTransaction, id: Date.now() };
        setTransactions([guestTrans, ...transactions]);
        return;
    }
    try {
        const { data, error } = await supabase.from('transactions').insert([{...newTransaction, user_id: user.id}]).select();
        if (error) throw error;
        setTransactions([data[0], ...transactions]);
    } catch (error) { alert(error.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    if (isGuest) { setTransactions(transactions.filter(t => t.id !== id)); return; }
    try { await supabase.from('transactions').delete().eq('id', id); setTransactions(transactions.filter(t => t.id !== id)); } 
    catch (error) { alert(error.message); }
  };

  const handleUpdateSuccess = (updatedItem) => {
      setTransactions(transactions.map(t => t.id === updatedItem.id ? updatedItem : t));
      setEditingTransaction(null);
  };

  if (loading && !isGuest) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>;

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
                <span style={{ fontSize: '14px', color: '#888', fontStyle: 'italic' }}>
                    {isGuest ? 'Guest Mode' : username || 'User'}
                </span>
                {isGuest ? (
                    <button onClick={onGoToLogin} style={{padding: '8px 16px', background: '#007bff', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'}}>Login</button>
                ) : null}
            </div>
        </div>

        {/* --- CONTENT --- */}
        {view === 'plan' ? (
            <Plan session={session} transactions={transactions} isGuest={isGuest} />
        ) : (
            <>
                {/* TRANSACTION FORM (Waa la nadiifiyay) */}
                <TransactionForm session={session} onTransactionInsert={handleNewTransaction} isGuest={isGuest} />
                
                {/* ANALYSIS (Waa la nadiifiyay) */}
                <Analysis transactions={transactions} />

                {/* TRANSACTION HISTORY */}
                <div className="transaction-card" style={{marginTop: '30px'}}>
                    <h3 style={{borderBottom:'1px solid #eee', paddingBottom:'10px'}}>Recent History</h3>
                    {transactions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>No transactions yet.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ color: '#888', fontSize: '14px', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Date</th>
                                    <th style={{ padding: '10px' }}>Description</th>
                                    <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                        <td style={{ padding: '12px 10px', fontSize: '14px' }}>{t.transaction_date}</td>
                                        <td style={{ padding: '12px 10px', fontWeight: '500' }}>{t.description}</td>
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
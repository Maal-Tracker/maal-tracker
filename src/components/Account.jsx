// src/components/Account.jsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import TransactionForm from './TransactionForm'; 
import Plan from './Plan'; 
import Analysis from './Analysis'; 
import EditTransactionModal from './EditTransactionModal'; 

export default function Account({ session, isGuest, initialView, onBackToHome, onSignOut, onGoToLogin }) { 
  // View State (Default to Daily)
  const [view, setView] = useState(initialView || 'daily');
  const [username, setUsername] = useState(isGuest ? 'Guest' : '');
  const [loading, setLoading] = useState(true);
  
  // Transaction Data
  const [transactions, setTransactions] = useState([]); 
  const [editingTransaction, setEditingTransaction] = useState(null);

  const user = session?.user;

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    // HADDII UU GUEST YAHAY, JOOJI LOODINGKA OO KA BAX FUNCTION-KA
    if (isGuest) {
        setLoading(false);
        return; 
    }

    setLoading(true);
    try {
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).maybeSingle();
        if (profile) setUsername(profile.username);

        const { data: trans, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('transaction_date', { ascending: false });
        
        if (error) throw error;
        setTransactions(trans || []);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        setLoading(false);
    }
  }, [user, isGuest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- ACTIONS ---

  const handleNewTransaction = async (newTransaction) => {
    if (isGuest) {
        // GUEST: Local State
        const guestTrans = { ...newTransaction, id: Date.now() };
        setTransactions([guestTrans, ...transactions]);
        return;
    }

    // USER: Supabase
    try {
        const { data, error } = await supabase.from('transactions').insert([{...newTransaction, user_id: user.id}]).select();
        if (error) throw error;
        setTransactions([data[0], ...transactions]);
    } catch (error) {
        alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    if (isGuest) {
        setTransactions(transactions.filter(t => t.id !== id));
        return;
    }

    try {
        await supabase.from('transactions').delete().eq('id', id);
        setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
        alert(error.message);
    }
  };

  const handleUpdateSuccess = (updatedItem) => {
      setTransactions(transactions.map(t => t.id === updatedItem.id ? updatedItem : t));
      setEditingTransaction(null);
  };

  // --- RENDER ---

  if (loading && !isGuest) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* TOP BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <button 
                onClick={onBackToHome}
                style={{ padding: '8px 15px', border: '1px solid #333', borderRadius: '5px', cursor: 'pointer', background: 'white' }}
            >
                ← Back to Menu
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setView('daily')} style={{ padding: '8px 20px', background: view === 'daily' ? '#333' : '#eee', color: view === 'daily' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Daily</button>
                <button onClick={() => setView('plan')} style={{ padding: '8px 20px', background: view === 'plan' ? '#333' : '#eee', color: view === 'plan' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Plan</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontStyle: 'italic', color: '#666', marginRight: '10px' }}>
                    {isGuest ? 'Guest Mode' : `User: ${username || user?.email}`}
                </span>
                
                {isGuest ? (
                    <button onClick={onGoToLogin} style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
                ) : (
                    <button onClick={onSignOut} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Sign Out</button>
                )}
            </div>
        </div>

        {/* CONTENT */}
        {view === 'plan' ? (
            <Plan session={session} transactions={transactions} isGuest={isGuest} />
        ) : (
            <>
                {/* DAILY VIEW */}
                <div style={{ marginBottom: '40px' }}>
                    <TransactionForm session={session} onTransactionInsert={handleNewTransaction} isGuest={isGuest} />
                </div>
                
                <Analysis transactions={transactions} />

                <div style={{ marginTop: '40px' }}>
                    <h3>Transaction History</h3>
                    {transactions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', padding: '20px', background: '#f9f9f9' }}>
                            No transactions found.
                        </p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Desc</th>
                                    <th style={{ padding: '10px', textAlign: 'right' }}>Type</th>
                                    <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{t.transaction_date}</td>
                                        <td style={{ padding: '10px' }}>{t.description}</td>
                                        <td style={{ padding: '10px', textAlign: 'right', color: t.transaction_type === 'Income' ? 'green' : 'red' }}>{t.transaction_type}</td>
                                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>${t.amount}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <button onClick={() => setEditingTransaction(t)} style={{ marginRight: '10px', cursor: 'pointer', border:'none', background:'none', color:'blue' }}>Edit</button>
                                            <button onClick={() => handleDelete(t.id)} style={{ color: 'red', cursor: 'pointer', border:'none', background:'none' }}>Delete</button>
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
            <EditTransactionModal 
                transaction={editingTransaction} 
                onClose={() => setEditingTransaction(null)} 
                onUpdateSuccess={handleUpdateSuccess}
                isGuest={isGuest}
            />
        )}
    </div>
  );
}
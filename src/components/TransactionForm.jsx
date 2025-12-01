// src/components/TransactionForm.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function TransactionForm({ session, onTransactionInsert, isGuest, onBack }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState('Income');
  const [transaction_date, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const transactionData = {
        // UserID logic here...
        amount: parseFloat(amount),
        description,
        transaction_type: transactionType,
        transaction_date,
    };
    
    // Logic-ga keydinta (Guest vs User) - Waan soo gaabiyay si aan diirada u saaro designka
    if (isGuest) {
        const newId = Date.now();
        onTransactionInsert({...transactionData, id: newId});
    } else {
         const { data, error } = await supabase.from('transactions').insert([{...transactionData, user_id: session.user.id}]).select();
         if (!error) onTransactionInsert(data[0]);
    }
    setLoading(false);
    setAmount(''); setDescription('');
  };

  return (
    <div className="form-card">
      {/* Header oo leh Back Button */}
      <div className="form-header">
        <button onClick={onBack} className="back-btn">Back</button>
        <h3>Add New Transaction</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            {/* Type Radio */}
            <div>
                <label style={{marginBottom: '10px', display:'block'}}>Type</label>
                <div className="radio-group">
                    <label style={{color: 'var(--primary-color)', fontWeight:'bold'}}><input type="radio" name="type" value="Income" checked={transactionType === 'Income'} onChange={(e) => setTransactionType(e.target.value)} /> Income</label>
                    <label><input type="radio" name="type" value="Expense" checked={transactionType === 'Expense'} onChange={(e) => setTransactionType(e.target.value)} /> Expense</label>
                </div>
            </div>
            {/* Amount */}
            <div>
                <label style={{marginBottom: '10px', display:'block'}}>Amount</label>
                <input type="number" className="input-field" style={{width: '120px'}} value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
        </div>

        <div className="input-group">
            <input type="text" className="input-field" placeholder="Description (Optional)" style={{height: '80px'}} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="input-group">
            <label>Date:</label>
            <input type="date" className="input-field" style={{width: '150px'}} value={transaction_date} onChange={(e) => setTransactionDate(e.target.value)} required />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{width: '100%'}}>
            {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
}
// src/components/TransactionForm.jsx
import { useState } from 'react';

export default function TransactionForm({ onTransactionInsert, isGuest }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Income'); // Default Income
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    const newTransaction = {
      transaction_type: type,
      amount: parseFloat(amount),
      description,
      transaction_date: date,
    };

    onTransactionInsert(newTransaction);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="transaction-card">
      <h3 className="form-title">Add New Transaction</h3>
      
      <form onSubmit={handleSubmit}>
        
        {/* Row 1: Type Selection */}
        <div style={{marginBottom: '20px'}}>
            <label style={{display:'block', marginBottom:'10px', fontWeight:'600', color:'#555'}}>Transaction Type</label>
            <div className="type-selector">
                <label className="radio-label">
                    <input 
                        type="radio" 
                        name="type" 
                        value="Income" 
                        checked={type === 'Income'} 
                        onChange={(e) => setType(e.target.value)} 
                    />
                    <span style={{color: '#28a745'}}>Income (Money In)</span>
                </label>
                <label className="radio-label">
                    <input 
                        type="radio" 
                        name="type" 
                        value="Expense" 
                        checked={type === 'Expense'} 
                        onChange={(e) => setType(e.target.value)} 
                    />
                    <span style={{color: '#dc3545'}}>Expense (Money Out)</span>
                </label>
            </div>
        </div>

        {/* Row 2: Grid Layout for Inputs */}
        <div className="form-grid">
            <div className="input-wrapper">
                <label>Amount ($)</label>
                <input 
                    type="number" 
                    className="modern-input" 
                    placeholder="e.g. 50" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    required 
                />
            </div>
            
            <div className="input-wrapper">
                <label>Date</label>
                <input 
                    type="date" 
                    className="modern-input" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                />
            </div>
        </div>

        {/* Row 3: Description */}
        <div className="input-wrapper" style={{marginBottom: '20px'}}>
            <label>Description (Optional)</label>
            <input 
                type="text" 
                className="modern-input" 
                placeholder="What is this for?" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
            />
        </div>

        {/* Add Button */}
        <button type="submit" className="add-btn">
            + Add Transaction
        </button>

      </form>
    </div>
  );
}
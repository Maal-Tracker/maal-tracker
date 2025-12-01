// src/components/EditTransactionModal.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function EditTransactionModal({ transaction, onClose, onUpdateSuccess }) {
  // Waxaan ku shubaynaa xogta hadda jirta input-yada
  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState(transaction.description);
  const [transactionType, setTransactionType] = useState(transaction.transaction_type);
  const [date, setDate] = useState(transaction.transaction_date);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      amount: parseFloat(amount), // Waa muhiim in lambar laga dhigo
      description,
      transaction_type: transactionType,
      transaction_date: date
    };

    try {
      // 1. U dir xogta cusub Supabase
      const { data, error } = await supabase
        .from('transactions')
        .update(updatedData)
        .eq('id', transaction.id) // Hubi in ID-ga saxda ah la beddelayo
        .select(); // .select() waa muhiim si loo helo xogta la beddelay

      if (error) throw error;

      alert('Transaction updated successfully!');
      
      // 2. U gudbi xogta cusub Account.jsx si uu shaashadda u beddelo
      if (data && data.length > 0) {
        onUpdateSuccess(data[0]); 
      }
      
    } catch (error) {
      alert('Error updating: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Styles-ka Modal-ka
  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white', padding: '30px', borderRadius: '8px',
    width: '400px', maxWidth: '90%', position: 'relative'
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginTop: 0, textAlign: 'center' }}>Edit Transaction</h3>
        
        <form onSubmit={handleUpdate}>
          {/* Amount Input */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Amount</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }} 
              required 
            />
          </div>

          {/* Description Input */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }} 
            />
          </div>

          {/* Type Select */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Type</label>
            <select 
              value={transactionType} 
              onChange={(e) => setTransactionType(e.target.value)} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          {/* Date Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }} 
              required 
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ padding: '8px 15px', background: '#ccc', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
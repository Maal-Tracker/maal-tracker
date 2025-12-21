import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Today({ session, isGuest }) {
  const [todayTotal, setTodayTotal] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  
  // Hubinta Mobile ama Desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { name: 'Food', icon: '🍔' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Bills', icon: '🧾' },
    { name: 'Health', icon: '💊' },
    { name: 'Fun', icon: '🎮' },
    { name: 'Other', icon: '📦' }
  ];

  const fetchTodayData = async () => {
    if (isGuest) return;
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', session?.user?.id)
      .eq('transaction_date', today)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTransactions(data);
      const total = data
        .filter(t => t.transaction_type === 'Expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      setTodayTotal(total);
    }
  };

  useEffect(() => { fetchTodayData(); }, [session, isGuest]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!amount) return;

    const newTx = {
      amount: parseFloat(amount),
      transaction_type: 'Expense',
      transaction_date: new Date().toISOString().split('T')[0],
      description: category,
      user_id: session?.user?.id
    };

    if (!isGuest) {
      await supabase.from('transactions').insert([newTx]);
      fetchTodayData();
    } else {
      setTransactions([{ ...newTx, created_at: new Date().toISOString() }, ...transactions]);
      setTodayTotal(prev => prev + parseFloat(amount));
    }

    setAmount('');
    setShowModal(false);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  });

  return (
    <div style={styles.container}>
      {/* Top Date Header */}
      <div style={styles.header}>
        <p style={styles.dateLabel}>Today</p>
        <p style={styles.fullDate}>{formattedDate}</p>
      </div>

      {/* Hero Spending Section */}
      <div style={styles.spendingDisplay}>
        <p style={styles.spentLabel}>Spent today</p>
        <h1 style={styles.totalAmount}>${todayTotal}</h1>
      </div>

      {/* 1. Desktop Add Button (Kaliya Desktop ka u muuqda) */}
      {!isMobile && (
        <button onClick={() => setShowModal(true)} style={styles.addBtnDesktop}>
          + Add expense
        </button>
      )}

      {/* 2. Floating Action Button (Kaliya Mobile ka u muuqda) */}
      {isMobile && (
        <button onClick={() => setShowModal(true)} style={styles.fabMobile}>
          +
        </button>
      )}

      {/* Transactions List */}
      <div style={styles.listSection}>
        {transactions.map((t, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardLeft}>
              <div style={styles.iconCircle}>
                {categories.find(c => c.name === t.description)?.icon || '💰'}
              </div>
              <div>
                <p style={styles.catName}>{t.description}</p>
                <p style={styles.timeText}>
                  {new Date(t.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <p style={styles.cardAmount}>${t.amount}</p>
          </div>
        ))}
      </div>

      {/* 3. Modern Modal (Add Expense Modal) */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add Expense</h3>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>✕</button>
            </div>

            <p style={styles.inputLabel}>How much did you spend?</p>
            
            <div style={styles.amountWrapper}>
              <span style={styles.currencySymbol}>$</span>
              <input 
                type="number" 
                placeholder="0" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                style={styles.modalInput}
                autoFocus
              />
            </div>

            <p style={styles.categoryLabelText}>Category</p>
            <div style={styles.categoryGrid}>
              {categories.map(cat => (
                <button 
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  style={{
                    ...styles.catBtn, 
                    backgroundColor: category === cat.name ? '#52B788' : '#F1F5F9',
                    color: category === cat.name ? '#fff' : '#64748B'
                  }}
                >
                  <span style={{ marginRight: '6px' }}>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

            <button onClick={handleSave} style={styles.saveBtnFull}>
              ✓ Save Expense
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { 
    padding: '20px', maxWidth: '500px', margin: '0 auto', 
    backgroundColor: '#fff', minHeight: '100vh', position: 'relative',
    fontFamily: '-apple-system, sans-serif'
  },
  header: { textAlign: 'center', marginTop: '10px' },
  dateLabel: { color: '#94a3b8', fontSize: '14px', margin: 0 },
  fullDate: { color: '#64748b', fontSize: '14px', fontWeight: '500', margin: '4px 0 0 0' },
  spendingDisplay: { textAlign: 'center', margin: '40px 0' },
  spentLabel: { color: '#94a3b8', fontSize: '16px' },
  totalAmount: { fontSize: '72px', fontWeight: '800', color: '#1e293b', margin: '10px 0' },
  
  addBtnDesktop: { 
    width: '100%', padding: '18px', backgroundColor: '#E67E22', color: '#fff', 
    border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: '700', 
    boxShadow: '0 10px 20px rgba(230, 126, 34, 0.2)', cursor: 'pointer', marginBottom: '30px' 
  },

  fabMobile: {
    position: 'fixed', bottom: '100px', right: '25px', width: '60px', height: '60px', 
    borderRadius: '50%', backgroundColor: '#E67E22', color: '#fff', fontSize: '32px', 
    border: 'none', boxShadow: '0 6px 15px rgba(230, 126, 34, 0.4)', cursor: 'pointer', 
    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
  },

  listSection: { display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '120px' },
  card: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '16px', backgroundColor: '#fff', borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9'
  },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  iconCircle: { 
    width: '45px', height: '45px', backgroundColor: '#f8fafc', 
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' 
  },
  catName: { fontWeight: '600', color: '#334155', margin: 0 },
  timeText: { fontSize: '12px', color: '#94a3b8', margin: 0 },
  cardAmount: { fontWeight: '700', fontSize: '18px', color: '#1e293b' },

  // Modal Styles
  modalOverlay: { 
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 2000 
  },
  modalContent: { 
    backgroundColor: '#fff', width: '100%', maxWidth: '500px', margin: '0 auto', 
    padding: '24px', borderTopLeftRadius: '28px', borderTopRightRadius: '28px'
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#1E293B' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', color: '#94A3B8' },
  inputLabel: { textAlign: 'center', color: '#94A3B8', fontSize: '14px', marginBottom: '10px' },
  amountWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginBottom: '30px' },
  currencySymbol: { fontSize: '40px', fontWeight: '700', color: '#CBD5E1' },
  modalInput: { width: '150px', fontSize: '64px', fontWeight: '800', border: 'none', outline: 'none', textAlign: 'left' },
  categoryLabelText: { fontSize: '14px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px' },
  categoryGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' },
  catBtn: { padding: '10px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: '600' },
  saveBtnFull: { 
    width: '100%', padding: '18px', backgroundColor: '#B2D8C8', color: '#2D6A4F', 
    border: 'none', borderRadius: '18px', fontSize: '16px', fontWeight: '700' 
  }
};
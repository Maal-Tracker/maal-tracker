import { useState, useEffect } from 'react';
import { useTrackerContext } from '../context/TrackerContext';

export default function Today({ session, isGuest }) {
  // SOURCE OF TRUTH: Hadda wax walba waxay ka imaanayaan Context
    const { transactions, totalSpentToday, addExpense, formatAmount, currencySymbol } = useTrackerContext();
  
  // UI State kaliya (Modal & Inputs)
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  
  // Mobile Check (SSR-safe: initialize on mount)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    // set initial value on client
    handleResize();
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!amount) return;

    // Waxaan toos u wacaynaa function-ka Context-ka
    // Context-ka ayaa go'aaminaya inuu DB aado ama Local State ku keydiyo
    await addExpense(amount, category);

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
        {/* Halkan waxaan toos u isticmaalaynaa totalSpentToday ee Context-ka */}
          <h1 style={styles.totalAmount}>{formatAmount(totalSpentToday, { maximumFractionDigits: 0 })}</h1>
      </div>

      {/* Add Expense Button (Desktop) */}
      {!isMobile && (
        <button onClick={() => setShowModal(true)} style={styles.addBtnDesktop}>
          + Add expense
        </button>
      )}

      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <button onClick={() => setShowModal(true)} style={styles.fabMobile}>
          +
        </button>
      )}

      {/* Transactions List */}
      <div style={styles.listSection}>
        {/* Liiska waxaa toos laga keenayaa Context-ka */}
        {transactions && transactions.length > 0 ? (
           transactions.map((t, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.iconCircle}>
                  {categories.find(c => c.name === (t.category || t.description))?.icon || '💰'}
                </div>
                <div>
                  <p style={styles.catName}>{t.category || t.description}</p>
                  <p style={styles.timeText}>
                    {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <p style={styles.cardAmount}>{formatAmount(t.amount)}</p>
            </div>
          ))
        ) : (
          <p style={{textAlign:'center', color:'#ccc', marginTop:'20px'}}>No expenses yet.</p>
        )}
      </div>

      {/* Modern Modal (Add Expense) */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add Expense</h3>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>✕</button>
            </div>

            <p style={styles.inputLabel}>How much did you spend?</p>
            
            <div style={styles.amountWrapper}>
              <span style={styles.currencySymbol}>{currencySymbol}</span>
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
                    backgroundColor: category === cat.name ? '#FFCC00' : '#F1F5F9',
                    color: '#1E293B'
                  }}
                >
                  <span style={{ marginRight: '8px' }}>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

            <button onClick={handleSave} style={styles.saveBtnFull}>
              <span style={{ fontSize: '20px' }}>✓</span> Save Expense
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { 
    padding: '24px', maxWidth: '500px', margin: '0 auto', 
    backgroundColor: '#fff', minHeight: '100vh', position: 'relative',
    fontFamily: '-apple-system, system-ui, sans-serif'
  },
  header: { textAlign: 'center', marginTop: '10px' },
  dateLabel: { color: '#94a3b8', fontSize: '15px', margin: 0 },
  fullDate: { color: '#64748b', fontSize: '15px', fontWeight: '500', margin: '4px 0 0 0' },
  spendingDisplay: { textAlign: 'center', margin: '50px 0' },
  spentLabel: { color: '#94a3b8', fontSize: '17px' },
  totalAmount: { fontSize: '72px', fontWeight: '800', color: '#1e293b', margin: '10px 0' },
  
  addBtnDesktop: { 
    width: '100%', padding: '18px', backgroundColor: '#FFD700', color: '#000', 
    border: 'none', borderRadius: '18px', fontSize: '18px', fontWeight: '750', 
    boxShadow: '0 8px 20px rgba(255, 215, 0, 0.2)', cursor: 'pointer', marginBottom: '32px' 
  },

  fabMobile: {
    position: 'fixed', bottom: '110px', right: '24px', width: '64px', height: '64px', 
    borderRadius: '50%', backgroundColor: '#FFD700', color: '#000', fontSize: '32px', 
    border: 'none', boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)', cursor: 'pointer', 
    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
  },

  listSection: { display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '120px' },
  card: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '20px', backgroundColor: '#fff', borderRadius: '22px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9'
  },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  iconCircle: { 
    width: '48px', height: '48px', backgroundColor: '#f8fafc', 
    borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' 
  },
  catName: { fontWeight: '700', color: '#1e293b', margin: 0, fontSize: '16px' },
  timeText: { fontSize: '13px', color: '#94a3b8', margin: 0 },
  cardAmount: { fontWeight: '800', fontSize: '19px', color: '#1e293b' },

  // Modal Styles
  modalOverlay: { 
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 2000 
  },
  modalContent: { 
    backgroundColor: '#fff', width: '100%', maxWidth: '500px', margin: '0 auto', 
    padding: '30px 24px', borderTopLeftRadius: '32px', borderTopRightRadius: '32px'
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: '#1E293B' },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', color: '#94A3B8', cursor: 'pointer' },
  inputLabel: { textAlign: 'center', color: '#94A3B8', fontSize: '15px', marginBottom: '10px' },
  amountWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '40px' },
  currencySymbol: { fontSize: '48px', fontWeight: '800', color: '#CBD5E1' },
  modalInput: { width: '160px', fontSize: '72px', fontWeight: '900', border: 'none', outline: 'none', textAlign: 'left', color: '#1e293b' },
  categoryLabelText: { fontSize: '15px', fontWeight: '700', color: '#94A3B8', marginBottom: '15px' },
  categoryGrid: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' },
  catBtn: { padding: '12px 20px', borderRadius: '16px', border: 'none', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  saveBtnFull: { 
    width: '100%', padding: '20px', backgroundColor: '#FFE680', color: '#475569', 
    border: 'none', borderRadius: '24px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
  }
};
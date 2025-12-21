import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Month({ session, isGuest }) {
  const [data, setData] = useState({
    income: 3500,
    expenses: 2180,
    saved: 1320,
    percent: 38
  });

  const categories = [
    { name: 'Food & Dining', amount: 680, color: '#52B788', icon: '🍔', max: 1000 },
    { name: 'Transport', amount: 420, color: '#52B788', icon: '🚗', max: 1000 },
    { name: 'Shopping', amount: 380, color: '#52B788', icon: '🛍️', max: 1000 },
    { name: 'Bills', amount: 450, color: '#52B788', icon: '🧾', max: 1000 },
    { name: 'Fun', amount: 250, color: '#52B788', icon: '🎮', max: 1000 },
  ];

  useEffect(() => {
    const fetchMonthData = async () => {
      if (isGuest) return;
      // Halkan waxaad dhex dhigi kartaa xogta dhabta ah ee Supabase 
      // si aad u xisaabiso wadarta bisha.
    };
    fetchMonthData();
  }, [session, isGuest]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <p style={styles.monthName}>December 2024</p>
        <p style={styles.subTitle}>Monthly overview</p>
      </div>

      {/* Income & Expenses Cards */}
      <div style={styles.summaryCard}>
        <div style={styles.row}>
          <div style={styles.iconBoxGreen}>↘</div>
          <div>
            <p style={styles.label}>Income</p>
            <h3 style={styles.value}>${data.income.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div style={styles.summaryCard}>
        <div style={styles.row}>
          <div style={styles.iconBoxRed}>↗</div>
          <div>
            <p style={styles.label}>Expenses</p>
            <h3 style={styles.value}>${data.expenses.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Savings Highlight Card */}
      <div style={styles.savingsCard}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={styles.savingsIcon}>💳</div>
          <div>
            <p style={{margin: 0, fontSize: '13px', opacity: 0.9}}>Saved this month</p>
            <h2 style={{margin: 0, fontSize: '24px'}}>${data.saved.toLocaleString()}</h2>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <h2 style={{margin: 0, fontSize: '28px'}}>{data.percent}%</h2>
          <p style={{margin: 0, fontSize: '11px', opacity: 0.8}}>of income</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={styles.breakdownSection}>
        <h4 style={{marginBottom: '20px', color: '#1E293B'}}>Where your money went</h4>
        {categories.map((cat, i) => (
          <div key={i} style={styles.catRow}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={styles.catName}>{cat.icon} {cat.name}</span>
              <span style={styles.catAmount}>${cat.amount}</span>
            </div>
            <div style={styles.progressBg}>
              <div style={{
                ...styles.progressFill, 
                width: `${(cat.amount / cat.max) * 100}%`,
                backgroundColor: cat.color 
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '100px' },
  header: { textAlign: 'center', margin: '20px 0 30px 0' },
  monthName: { fontSize: '16px', fontWeight: '600', color: '#64748B', margin: 0 },
  subTitle: { fontSize: '12px', color: '#94A3B8', marginTop: '4px' },
  summaryCard: { 
    backgroundColor: '#fff', padding: '15px 20px', borderRadius: '16px', 
    marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' 
  },
  row: { display: 'flex', alignItems: 'center', gap: '15px' },
  iconBoxGreen: { width: '40px', height: '40px', backgroundColor: '#F0FDF4', color: '#22C55E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  iconBoxRed: { width: '40px', height: '40px', backgroundColor: '#FEF2F2', color: '#EF4444', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  label: { fontSize: '12px', color: '#94A3B8', margin: 0 },
  value: { fontSize: '20px', fontWeight: 'bold', color: '#1E293B', margin: 0 },
  savingsCard: { 
    backgroundColor: '#52B788', color: '#fff', padding: '25px', borderRadius: '20px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '25px 0' 
  },
  savingsIcon: { width: '45px', height: '45px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' },
  breakdownSection: { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  catRow: { marginBottom: '20px' },
  catName: { fontSize: '14px', fontWeight: '500', color: '#475569' },
  catAmount: { fontSize: '14px', fontWeight: 'bold', color: '#1E293B' },
  progressBg: { width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '10px' }
};
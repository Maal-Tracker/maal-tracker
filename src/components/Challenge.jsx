import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Challenge({ session, isGuest }) {
  // State-ka tartamada
  const [activeChallenge, setActiveChallenge] = useState(null); // '7day', '30day', ama null
  const [spentToday, setSpentToday] = useState(0);
  const [savedMonth, setSavedMonth] = useState(150); // Tusaale: inta la keydiyay bishaan

  // Targets
  const [dailyLimit] = useState(30);
  const [monthlyGoal] = useState(500);

  // Soo qaadashada kharashka dhabta ah ee Today
  useEffect(() => {
    const fetchTodayTotal = async () => {
      if (isGuest) {
        setSpentToday(22);
        return;
      }
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', session?.user?.id)
        .eq('transaction_type', 'Expense')
        .eq('transaction_date', today);

      if (data) {
        const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
        setSpentToday(total);
      }
    };
    fetchTodayTotal();
  }, [session, isGuest]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Challenge</h1>
        <p style={styles.subTitle}>Train your money habits, one step at a time.</p>
      </header>

      {/* --- 7-DAY CHALLENGE SECTION --- */}
      {activeChallenge === '7day' ? (
        <div style={styles.card}>
          <div style={styles.activeTag}>✅ 7-Day Challenge is active</div>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircleGreen}>⚡</div>
            <div>
              <h3 style={styles.challengeName}>7-Day Challenge</h3>
              <p style={styles.challengeSub}>Daily spending control</p>
            </div>
          </div>
          <div style={styles.activeContent}>
             <div style={styles.progressHeader}>
                <span style={styles.labelSmall}>Your progress</span>
                <span style={styles.dayText}>Day 3 of 7</span>
             </div>
             <div style={styles.dotsContainer}>
                {[1,2,3,4,5,6,7].map((d, i) => (
                  <div key={i} style={{...styles.dot, backgroundColor: i < 2 ? '#52B788' : i === 2 ? '#EF4444' : '#F1F5F9'}}></div>
                ))}
             </div>
             <div style={styles.statsBox}>
                <div style={styles.statRow}><span style={styles.statLabel}>Limit</span><b>${dailyLimit}</b></div>
                <div style={styles.statRow}><span style={styles.statLabel}>Spent</span><b style={{color: spentToday > dailyLimit ? '#EF4444' : '#52B788'}}>${spentToday}</b></div>
             </div>
             <button onClick={() => setActiveChallenge(null)} style={styles.btnCancel}>Stop Challenge</button>
          </div>
        </div>
      ) : (
        <div style={{...styles.card, opacity: activeChallenge === '30day' ? 0.5 : 1}}>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircleGreen}>⚡</div>
            <div>
              <h3 style={styles.challengeName}>7-Day Challenge</h3>
              <p style={styles.challengeSub}>Daily spending control</p>
            </div>
            {activeChallenge === '30day' && <span>🔒</span>}
          </div>
          {activeChallenge !== '30day' && (
            <button onClick={() => setActiveChallenge('7day')} style={styles.btnGreen}>Start 7-Day Challenge</button>
          )}
        </div>
      )}

      {/* --- 30-DAY CHALLENGE SECTION --- */}
      {activeChallenge === '30day' ? (
        <div style={styles.card}>
          <div style={styles.activeTagOrange}>✅ 30-Day Challenge is active</div>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircleOrange}>🎯</div>
            <div>
              <h3 style={styles.challengeName}>30-Day Challenge</h3>
              <p style={styles.challengeSub}>Build a saving habit</p>
            </div>
          </div>
          <div style={styles.activeContent}>
             <div style={styles.statRow}>
                <span style={styles.statLabel}>Monthly goal</span>
                <span style={styles.statValue}>${monthlyGoal}</span>
             </div>
             <div style={styles.progressBarBg}>
                <div style={{...styles.progressBarFill, width: `${(savedMonth/monthlyGoal)*100}%`}}></div>
             </div>
             <div style={{display:'flex', justifyContent:'space-between', marginTop:'10px'}}>
                <span style={styles.labelSmall}>30 days left</span>
                <span style={{...styles.labelSmall, color:'#52B788', fontWeight:'700'}}>{Math.round((savedMonth/monthlyGoal)*100)}% done</span>
             </div>
             <div style={styles.statsGrid}>
                <div style={styles.gridItem}><span style={styles.labelSmall}>Saved so far</span><p style={styles.gridValue}>${savedMonth}</p></div>
                <div style={styles.gridItem}><span style={styles.labelSmall}>Still need</span><p style={{...styles.gridValue, color:'#E67E22'}}>${monthlyGoal - savedMonth}</p></div>
             </div>
             <button onClick={() => setActiveChallenge(null)} style={styles.btnCancel}>Stop Challenge</button>
          </div>
        </div>
      ) : (
        <div style={{...styles.card, opacity: activeChallenge === '7day' ? 0.5 : 1}}>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircleOrange}>🎯</div>
            <div>
              <h3 style={styles.challengeName}>30-Day Challenge</h3>
              <p style={styles.challengeSub}>Build a saving habit</p>
            </div>
            {activeChallenge === '7day' && <span>🔒</span>}
          </div>
          {activeChallenge !== '7day' && (
            <button onClick={() => setActiveChallenge('30day')} style={styles.btnOrange}>Start 30-Day Challenge</button>
          )}
        </div>
      )}

      <p style={styles.footerText}>You're doing great. Keep going!</p>
    </div>
  );
}

const styles = {
  container: { padding: '24px', backgroundColor: '#fff', minHeight: '100vh', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' },
  header: { marginTop: '10px', marginBottom: '25px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1A1C1E', margin: 0 },
  subTitle: { fontSize: '14px', color: '#64748B', marginTop: '5px' },
  card: { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #F1F5F9', marginBottom: '20px', transition: '0.3s' },
  activeTag: { backgroundColor: '#F0FDF4', color: '#52B788', padding: '8px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', marginBottom: '15px', textAlign: 'center' },
  activeTagOrange: { backgroundColor: '#FFF7ED', color: '#E67E22', padding: '8px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', marginBottom: '15px', textAlign: 'center' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '15px' },
  iconCircleGreen: { width: '44px', height: '44px', backgroundColor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52B788' },
  iconCircleOrange: { width: '44px', height: '44px', backgroundColor: '#FFF7ED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E67E22' },
  challengeName: { fontSize: '17px', fontWeight: '700', margin: 0 },
  challengeSub: { fontSize: '12px', color: '#94A3B8' },
  dotsContainer: { display: 'flex', gap: '6px', margin: '15px 0' },
  dot: { flex: 1, height: '6px', borderRadius: '10px' },
  statsBox: { backgroundColor: '#F8FAFC', padding: '15px', borderRadius: '16px' },
  statRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
  progressBarBg: { width: '100%', height: '10px', backgroundColor: '#F1F5F9', borderRadius: '10px', marginTop: '15px' },
  progressBarFill: { height: '100%', backgroundColor: '#52B788', borderRadius: '10px', transition: '0.5s' },
  statsGrid: { display: 'flex', gap: '15px', marginTop: '20px' },
  gridItem: { flex: 1, backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', textAlign: 'center' },
  gridValue: { fontSize: '18px', fontWeight: '800', margin: '5px 0' },
  btnGreen: { width: '100%', padding: '14px', backgroundColor: '#52B788', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  btnOrange: { width: '100%', padding: '14px', backgroundColor: '#E67E22', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  btnCancel: { width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', marginTop: '10px', fontSize: '13px' },
  footerText: { textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '20px' },
  labelSmall: { fontSize: '12px', color: '#94A3B8' }
};
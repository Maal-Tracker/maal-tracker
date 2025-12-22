import { useState } from 'react';

export default function Challenge() {
  const [activeChallenge, setActiveChallenge] = useState(null); // '7day', '30day', or null

  // --- 7-DAY STATE ---
  const [sevenDayLimit, setSevenDayLimit] = useState('');
  const [step7, setStep7] = useState('start'); // 'start', 'input', 'active'
  const currentDay = 3;
  const spentToday = 22;

  // --- 30-DAY STATE ---
  const [thirtyDayGoal, setThirtyDayGoal] = useState('');
  const [savedAmount, setSavedAmount] = useState(0);
  const [step30, setStep30] = useState('start'); // 'start', 'input', 'active'

  // --- HANDLERS 7-DAY ---
  const handleStart7Click = () => setStep7('input');
  
  const confirmStart7 = () => {
    if (!sevenDayLimit || sevenDayLimit <= 0) return alert("Please enter a daily limit.");
    setActiveChallenge('7day');
    setStep7('active');
  };

  const stop7 = () => {
    if(window.confirm("Stop 7-Day Challenge?")) {
      setActiveChallenge(null);
      setStep7('start');
      setSevenDayLimit('');
    }
  };

  // --- HANDLERS 30-DAY ---
  const handleStart30Click = () => setStep30('input');

  const confirmStart30 = () => {
    if (!thirtyDayGoal || thirtyDayGoal <= 0) return alert("Please enter a saving goal.");
    setActiveChallenge('30day');
    setStep30('active');
  };

  const stop30 = () => {
    if(window.confirm("Stop 30-Day Challenge?")) {
      setActiveChallenge(null);
      setStep30('start');
      setThirtyDayGoal('');
    }
  };

  const renderSegments = () => {
    return Array.from({ length: 7 }).map((_, i) => {
      let color = '#E2E8F0'; 
      if (i < currentDay) color = '#FFCF00'; 
      return (
        <div key={i} style={{
          flex: 1, height: '8px', backgroundColor: color, 
          borderRadius: '4px', margin: '0 2px'
        }}></div>
      );
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Challenge</h1>
        <p style={styles.pageSub}>Train your money habits, one step at a time.</p>
      </div>

      {/* --- 7-DAY CHALLENGE CARD --- */}
      <div style={{
        ...styles.card,
        opacity: activeChallenge === '30day' ? 0.5 : 1,
        pointerEvents: activeChallenge === '30day' ? 'none' : 'auto'
      }}>
        <div style={styles.cardHeader}>
          <div style={{...styles.iconCircle, backgroundColor: '#FFCF00', color: '#000'}}>⚡</div>
          <div>
            <h3 style={styles.cardTitle}>7-Day Challenge</h3>
            <p style={styles.cardSub}>Daily spending control</p>
          </div>
        </div>

        {step7 === 'start' && (
          <>
            <div style={styles.infoBox}>
              <strong>What you'll do:</strong><br/>
              Set a daily spending limit and stay under it for 7 days. Simple!
            </div>
            <button onClick={handleStart7Click} style={styles.btnYellow}>Start 7-Day Challenge</button>
          </>
        )}

        {step7 === 'input' && (
          <div style={styles.inputContainer}>
            <label style={styles.label}>What is your daily spending limit?</label>
            <div style={styles.currencyInput}>
              <span style={{fontSize: '24px', fontWeight: '700'}}>$</span>
              <input 
                type="number" 
                value={sevenDayLimit}
                onChange={(e) => setSevenDayLimit(e.target.value)}
                placeholder="30"
                style={styles.inputField}
                autoFocus
              />
            </div>
            <button onClick={confirmStart7} style={styles.btnYellow}>Confirm & Start</button>
            <button onClick={() => setStep7('start')} style={styles.btnLink}>Cancel</button>
          </div>
        )}

        {step7 === 'active' && (
          <div>
            <div style={styles.progressLabelRow}>
              <span>Your progress</span>
              <strong>Day {currentDay} of 7</strong>
            </div>
            <div style={{display: 'flex', marginBottom: '24px'}}>
              {renderSegments()}
            </div>
            <div style={styles.statsBox}>
              <div style={styles.statRow}>
                <span style={{color: '#64748B'}}>Today's limit</span>
                <span style={{fontWeight: '700', color: '#0F172A'}}>${sevenDayLimit}</span>
              </div>
              <div style={styles.statRow}>
                <span style={{color: '#64748B'}}>Spent today</span>
                <span style={{fontWeight: '700', color: spentToday > sevenDayLimit ? '#EF4444' : '#0F172A'}}>${spentToday}</span>
              </div>
              <div style={styles.divider}></div>
              <div style={styles.resultRow}>
                 <span>✓ On track! ${sevenDayLimit - spentToday} left today</span>
              </div>
            </div>
            <button onClick={stop7} style={styles.btnStop}>Stop Challenge</button>
          </div>
        )}
      </div>

      {/* --- 30-DAY CHALLENGE CARD --- */}
      <div style={{
        ...styles.card,
        opacity: activeChallenge === '7day' ? 0.5 : 1,
        pointerEvents: activeChallenge === '7day' ? 'none' : 'auto'
      }}>
        <div style={styles.cardHeader}>
          <div style={{...styles.iconCircle, backgroundColor: '#1E293B', color: '#FFF'}}>🎯</div>
          <div>
            <h3 style={styles.cardTitle}>30-Day Challenge</h3>
            <p style={styles.cardSub}>Build a saving habit</p>
          </div>
        </div>

        {step30 === 'start' && (
           <>
            <div style={styles.infoBox}>
              <strong>What you'll do:</strong><br/>
              Set a saving goal and track your progress for 30 days. Build the habit!
            </div>
            <button onClick={handleStart30Click} style={styles.btnBlack}>Start 30-Day Challenge</button>
          </>
        )}

        {step30 === 'input' && (
          <div style={styles.inputContainer}>
            <label style={styles.label}>How much do you want to save?</label>
            <div style={styles.currencyInput}>
              <span style={{fontSize: '24px', fontWeight: '700'}}>$</span>
              <input 
                type="number" 
                value={thirtyDayGoal}
                onChange={(e) => setThirtyDayGoal(e.target.value)}
                placeholder="500"
                style={styles.inputField}
                autoFocus
              />
            </div>
            <button onClick={confirmStart30} style={styles.btnBlack}>Confirm & Start</button>
            <button onClick={() => setStep30('start')} style={styles.btnLink}>Cancel</button>
          </div>
        )}

        {step30 === 'active' && (
          <div>
            <div style={styles.progressLabelRow}>
              <span>Goal Progress</span>
              <strong>0% done</strong>
            </div>
            <div style={{height: '10px', backgroundColor: '#F1F5F9', borderRadius: '5px', marginBottom: '20px', overflow:'hidden'}}>
               <div style={{width: '0%', height: '100%', backgroundColor: '#1E293B'}}></div>
            </div>
            <div style={{...styles.statsBox, backgroundColor: '#F8FAFC'}}>
               <div style={styles.statRow}>
                <span style={{color: '#64748B'}}>Total Goal</span>
                <span style={{fontWeight: '700', color: '#0F172A'}}>${thirtyDayGoal}</span>
              </div>
              <div style={styles.statRow}>
                <span style={{color: '#64748B'}}>Saved so far</span>
                <span style={{fontWeight: '700', color: '#10B981'}}>$0</span>
              </div>
            </div>
            <button onClick={stop30} style={styles.btnStop}>Stop Challenge</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: '24px', 
    backgroundColor: '#FFFFFF', // Cadaanka cusub
    minHeight: '100vh', 
    maxWidth: '480px', 
    margin: '0 auto', 
    fontFamily: '-apple-system, system-ui, sans-serif' 
  },
  header: { textAlign: 'center', marginBottom: '30px', color: '#0F172A' },
  pageTitle: { fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' },
  pageSub: { fontSize: '15px', color: '#64748B', margin: 0 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: '24px', 
    padding: '24px', 
    marginBottom: '20px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #F1F5F9'
  },
  cardHeader: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' },
  iconCircle: { 
    width: '48px', height: '48px', borderRadius: '50%', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: '#0F172A' },
  cardSub: { fontSize: '13px', color: '#64748B', margin: 0 },
  infoBox: { 
    backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', 
    fontSize: '14px', color: '#475569', lineHeight: '1.5', marginBottom: '24px' 
  },
  btnYellow: { 
    width: '100%', padding: '16px', backgroundColor: '#FFCF00', color: '#000', 
    border: 'none', borderRadius: '16px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' 
  },
  btnBlack: { 
    width: '100%', padding: '16px', backgroundColor: '#1E293B', color: '#FFF', 
    border: 'none', borderRadius: '16px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' 
  },
  btnStop: { 
    width: '100%', padding: '12px', background: 'transparent', color: '#EF4444', 
    border: '1px solid #FEE2E2', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' 
  },
  btnLink: { background: 'none', border: 'none', color: '#94A3B8', marginTop: '12px', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' },
  progressLabelRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '10px' },
  statsBox: { backgroundColor: '#FFFBEB', padding: '20px', borderRadius: '20px', marginBottom: '10px' }, 
  statRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
  divider: { height: '1px', backgroundColor: 'rgba(0,0,0,0.05)', margin: '12px 0' },
  resultRow: { color: '#059669', fontWeight: '700', fontSize: '14px' },
  inputContainer: { textAlign: 'center', padding: '10px 0' },
  label: { display: 'block', fontSize: '14px', color: '#64748B', marginBottom: '15px' },
  currencyInput: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' },
  inputField: { 
    fontSize: '36px', fontWeight: '800', width: '140px', border: 'none', 
    borderBottom: '2px solid #E2E8F0', outline: 'none', textAlign: 'center', color: '#0F172A' 
  }
};
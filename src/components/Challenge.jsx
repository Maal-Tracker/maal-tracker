import { useMemo } from 'react';
import { useTrackerContext } from '../context/TrackerContext';

export default function Challenge({ session }) {
  const { 
    transactions = [], 
    totalSpentToday = 0, 
    dailyLimit = 0, 
    activeChallenge, setActiveChallenge,
    sevenDayLimit, setSevenDayLimit,
    step7, setStep7,
    thirtyDayGoal, setThirtyDayGoal,
    step30, setStep30
  , formatAmount } = useTrackerContext();

  // --- HANDLERS ---
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

  const handleStart30Click = () => setStep30('input');
  
  const confirmStart30 = () => {
    if (!thirtyDayGoal || thirtyDayGoal <= 0) return alert("Please enter a total monthly budget.");
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

  // --- 7-DAY LOGIC (SMART START) ---
  const sevenData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7DaysLimit = new Date(today);
    last7DaysLimit.setDate(today.getDate() - 6);

    const recentTx = transactions
      .map(t => new Date(t.created_at))
      .filter(d => d >= last7DaysLimit && d <= new Date())
      .sort((a, b) => a - b);

    let startDate = recentTx.length > 0 ? new Date(recentTx[0]) : new Date(today);
    startDate.setHours(0,0,0,0);

    const limit = Number(sevenDayLimit || dailyLimit || 0);
    const todayTime = today.getTime();

    const dayTotals = Array.from({ length: 7 }).map((_, i) => {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const dStart = new Date(currentDay);
      dStart.setHours(0, 0, 0, 0);
      
      const dEnd = new Date(currentDay);
      dEnd.setHours(23, 59, 59, 999);
      
      const total = transactions
        .filter(t => {
          const dt = new Date(t.created_at);
          return dt >= dStart && dt <= dEnd;
        })
        .reduce((s, t) => s + Number(t.amount), 0);
      
      let status = 'future'; 
      if (currentDay.getTime() < todayTime) {
        status = total > limit ? 'over' : 'under';
      } else if (currentDay.getTime() === todayTime) {
         status = 'today';
      }

      return { total, date: currentDay, status };
    });

    const currentDayIndex = dayTotals.findIndex(d => d.status === 'today');
    const dayNumber = currentDayIndex !== -1 ? currentDayIndex + 1 : 1;

    return { dayTotals, limit, dayNumber };
  }, [transactions, sevenDayLimit, dailyLimit]);

  // --- 30-DAY LOGIC (SMART START) ---
  const thirtyData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Look back 30 days window
    const last30DaysLimit = new Date(today);
    last30DaysLimit.setDate(today.getDate() - 29);

    const recentTx = transactions
      .map(t => new Date(t.created_at))
      .filter(d => d >= last30DaysLimit && d <= new Date())
      .sort((a, b) => a - b);

    let startDate = recentTx.length > 0 ? new Date(recentTx[0]) : new Date(today);
    startDate.setHours(0,0,0,0);

    // Calculate Daily Limit (Total Budget / 30)
    const totalBudget = Number(thirtyDayGoal || 0);
    const limit = totalBudget > 0 ? totalBudget / 30 : 0;
    const todayTime = today.getTime();

    const dayTotals = Array.from({ length: 30 }).map((_, i) => {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const dStart = new Date(currentDay);
      dStart.setHours(0, 0, 0, 0);
      
      const dEnd = new Date(currentDay);
      dEnd.setHours(23, 59, 59, 999);
      
      const total = transactions
        .filter(t => {
          const dt = new Date(t.created_at);
          return dt >= dStart && dt <= dEnd;
        })
        .reduce((s, t) => s + Number(t.amount), 0);
      
      let status = 'future'; 
      if (currentDay.getTime() < todayTime) {
        status = total > limit ? 'over' : 'under';
      } else if (currentDay.getTime() === todayTime) {
         status = 'today';
      }

      return { total, date: currentDay, status };
    });

    const currentDayIndex = dayTotals.findIndex(d => d.status === 'today');
    const dayNumber = currentDayIndex !== -1 ? currentDayIndex + 1 : 1;

    return { dayTotals, limit, dayNumber };
  }, [transactions, thirtyDayGoal]);

  // --- RENDER SEGMENTS HELPER ---
  const renderSegments = (data, totalDays) => {
    // Adjust margin based on count to fit in card
    const margin = totalDays > 7 ? '0 1px' : '0 3px';
    const borderRadius = totalDays > 7 ? '2px' : '4px';

    return data.dayTotals.map((day, i) => {
      let color = '#E2E8F0'; // Gray (Future)

      if (day.status === 'over') color = '#EF4444'; // Red
      if (day.status === 'under') color = '#FFCF00'; // Yellow
      
      // Today logic
      if (day.status === 'today') {
        const spent = Number(totalSpentToday.toFixed(2));
        const limit = Number(data.limit.toFixed(2));
        if (spent > limit) color = '#EF4444'; 
        else color = '#FFCF00'; 
      }

      return (
        <div key={i} style={{
          flex: 1, 
          height: '8px', 
          backgroundColor: color,
          borderRadius: borderRadius, 
          margin: margin,
        }}></div>
      );
    });
  };

  const spentToday = Number(totalSpentToday || 0);
  
  // Helpers to get current active data
  const isSevenActive = activeChallenge === '7day';
  const isThirtyActive = activeChallenge === '30day';
  
  const currentLimit = isSevenActive ? sevenData.limit : (isThirtyActive ? thirtyData.limit : 0);
  const remainingToday = currentLimit - spentToday;
  const isOverToday = remainingToday < 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Challenge</h1>
        <p style={styles.pageSub}>Train your money habits, one step at a time.</p>
      </div>

      {activeChallenge && (
         <div style={styles.activeBanner}>
            <span style={{color: '#D97706'}}>✓</span>
            <span style={{color: '#B45309', fontWeight: '600', marginLeft: '8px'}}>
              {isSevenActive ? '7-Day' : '30-Day'} Challenge is active
            </span>
         </div>
      )}

      {/* --- 7-DAY CHALLENGE CARD --- */}
      <div style={{
        ...styles.card,
        opacity: isThirtyActive ? 0.5 : 1,
        pointerEvents: isThirtyActive ? 'none' : 'auto',
        border: isSevenActive ? '1px solid #FFCF00' : '1px solid #F1F5F9'
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
              Set a daily spending limit and stay under it for 7 days.
            </div>
            <button onClick={handleStart7Click} style={styles.btnYellow}>Start Challenge</button>
          </>
        )}

        {step7 === 'input' && (
          <div style={styles.inputContainer}>
            <label style={styles.label}>Daily Limit</label>
            <input 
                type="number" 
                value={sevenDayLimit}
                onChange={(e) => setSevenDayLimit(e.target.value)}
                placeholder="30"
                style={styles.inputField}
                autoFocus
              />
            <button onClick={confirmStart7} style={styles.btnYellow}>Start</button>
          </div>
        )}

        {step7 === 'active' && (
          <div>
            <div style={styles.progressLabelRow}>
              <span>Your progress</span>
              <strong style={{color: '#0F172A'}}>Day {sevenData.dayNumber} of 7</strong>
            </div>

            <div style={{display: 'flex', marginBottom: '24px'}}>
              {renderSegments(sevenData, 7)}
            </div>

            <div style={styles.todayStatsBox}>
              <div style={styles.statRow}>
                <span style={{color: '#64748B'}}>Today's limit</span>
                <span style={{fontWeight: '700', color: '#0F172A'}}>{formatAmount(sevenData.limit, { maximumFractionDigits: 0 })}</span>
              </div>
              <div style={{...styles.statRow, marginTop: '8px'}}>
                <span style={{color: '#64748B'}}>Spent today</span>
                <span style={{fontWeight: '700', color: isOverToday ? '#EF4444' : '#F59E0B'}}>{formatAmount(spentToday)}</span>
              </div>
              
              <div style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '14px', fontWeight: '600', color: isOverToday ? '#EF4444' : '#D97706'}}>
                 {isOverToday 
                   ? `⚠ You are over by ${formatAmount(Math.abs(remainingToday), { maximumFractionDigits: 0 })}` 
                   : `✓ On track! ${formatAmount(remainingToday, { maximumFractionDigits: 0 })} left today`}
              </div>
            </div>

            <div style={styles.nextStepText}>
               What's next? Stay under {formatAmount(sevenData.limit, { maximumFractionDigits: 0 })} today to complete Day {sevenData.dayNumber}. You got this!
            </div>
            
            <button onClick={stop7} style={styles.btnLinkRed}>Stop Challenge</button>
          </div>
        )}
      </div>

      {/* --- 30-DAY CHALLENGE CARD --- */}
      <div style={{
        ...styles.card,
        opacity: isSevenActive ? 0.5 : 1,
        pointerEvents: isSevenActive ? 'none' : 'auto',
        border: isThirtyActive ? '1px solid #FFCF00' : '1px solid #F1F5F9'
      }}>
        <div style={styles.cardHeader}>
          <div style={{...styles.iconCircle, backgroundColor: '#F1F5F9', color: '#64748B'}}>◎</div>
          <div>
            <h3 style={styles.cardTitle}>30-Day Challenge</h3>
            <p style={styles.cardSub}>Long-term budget control</p>
          </div>
        </div>
        
        {step30 === 'start' && (
            <>
             <div style={styles.infoBox}>
               Set a total monthly budget and track your daily spending for 30 days.
             </div>
             <button onClick={handleStart30Click} style={styles.btnOutline}>Start 30-Day</button>
            </>
        )}
        
        {step30 === 'input' && (
          <div style={styles.inputContainer}>
             <label style={styles.label}>Total Monthly Budget</label>
             <input 
                type="number" 
                value={thirtyDayGoal}
                onChange={(e) => setThirtyDayGoal(e.target.value)}
                placeholder="1500"
                style={styles.inputField}
                autoFocus
              />
            <button onClick={confirmStart30} style={styles.btnBlack}>Set Budget</button>
          </div>
        )}
        
        {step30 === 'active' && (
            <div>
            {/* Progress Label Row */}
            <div style={styles.progressLabelRow}>
              <span>Your progress</span>
              <strong style={{color: '#0F172A'}}>Day {thirtyData.dayNumber} of 30</strong>
            </div>

            {/* Bars (30 segments) */}
            <div style={{display: 'flex', marginBottom: '24px'}}>
              {renderSegments(thirtyData, 30)}
            </div>

            {/* Today Stats Box (Yellow/Beige Box) - Reused Logic */}
            <div style={styles.todayStatsBox}>
              <div style={styles.statRow}>
                <span style={{color: '#64748B'}}>Today's limit (Avg)</span>
                <span style={{fontWeight: '700', color: '#0F172A'}}>{formatAmount(thirtyData.limit, { maximumFractionDigits: 0 })}</span>
              </div>
              <div style={{...styles.statRow, marginTop: '8px'}}>
                <span style={{color: '#64748B'}}>Spent today</span>
                <span style={{fontWeight: '700', color: isOverToday ? '#EF4444' : '#F59E0B'}}>{formatAmount(spentToday)}</span>
              </div>
              
              <div style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '14px', fontWeight: '600', color: isOverToday ? '#EF4444' : '#D97706'}}>
                 {isOverToday 
                   ? `⚠ You are over by ${formatAmount(Math.abs(remainingToday), { maximumFractionDigits: 0 })}` 
                   : `✓ On track! ${formatAmount(remainingToday, { maximumFractionDigits: 0 })} left today`}
              </div>
            </div>

            <div style={styles.nextStepText}>
               What's next? Stay under {formatAmount(thirtyData.limit, { maximumFractionDigits: 0 })} today to complete Day {thirtyData.dayNumber}. Keep going!
            </div>
            
            <button onClick={stop30} style={styles.btnLinkRed}>Stop Challenge</button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- STYLES (Matching the Image) ---
const styles = {
  container: { padding: '24px', backgroundColor: '#FFFFFF', minHeight: '100vh', maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '20px' },
  pageTitle: { fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', color: '#0F172A' },
  pageSub: { fontSize: '14px', color: '#64748B', margin: 0 },
  activeBanner: { backgroundColor: '#FFFBEB', padding: '12px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', border: '1px solid #FEF3C7' },
  
  card: { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' },
  cardHeader: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' },
  iconCircle: { width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 },
  cardTitle: { fontSize: '17px', fontWeight: '700', margin: '0 0 2px 0', color: '#0F172A' },
  cardSub: { fontSize: '13px', color: '#64748B', margin: 0 },
  
  infoBox: { backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', fontSize: '13px', color: '#475569', marginBottom: '16px' },
  btnYellow: { width: '100%', padding: '14px', backgroundColor: '#FFCF00', color: '#000', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' },
  btnOutline: { width: '100%', padding: '14px', backgroundColor: '#fff', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' },
  btnBlack: { width: '100%', padding: '14px', backgroundColor: '#0F172A', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' },
  btnLinkRed: { background: 'none', border: 'none', color: '#EF4444', marginTop: '16px', cursor: 'pointer', fontSize: '13px', width: '100%', textAlign: 'center' },
  
  // UI Specifics for 7-Day Card
  progressLabelRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '12px', alignItems: 'center' },
  todayStatsBox: { backgroundColor: '#FFFBEB', padding: '20px', borderRadius: '16px', marginBottom: '16px' }, 
  statRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px' },
  nextStepText: { fontSize: '13px', color: '#64748B', lineHeight: '1.5', textAlign: 'center' },
  
  inputContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  inputField: { fontSize: '24px', fontWeight: '700', padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', width: '100%', boxSizing: 'border-box' },
  label: { fontSize: '13px', color: '#64748B', textAlign: 'center' }
};
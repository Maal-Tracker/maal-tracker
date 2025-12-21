import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Week({ session, isGuest }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({ total: 0, avg: 0 });

  useEffect(() => {
    const fetchWeekData = async () => {
      if (isGuest) {
        // Xog tijaabo ah (Guest Mode)
        const mockData = [
          { day: 'Mon', amount: 20 }, { day: 'Tue', amount: 45 },
          { day: 'Wed', amount: 30 }, { day: 'Thu', amount: 60 },
          { day: 'Fri', amount: 40 }, { day: 'Sat', amount: 85 },
          { day: 'Sun', amount: 55 }
        ];
        setWeeklyData(mockData);
        setStats({ total: 335, avg: 48 });
        return;
      }

      // Xogta dhabta ah ee Supabase
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session?.user?.id)
        .eq('transaction_type', 'Expense')
        .gte('transaction_date', sevenDaysAgo.toISOString().split('T')[0]);

      if (data) {
        const total = data.reduce((s, t) => s + Number(t.amount), 0);
        setStats({ total, avg: Math.round(total / 7) });
        
        // Halkan waxaad ku habayn kartaa baararka (Group by day)
        // ... (Logic-gan waa la sii ballaarin karaa)
      }
    };

    fetchWeekData();
  }, [session, isGuest]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <p style={styles.title}>This Week</p>
        <p style={styles.dateRange}>Dec 15 - Dec 21</p>
      </div>

      {/* Top Stats Cards */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total spent</p>
          <h2 style={styles.statValue}>${stats.total}</h2>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Avg per day</p>
          <h2 style={styles.statValue}>${stats.avg}</h2>
        </div>
      </div>

      {/* Daily Spending Chart Section */}
      <div style={styles.chartCard}>
        <p style={styles.chartTitle}>Daily spending</p>
        <div style={styles.barContainer}>
          {weeklyData.map((d, i) => (
            <div key={i} style={styles.barWrapper}>
              <div style={{
                ...styles.bar,
                height: `${(d.amount / 100) * 120}px`, // Baarka dhererkiisa
                backgroundColor: d.day === 'Sun' ? '#52B788' : '#E2E8F0' // Maanta oo kale ka dhig cagaar
              }}></div>
              <p style={{
                ...styles.dayLabel,
                color: d.day === 'Sun' ? '#52B788' : '#94A3B8',
                fontWeight: d.day === 'Sun' ? 'bold' : 'normal'
              }}>{d.day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Insight Box */}
      <div style={styles.insightBox}>
        <div style={styles.insightIcon}>💡</div>
        <div style={styles.insightText}>
          <p style={{fontWeight:'bold', margin:0}}>Weekly insight</p>
          <p style={{fontSize:'13px', color:'#64748B', margin:'5px 0 0 0'}}>
            You spent the most on Saturday. Consider setting a weekend budget to stay on track! 🎯
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '100px' },
  header: { textAlign: 'center', margin: '20px 0' },
  title: { fontSize: '18px', fontWeight: '600', color: '#1E293B', margin: 0 },
  dateRange: { fontSize: '13px', color: '#94A3B8', marginTop: '5px' },
  statsRow: { display: 'flex', gap: '15px', marginBottom: '20px' },
  statCard: { 
    flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '20px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)', textAlign: 'center' 
  },
  statLabel: { fontSize: '13px', color: '#94A3B8', marginBottom: '8px' },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#1E293B', margin: 0 },
  chartCard: { 
    backgroundColor: '#fff', padding: '25px', borderRadius: '20px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)', marginBottom: '20px' 
  },
  chartTitle: { fontSize: '14px', fontWeight: '600', color: '#64748B', marginBottom: '30px' },
  barContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px', padding: '0 10px' },
  barWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  bar: { width: '35px', borderRadius: '6px', transition: '0.3s' },
  dayLabel: { fontSize: '12px' },
  insightBox: { 
    display: 'flex', gap: '15px', backgroundColor: '#F0FDF4', padding: '20px', 
    borderRadius: '20px', border: '1px solid #DCFCE7' 
  },
  insightIcon: { fontSize: '24px' },
  insightText: { flex: 1 }
};
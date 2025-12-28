import React from 'react';
import { useTrackerContext } from '../context/TrackerContext';

export default function LandingPage({ onNavigate }) {
  const { formatAmount } = useTrackerContext();
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src="/logo.jpg" alt="Maal Tracker" style={styles.logoIcon} />
          <span style={styles.logoText}>Maal Tracker</span>
        </div>
        <button onClick={() => onNavigate('login')} style={styles.signInBtn}>Sign in</button>
      </header>

      {/* Hero Section */}
      <main style={styles.hero}>
        <h1 style={styles.mainTitle}>
          Track your spending. <span style={{ color: '#FFD700' }}>Stay in control.</span>
        </h1>
        <p style={styles.subTitle}>
          The simplest way to understand where your money goes. 
          No complicated charts, no confusing features. Just you and your daily spending.
        </p>

        <button onClick={() => onNavigate('guest')} style={styles.ctaBtn}>
          Start tracking free →
        </button>
        <p style={styles.smallText}>No credit card required • Takes 30 seconds</p>

        {/* Preview Image */}
        <div style={styles.previewContainer}>
            <div style={styles.mockupPhone}>
                <div style={styles.mockupContent}>
                    <p style={{fontSize: '10px', color: '#999', textAlign: 'center'}}>Today</p>
                    <p style={{fontSize: '12px', color: '#999', textAlign: 'center'}}>Spent today</p>
                    <h2 style={{margin: '5px 0', textAlign: 'center', fontSize: '28px'}}>{formatAmount(45)}</h2>
                    <div style={styles.mockupItem}><span>🍱 Lunch</span> <span>{formatAmount(12)}</span></div>
                    <div style={styles.mockupItem}><span>🚗 Uber</span> <span>{formatAmount(18)}</span></div>
                    <div style={styles.mockupItem}><span>☕ Coffee</span> <span>{formatAmount(5)}</span></div>
                    <div style={styles.mockupButton}>+ Add expense</div>
                </div>
            </div>
        </div>
      </main>

      {/* How it works */}
      <section style={styles.howItWorks}>
        <h3 style={{textAlign: 'center', marginBottom: '40px', fontSize: '24px', fontWeight: '800'}}>How it works</h3>
        <div style={styles.stepsGrid}>
          <div style={styles.step}>
            <div style={styles.stepIcon}>📱 <span style={styles.stepNum}>1</span></div>
            <h4 style={styles.stepTitle}>Open the app</h4>
            <p style={styles.stepDesc}>Just tap the icon. That's it. No login drama.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepIcon}>📉 <span style={styles.stepNum}>2</span></div>
            <h4 style={styles.stepTitle}>Add what you spent</h4>
            <p style={styles.stepDesc}>Enter the amount, pick a category. Done in 3 seconds.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepIcon}>🎯 <span style={styles.stepNum}>3</span></div>
            <h4 style={styles.stepTitle}>See your patterns</h4>
            <p style={styles.stepDesc}>Watch your spending habits. Stay motivated to save.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={styles.footerCTA}>
        <div style={styles.footerCard}>
          <h2 style={{fontSize: '32px', fontWeight: '800', marginBottom: '15px'}}>Ready to take control?</h2>
          <p style={{color: '#666', marginBottom: '30px'}}>Join thousands of people who track their daily spending with Maal Tracker.</p>
          <button onClick={() => onNavigate('guest')} style={styles.ctaBtn}>Start tracking free →</button>
        </div>
      </section>

      <footer style={{textAlign: 'center', padding: '40px', color: '#999', fontSize: '12px'}}>
        Maal Tracker — Build better money habits   © 2025 Maal Tracker



      </footer>
    </div>
  );
}

const styles = {
  container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1a1a1a', backgroundColor: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', maxWidth: '1200px', margin: '0 auto' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFD700' },
  logoText: { fontWeight: '800', fontSize: '18px' },
  signInBtn: { border: 'none', background: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  hero: { textAlign: 'center', padding: '60px 5%', maxWidth: '900px', margin: '0 auto' },
  mainTitle: { fontSize: '56px', fontWeight: '900', marginBottom: '20px', lineHeight: '1.1', letterSpacing: '-0.02em' },
  subTitle: { fontSize: '18px', color: '#666', marginBottom: '40px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 40px' },
  ctaBtn: { backgroundColor: '#FFD700', color: '#000', border: 'none', padding: '18px 40px', borderRadius: '15px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', transition: 'transform 0.2s' },
  smallText: { fontSize: '12px', color: '#999', marginTop: '20px' },
  previewContainer: { marginTop: '80px', display: 'flex', justifyContent: 'center' },
  mockupPhone: { width: '260px', height: '380px', border: '1px solid #eee', borderRadius: '40px', padding: '20px', boxShadow: '0 30px 60px rgba(0,0,0,0.08)', backgroundColor: '#fff' },
  mockupContent: { textAlign: 'left' },
  mockupItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 15px', backgroundColor: '#f8f9fa', borderRadius: '15px', marginBottom: '10px', fontSize: '13px', fontWeight: '600' },
  mockupButton: { backgroundColor: '#1a1a1a', color: '#fff', padding: '14px', borderRadius: '15px', textAlign: 'center', marginTop: '20px', fontSize: '13px', fontWeight: '700' },
  howItWorks: { padding: '100px 5%', maxWidth: '1100px', margin: '0 auto' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '50px' },
  step: { textAlign: 'center' },
  stepIcon: { fontSize: '32px', marginBottom: '20px', position: 'relative', display: 'inline-block' },
  stepNum: { position: 'absolute', top: '-5px', right: '-15px', backgroundColor: '#FFD700', color: '#000', fontSize: '11px', fontWeight: '800', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontSize: '18px', fontWeight: '800', marginBottom: '10px' },
  stepDesc: { color: '#666', fontSize: '15px', lineHeight: '1.5' },
  footerCTA: { padding: '0 5% 60px' },
  footerCard: { backgroundColor: '#fffcf0', padding: '80px 5%', textAlign: 'center', borderRadius: '40px', maxWidth: '1000px', margin: '0 auto' }
};
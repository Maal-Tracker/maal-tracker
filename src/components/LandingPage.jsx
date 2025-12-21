import React from 'react';

export default function LandingPage({ onNavigate }) {
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
          Track your spending. <span style={{ color: '#2D6A4F' }}>Stay in control.</span>
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
                    <p style={{fontSize: '10px', color: '#999'}}>Today</p>
                    <p style={{fontSize: '12px', color: '#999'}}>Spent today</p>
                    <h2 style={{margin: '5px 0'}}>$45</h2>
                    <div style={styles.mockupItem}><span>🍱 Lunch</span> <span>$12</span></div>
                    <div style={styles.mockupItem}><span>🚗 Uber</span> <span>$18</span></div>
                    <div style={styles.mockupItem}><span>☕ Coffee</span> <span>$5</span></div>
                    <div style={styles.mockupButton}>+ Add expense</div>
                </div>
            </div>
        </div>
      </main>

      {/* How it works */}
      <section style={styles.howItWorks}>
        <h3 style={{textAlign: 'center', marginBottom: '40px'}}>How it works</h3>
        <div style={styles.stepsGrid}>
          <div style={styles.step}>
            <div style={styles.stepIcon}>📱 <span style={styles.stepNum}>1</span></div>
            <h4>Open the app</h4>
            <p>Just tap the icon. That's it. No login drama.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepIcon}>📉 <span style={styles.stepNum}>2</span></div>
            <h4>Add what you spent</h4>
            <p>Enter the amount, pick a category. Done in 3 seconds.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepIcon}>🎯 <span style={styles.stepNum}>3</span></div>
            <h4>See your patterns</h4>
            <p>Watch your spending habits. Stay motivated to save.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={styles.footerCTA}>
        <h2>Ready to take control?</h2>
        <p>Join thousands of people who track their daily spending with Maal Tracker.</p>
        <button onClick={() => onNavigate('guest')} style={styles.ctaBtn}>Start tracking free →</button>
      </section>

      <footer style={{textAlign: 'center', padding: '40px', color: '#999', fontSize: '12px'}}>
        Made with ❤️ for people who want to save more
      </footer>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', color: '#1a1a1a', backgroundColor: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', maxWidth: '1200px', margin: '0 auto' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { width: '32px', height: '32px', borderRadius: '50%' },
  logoText: { fontWeight: 'bold', fontSize: '18px' },
  signInBtn: { border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' },
  hero: { textAlign: 'center', padding: '80px 5%', maxWidth: '800px', margin: '0 auto' },
  mainTitle: { fontSize: '48px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.1' },
  subTitle: { fontSize: '18px', color: '#666', marginBottom: '40px', lineHeight: '1.5' },
  ctaBtn: { backgroundColor: '#52B788', color: '#fff', border: 'none', padding: '15px 35px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(82, 183, 136, 0.3)' },
  smallText: { fontSize: '12px', color: '#999', marginTop: '15px' },
  previewContainer: { marginTop: '60px', display: 'flex', justifyContent: 'center' },
  mockupPhone: { width: '220px', height: '320px', border: '8px solid #f0f0f0', borderRadius: '30px', padding: '15px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
  mockupContent: { textAlign: 'left' },
  mockupItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '10px', marginBottom: '8px', fontSize: '12px' },
  mockupButton: { backgroundColor: '#D97706', color: '#fff', padding: '10px', borderRadius: '10px', textAlign: 'center', marginTop: '15px', fontSize: '12px' },
  howItWorks: { padding: '80px 5%', maxWidth: '1000px', margin: '0 auto' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' },
  step: { textAlign: 'center' },
  stepIcon: { fontSize: '30px', marginBottom: '15px', position: 'relative', display: 'inline-block' },
  stepNum: { position: 'absolute', top: '-5px', right: '-15px', backgroundColor: '#52B788', color: '#fff', fontSize: '12px', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  footerCTA: { backgroundColor: '#f4fbf8', padding: '80px 5%', textAlign: 'center', borderRadius: '30px', margin: '40px 5%' }
};
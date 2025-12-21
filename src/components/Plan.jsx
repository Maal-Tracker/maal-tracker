import { useState } from 'react';

export default function Plan() {
  const [budget, setBudget] = useState(500); // Tusaale: $500 bishii
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Financial Plan</h2>
      <div style={{ backgroundColor: '#000', color: '#fff', padding: '30px', borderRadius: '20px', marginTop: '20px' }}>
        <small style={{ color: '#aaa' }}>Monthly Budget Goal</small>
        <h1 style={{ fontSize: '40px' }}>${budget}</h1>
        <input 
          type="range" min="100" max="5000" step="100" 
          value={budget} onChange={(e) => setBudget(e.target.value)}
          style={{ width: '100%', accentColor: '#FFC107' }}
        />
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Savings Tips</h3>
        <p style={{ color: '#666' }}>1. Save at least 20% of your income.</p>
        <p style={{ color: '#666' }}>2. Track every small expense (Coffee, Snacks).</p>
      </div>
    </div>
  );
}
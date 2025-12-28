import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTrackerContext } from '../context/TrackerContext';

export default function AppLayout() {
  const location = useLocation();
  const { currency, setCurrency, availableCurrencies } = useTrackerContext();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <div style={{ position: 'fixed', top: 12, right: 14, zIndex: 1200 }}>
        <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
          {availableCurrencies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <main style={{ flex: 1, paddingBottom: '90px' }}>
        <Outlet />
      </main>

      <nav style={navStyles.navBar}>
        <Link to="/today" style={{ ...navStyles.navItem, color: isActive('/today') ? '#52B788' : '#94A3B8' }}>
          <div style={{ fontSize: '22px', marginBottom: '4px' }}>{isActive('/today') ? '📅' : '🗓️'}</div>
          <span>Today</span>
        </Link>
        <Link to="/challenge" style={{ ...navStyles.navItem, color: isActive('/challenge') ? '#52B788' : '#94A3B8' }}>
          <div style={{ fontSize: '22px', marginBottom: '4px' }}>{isActive('/challenge') ? '🏆' : '🏅'}</div>
          <span>Challenge</span>
        </Link>
      </nav>
    </div>
  );
}

const navStyles = {
  navBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0, height: '75px',
    backgroundColor: '#fff', borderTop: '1px solid #F1F5F9',
    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 1000
  },
  navItem: { 
    textDecoration: 'none', display: 'flex', flexDirection: 'column', 
    alignItems: 'center', fontSize: '12px', fontWeight: '600', transition: '0.2s' 
  }
};
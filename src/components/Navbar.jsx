import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Trang chủ',     path: '/',          icon: 'home' },
  { label: 'Khám phá',      path: '/recipes',   icon: 'search' },
  { label: 'Tủ lạnh',       path: '/fridge',    icon: 'kitchen' },
  { label: 'Bếp của tôi',   path: '/my-kitchen',icon: 'restaurant_menu' },
  { label: 'Thực đơn',      path: '/meal-plan', icon: 'calendar_month' },
  { label: 'Giỏ hàng',      path: '/cart',      icon: 'shopping_cart' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <header className="top-navbar" style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 50,
        borderBottom: '1px solid rgba(193,201,188,0.5)',
        boxShadow: '0 1px 8px rgba(57,105,56,0.08)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px var(--page-px)',
          maxWidth: 1440,
          margin: '0 auto',
          position: 'relative',
        }} ref={menuRef}>

          {/* Brand */}
          <Link to="/" style={{
            fontSize: 22,
            fontWeight: 900,
            background: 'linear-gradient(to right, #396938, #735858)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
            flexShrink: 0,
          }}>
            SmartFridge
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: 14,
                  fontWeight: isActive(link.path) ? 700 : 500,
                  color: isActive(link.path) ? '#396938' : '#42493f',
                  textDecoration: 'none',
                  borderBottom: isActive(link.path) ? '2px solid #396938' : '2px solid transparent',
                  paddingBottom: 4,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {isAuthenticated ? (
              <>
                <Link to="/settings" style={{ display: 'flex', alignItems: 'center', color: '#42493f', textDecoration: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>
                </Link>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#42493f', whiteSpace: 'nowrap' }}>
                  Chào, {user?.username || user?.name || 'Chef'}
                </span>
                <button onClick={handleLogout} style={{
                  fontSize: 13, fontWeight: 600, color: '#42493f',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  fontSize: 14, fontWeight: 600, color: '#64748b', textDecoration: 'none',
                }}>Đăng nhập</Link>
              </>
            )}
          </div>

          {/* Mobile: Hamburger + Auth quick buttons */}
          <div className="mobile-nav-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isAuthenticated && (
              <Link to="/login" className="btn-primary"
                style={{ textDecoration: 'none', padding: '7px 14px', fontSize: 13 }}>
                Đăng nhập
              </Link>
            )}
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#881337', padding: 6, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 26 }}>
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="animate-slideDown" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(193,201,188,0.6)',
            boxShadow: '0 8px 24px rgba(57,105,56,0.15)',
            zIndex: 100,
            padding: '12px 0 8px',
          }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '13px 20px',
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: isActive(link.path) ? 700 : 500,
                color: isActive(link.path) ? '#396938' : '#42493f',
                background: isActive(link.path) ? 'rgba(57,105,56,0.08)' : 'transparent',
                transition: 'all 0.15s',
                borderLeft: isActive(link.path) ? '3px solid #396938' : '3px solid transparent',
              }}
              >
                <span className={`material-symbols-outlined ${isActive(link.path) ? 'icon-fill' : ''}`}
                  style={{ fontSize: 20, color: isActive(link.path) ? '#396938' : '#72796e' }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
            {/* Auth section */}
            <div style={{ margin: '8px 20px 4px', paddingTop: 12, borderTop: '1px solid rgba(193,201,188,0.4)', display: 'flex', gap: 12 }}>
              {isAuthenticated ? (
                <>
                  <Link to="/settings" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', color: '#42493f', textDecoration: 'none' }}>
                    <span className="material-symbols-outlined">settings</span>
                  </Link>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#42493f', alignSelf: 'center' }}>
                    Hi, {user?.username || 'Chef'}
                  </span>
                  <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13, flex: 1, justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center', padding: '10px' }}>
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Bottom Navigation (mobile only) */}
      <BottomNav />

      {/* CSS to hide/show desktop vs mobile elements */}
      <style>{`
        @media (min-width: 641px) {
          .mobile-nav-right { display: none !important; }
        }
        @media (max-width: 640px) {
          .top-navbar { display: none !important; }
          .desktop-nav { display: none !important; }
          .desktop-actions { display: none !important; }
          .bottom-nav {
            display: flex !important;
            flex-direction: column !important;
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
          }
        }
      `}</style>
    </>
  );
}

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const BOTTOM_LINKS = [
    { label: 'Trang chủ', path: '/',          icon: 'home' },
    { label: 'Khám phá',  path: '/recipes',   icon: 'search' },
    { label: 'Tủ lạnh',   path: '/fridge',    icon: 'kitchen' },
    { label: 'Thực đơn',  path: '/meal-plan', icon: 'calendar_month' },
    { label: 'Giỏ hàng',  path: '/cart',      icon: 'shopping_cart' },
    { label: 'Của tôi',   path: '/my-kitchen',icon: 'restaurant_menu' },
  ];

  const handleNav = (path) => {
    if (!isAuthenticated && ['/fridge', '/my-kitchen', '/cart', '/meal-plan'].includes(path)) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-items">
        {BOTTOM_LINKS.map((link) => (
          <button
            key={link.path}
            className={`bottom-nav-item ${isActive(link.path) ? 'active' : ''}`}
            onClick={() => handleNav(link.path)}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

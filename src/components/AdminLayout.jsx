import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: 'dashboard' },
    { name: 'Recipes', path: '/admin/recipes', icon: 'restaurant_menu' },
    { name: 'Ingredients', path: '/admin/ingredients', icon: 'nutrition' },
    { name: 'Users', path: '/admin/users', icon: 'group' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#f7faf3', color: '#191d19' }}
      className="flex min-h-screen"
    >
      {/* SideNavBar */}
      <aside
        style={{ width: '256px', minWidth: '256px', backgroundColor: '#f2f5ee', borderRight: '1px solid #c1c9bc' }}
        className="flex flex-col h-screen fixed left-0 top-0 z-40 p-5"
      >
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div
            style={{ backgroundColor: '#c8ffc0', width: '40px', height: '40px', borderRadius: '10px' }}
            className="flex items-center justify-center flex-shrink-0 overflow-hidden"
          >
            <img src="/logo_bg.png" alt="SmartFridge" className="w-full h-full object-cover" />
          </div>
          <div>
            <p style={{ color: '#396938', fontWeight: 700, fontSize: '16px', lineHeight: '20px' }}>SmartFridge</p>
            <p style={{ color: '#42493f', fontSize: '11px', letterSpacing: '0.05em' }}>Management Suite</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-1">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                style={
                  active
                    ? { backgroundColor: '#c8ffc0', color: '#215023', borderRadius: '10px', fontWeight: 700 }
                    : { color: '#42493f', borderRadius: '10px' }
                }
                className="flex items-center gap-3 px-3 py-3 transition-all duration-200 hover:translate-x-1"
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = '#e6e9e2'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0", fontSize: '22px' }}
                >
                  {item.icon}
                </span>
                <span style={{ fontSize: '13px', fontWeight: active ? 700 : 500 }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ borderTop: '1px solid #c1c9bc', paddingTop: '16px', marginTop: 'auto' }} className="flex flex-col gap-1">
          <Link
            to="/home"
            style={{ color: '#42493f', borderRadius: '10px' }}
            className="flex items-center gap-3 px-3 py-3 transition-all hover:translate-x-1"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e6e9e2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>home</span>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Main Site</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{ color: '#ba1a1a', borderRadius: '10px', textAlign: 'left' }}
            className="w-full flex items-center gap-3 px-3 py-3 transition-all"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffdad6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>logout</span>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ marginLeft: '256px' }} className="flex-1 flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header
          style={{ backgroundColor: '#f7faf3', borderBottom: '1px solid #c1c9bc', boxShadow: '0 1px 4px rgba(57,105,56,0.06)' }}
          className="h-16 px-6 flex justify-between items-center sticky top-0 z-30"
        >
          <div className="flex items-center gap-4">
            <span style={{ color: '#396938', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>
              SmartFridge Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              style={{ color: '#42493f', borderRadius: '50%', padding: '6px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e6e9e2'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              className="transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>notifications</span>
            </button>
            <button
              style={{ color: '#42493f', borderRadius: '50%', padding: '6px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e6e9e2'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              className="transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>settings</span>
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#c1c9bc' }} className="hidden md:block" />
            <div className="hidden md:block text-right">
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#191d19' }}>{user?.username || 'Admin'}</p>
              <p style={{ fontSize: '11px', color: '#42493f', textTransform: 'capitalize' }}>{user?.role || 'Administrator'}</p>
            </div>
            <div
              style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #c8ffc0' }}
            >
              <img
                alt="Admin Avatar"
                className="w-full h-full object-cover"
                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'A')}&background=c8ffc0&color=215023&bold=true`}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '32px', flex: 1, backgroundColor: '#f7faf3' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

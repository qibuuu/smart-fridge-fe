import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function ModernAdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { name: 'Overview', path: '/admin-v2', icon: 'dashboard' },
    { name: 'Recipes', path: '/admin-v2/recipes', icon: 'restaurant_menu' },
    { name: 'Ingredients', path: '/admin-v2/ingredients', icon: 'nutrition' },
    { name: 'Users', path: '/admin-v2/users', icon: 'group' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
      className="flex h-screen w-screen overflow-hidden text-[#191d19] font-sans antialiased"
      style={{
        backgroundColor: '#f7faf3',
        backgroundImage: 'radial-gradient(circle, rgba(57,105,56,0.05) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* Frosted Glassmorphic Sidebar */}
      <aside 
        className="w-64 min-w-[256px] h-full shrink-0 z-40 p-6 border-r border-[#c1c9bc]/40 backdrop-blur-xl bg-[#f2f5ee]/80 flex flex-col justify-between shadow-lg"
      >
        <div>
          {/* Header Brand */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#c8ffc0] rounded-full flex items-center justify-center mb-3 overflow-hidden shadow-md border border-[#c1c9bc]/30 group hover:scale-105 transition-transform duration-300">
              <img 
                alt="SmartFridge Logo" 
                className="w-full h-full object-cover" 
                src="/logo_bg.png"
              />
            </div>
            <h1 className="text-xl font-black text-[#396938] tracking-tight bg-gradient-to-r from-[#396938] to-[#153a14] bg-clip-text text-transparent">
              SmartFridge
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] text-[#42493f] font-bold tracking-wider uppercase">Admin Portal v2.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-[#c8ffc0] text-[#215023] shadow-md shadow-[#396938]/10' 
                      : 'text-[#42493f] hover:bg-[#e6e9e2]/60 hover:text-[#191d19]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-[#215023]' : 'text-[#5f665b]'
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#215023] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-rose-200/60 bg-rose-50/50 hover:bg-rose-100/60 text-rose-700 font-bold text-sm transition-all duration-300 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-grow flex flex-col h-full overflow-y-auto">
        {/* Modern Top Header */}
        <header className="h-20 px-10 border-b border-[#c1c9bc]/30 backdrop-blur-md bg-white/70 flex justify-between items-center sticky top-0 z-30 shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <span className="text-[11px] px-3 py-1 bg-[#c8ffc0] text-[#215023] rounded-full font-bold uppercase tracking-wider shadow-xs">
              Live Cloud Active
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* System Status pulse */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f2f5ee]/80 border border-[#c1c9bc]/20">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 relative flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              </span>
              <span className="text-xs font-bold text-[#42493f]">APIs Operational</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-[#42493f] hover:bg-[#e6e9e2]/80 hover:text-[#191d19] rounded-xl transition-all relative">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button className="p-2 text-[#42493f] hover:bg-[#e6e9e2]/80 hover:text-[#191d19] rounded-xl transition-all">
                <span className="material-symbols-outlined text-[22px]">settings</span>
              </button>
            </div>

            <div className="h-8 w-px bg-[#c1c9bc]/40"></div>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#e6e9e2]/50 transition-all text-left"
              >
                <div className="h-10 w-10 rounded-xl overflow-hidden border border-[#c1c9bc]/50 shadow-sm bg-emerald-50">
                  <img
                    alt="Admin Headshot"
                    className="w-full h-full object-cover"
                    src={user?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1c4Q4GPOtTWe1-hQjwp4q7g8cxREXNMzbGgNDm7drhDI1XeL4P1T57oqzjqcWNxt7iCyWlODtfqHevKL8010TxvdctjWoCTb7t0ey8URNXR0irorRvJfzaizAwbI_SKCeUi9_aTlmI8xR51lCBS4VW32Z2-QDDC4nnabfudqLSQPVPn23nce4LQ7b0hlQW8ICu47BfXjr118mrsYHHpCPjaYgnetdvEYExoWxmBxHvgQPIMq9Fga44d16_cdnssgofKsCrszJ400'}
                  />
                </div>
                <div className="hidden lg:block leading-none">
                  <p className="text-sm font-bold text-[#191d19]">{user?.username || 'Administrator'}</p>
                  <span className="text-[10px] text-[#5f665b] font-bold uppercase tracking-wider">{user?.role || 'SYSTEM ADMIN'}</span>
                </div>
              </button>

              {/* Profile Frosted Floating Menu */}
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/50 backdrop-blur-2xl bg-white/95 p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="border-b border-[#c1c9bc]/20 pb-3 mb-3">
                      <p className="text-sm font-extrabold text-[#191d19]">{user?.username || 'Administrator'}</p>
                      <p className="text-xs text-[#5f665b]">{user?.email || 'admin@smartfridge.com'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left font-bold text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Logout Account</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Canvas */}
        <main className="p-10 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}

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

  return (
    <div className="flex min-h-screen bg-[#f7faf3] text-[#191d19] font-sans antialiased">
      {/* SideNavBar: Fixed for desktop */}
      <aside 
        style={{ width: '256px', minWidth: '256px' }} 
        className="flex flex-col h-screen fixed left-0 top-0 z-40 p-5 border-r border-[#c1c9bc] bg-[#f2f5ee]"
      >
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#c8ffc0] rounded-full flex items-center justify-center mb-2 overflow-hidden shadow-xs">
            <img 
              alt="SmartFridge Logo" 
              className="w-full h-full object-cover" 
              src="/logo_bg.png"
            />
          </div>
          <h1 className="text-xl font-bold text-[#396938] text-center">SmartFridge</h1>
          <p className="text-xs text-[#42493f] font-semibold tracking-wider uppercase">Admin Panel</p>
        </div>

        <nav className="flex-grow space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 hover:translate-x-1 ${
                  isActive
                    ? 'bg-[#c8ffc0] text-[#215023] font-bold shadow-xs'
                    : 'text-[#42493f] hover:bg-[#e6e9e2] hover:text-[#191d19]'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 pt-4 border-t border-[#c1c9bc]">
          <div className="pt-2 space-y-1">
            <Link
              to="/home"
              className="flex items-center gap-3 px-4 py-3 text-[#42493f] hover:bg-[#e6e9e2] rounded-lg font-semibold transition-all"
            >
              <span className="material-symbols-outlined">home</span>
              <span className="text-sm">Main Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-all text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ marginLeft: '256px' }} className="flex-grow flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="h-16 px-8 bg-white border-b border-[#c1c9bc] flex justify-between items-center sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#396938] tracking-tight">SmartFridge Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-1.5 text-[#42493f] hover:bg-[#e6e9e2] rounded-full transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="p-1.5 text-[#42493f] hover:bg-[#e6e9e2] rounded-full transition-colors">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
            <div className="h-px w-4 bg-[#c1c9bc] rotate-90 hidden md:block"></div>
            
            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-[#191d19]">{user?.username || 'Admin User'}</p>
                <p className="text-xs text-[#42493f] capitalize">{user?.role || 'Administrator'}</p>
              </div>
              <div className="h-8 w-8 rounded-full overflow-hidden border border-[#c1c9bc]">
                <img
                  alt="Admin Avatar"
                  className="w-full h-full object-cover"
                  src={user?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1c4Q4GPOtTWe1-hQjwp4q7g8cxREXNMzbGgNDm7drhDI1XeL4P1T57oqzjqcWNxt7iCyWlODtfqHevKL8010TxvdctjWoCTb7t0ey8URNXR0irorRvJfzaizAwbI_SKCeUi9_aTlmI8xR51lCBS4VW32Z2-QDDC4nnabfudqLSQPVPn23nce4LQ7b0hlQW8ICu47BfXjr118mrsYHHpCPjaYgnetdvEYExoWxmBxHvgQPIMq9Fga44d16_cdnssgofKsCrszJ400'}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Canvas / Dynamic Page */}
        <main className="p-10 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}


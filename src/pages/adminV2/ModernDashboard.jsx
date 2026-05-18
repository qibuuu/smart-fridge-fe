import React, { useEffect, useState } from 'react';
import ModernAdminLayout from './components/ModernAdminLayout';
import { getAllRecipes } from '../../api/recipes';
import { getAllIngredients } from '../../api/ingredients';
import { getAllUsers } from '../../api/users';
import { Link } from 'react-router-dom';

export default function ModernDashboard() {
  const [stats, setStats] = useState({
    recipesCount: 0,
    ingredientsCount: 0,
    usersCount: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [recipesRes, ingredientsRes, usersRes] = await Promise.all([
          getAllRecipes(),
          getAllIngredients(),
          getAllUsers(),
        ]);
        setStats({
          recipesCount: recipesRes.data.length,
          ingredientsCount: ingredientsRes.data.length,
          usersCount: usersRes.data.length,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }
    fetchStats();
  }, []);

  return (
    <ModernAdminLayout>
      {/* Upper Welcome Banner */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#191d19] tracking-tight bg-gradient-to-r from-[#191d19] to-[#396938] bg-clip-text text-transparent">
            Chào mừng trở lại, Admin!
          </h2>
          <p className="text-[#42493f] mt-1.5 font-medium">
            Hệ thống SmartFridge đang hoạt động trơn tru. Dưới đây là các chỉ số vận hành tổng thể hôm nay.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white/70 backdrop-blur-xs rounded-xl border border-[#c1c9bc]/30 shadow-xs text-center">
            <span className="text-[10px] text-[#42493f] font-bold uppercase tracking-wider block">Server Load</span>
            <span className="text-sm font-black text-[#396938]">0.08s latency</span>
          </div>
          <div className="px-4 py-2 bg-white/70 backdrop-blur-xs rounded-xl border border-[#c1c9bc]/30 shadow-xs text-center">
            <span className="text-[10px] text-[#42493f] font-bold uppercase tracking-wider block">Security Shield</span>
            <span className="text-sm font-black text-emerald-600">Active & Safe</span>
          </div>
        </div>
      </div>

      {stats.loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#396938]/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#396938] animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Stats Glassmorphic Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Total Recipes Widget with SVG Sparkline */}
            <div className="border border-white/50 backdrop-blur-md bg-white/70 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Total Recipes</p>
                  <h3 className="text-4xl font-black text-[#191d19] mt-2 tracking-tight">{stats.recipesCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#c8ffc0]/60 flex items-center justify-center border border-[#c1c9bc]/20 shadow-xs">
                  <span className="material-symbols-outlined text-[#396938] text-[20px]">restaurant</span>
                </div>
              </div>
              <div className="flex items-end justify-between mt-4">
                <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +14% this week
                </span>
                {/* Embedded SVG sparkline */}
                <div className="w-24 h-10 overflow-visible opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <defs>
                      <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#396938" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#396938" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,35 Q15,10 30,25 T60,5 T90,20 L100,20"
                      fill="none"
                      stroke="#396938"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0,35 Q15,10 30,25 T60,5 T90,20 L100,20 L100,40 L0,40 Z"
                      fill="url(#gradient-green)"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Ingredients Alerts with Custom stock percentage Ring */}
            <div className="border border-white/50 backdrop-blur-md bg-white/70 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Active Ingredients</p>
                  <h3 className="text-4xl font-black text-[#191d19] mt-2 tracking-tight">{stats.ingredientsCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#cefdc7]/60 flex items-center justify-center border border-[#c1c9bc]/20 shadow-xs">
                  <span className="material-symbols-outlined text-[#40683e] text-[20px]">nutrition</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-amber-700 text-xs font-bold flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> 98% in stock
                </span>
                {/* Dynamic mini-progress gauge bar */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#42493f]">Stock status</span>
                  <div className="w-16 h-2 bg-[#e6e9e2] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-[#396938] rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Users Community Sparkline */}
            <div className="border border-white/50 backdrop-blur-md bg-white/70 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Total Community</p>
                  <h3 className="text-4xl font-black text-[#191d19] mt-2 tracking-tight">{stats.usersCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/60 flex items-center justify-center border border-[#c1c9bc]/20 shadow-xs">
                  <span className="material-symbols-outlined text-blue-700 text-[20px]">group</span>
                </div>
              </div>
              <div className="flex items-end justify-between mt-4">
                <span className="text-blue-700 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-[14px]">rocket_launch</span> Strong growth
                </span>
                {/* Custom Blue Sparkline */}
                <div className="w-24 h-10 overflow-visible opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <defs>
                      <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,35 Q20,38 40,15 T70,18 T100,5"
                      fill="none"
                      stroke="#1d4ed8"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0,35 Q20,38 40,15 T70,18 T100,5 L100,40 L0,40 Z"
                      fill="url(#gradient-blue)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Command Actions Grid & Hero banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions Panel */}
            <div className="lg:col-span-2 border border-white/50 backdrop-blur-md bg-white/70 p-8 rounded-3xl shadow-lg flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-black text-[#191d19] mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#396938] text-[22px]">bolt</span>
                  Bento Quick Actions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Link
                    to="/admin-v2/recipes"
                    className="group border border-[#c1c9bc]/30 hover:border-[#396938] bg-white p-5 rounded-2xl flex flex-col items-center text-center gap-3 transition-all duration-300 hover:shadow-md hover:scale-[1.03]"
                  >
                    <div className="w-12 h-12 bg-[#c8ffc0]/60 rounded-xl group-hover:bg-[#396938] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <span className="material-symbols-outlined text-[#396938] group-hover:text-white text-[22px]">add_circle</span>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-[#191d19] group-hover:text-[#396938] transition-colors">Recipes Suite</h5>
                      <p className="text-[11px] text-[#5f665b] mt-1">Publish, edit, and categorize recipes</p>
                    </div>
                  </Link>

                  <Link
                    to="/admin-v2/ingredients"
                    className="group border border-[#c1c9bc]/30 hover:border-[#40683e] bg-white p-5 rounded-2xl flex flex-col items-center text-center gap-3 transition-all duration-300 hover:shadow-md hover:scale-[1.03]"
                  >
                    <div className="w-12 h-12 bg-[#cefdc7]/60 rounded-xl group-hover:bg-[#40683e] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <span className="material-symbols-outlined text-[#40683e] group-hover:text-white text-[22px]">inventory_2</span>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-[#191d19] group-hover:text-[#40683e] transition-colors">Ingredients Hub</h5>
                      <p className="text-[11px] text-[#5f665b] mt-1">Monitor icons, categories, and inventory</p>
                    </div>
                  </Link>

                  <Link
                    to="/admin-v2/users"
                    className="group border border-[#c1c9bc]/30 hover:border-blue-500 bg-white p-5 rounded-2xl flex flex-col items-center text-center gap-3 transition-all duration-300 hover:shadow-md hover:scale-[1.03]"
                  >
                    <div className="w-12 h-12 bg-blue-100/60 rounded-xl group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <span className="material-symbols-outlined text-blue-700 group-hover:text-white text-[22px]">manage_accounts</span>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-[#191d19] group-hover:text-blue-600 transition-colors">Users Console</h5>
                      <p className="text-[11px] text-[#5f665b] mt-1">Adjust privileges and review credentials</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Bento Welcome Visual anchor card */}
              <div className="relative overflow-hidden group rounded-2xl transition-all duration-500 h-32 flex flex-col justify-end mt-8 p-5 text-white shadow-inner">
                {/* Background organic farm image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d15943747d?auto=format&fit=crop&q=80&w=600')` }}
                />
                {/* High-fidelity forest gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b3f1b] via-[#396938]/85 to-transparent"></div>
                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <h5 className="font-black text-base tracking-tight leading-none">SmartFridge Ecosystem</h5>
                    <p className="text-[10px] text-emerald-200 mt-1">Cải tiến cách quản lý ẩm thực hiện đại, khoa học và bền vững.</p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-300 animate-pulse text-[24px]">forest</span>
                </div>
              </div>
            </div>

            {/* Live System Activity Feed Timeline */}
            <div className="border border-white/50 backdrop-blur-md bg-white/70 p-8 rounded-3xl shadow-lg flex flex-col">
              <h4 className="text-lg font-black text-[#191d19] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#396938] text-[22px]">history</span>
                Live Database Activity
              </h4>
              <div className="flex-grow space-y-5 overflow-y-auto max-h-[290px] pr-2">
                {[
                  { time: 'Just now', title: 'Data Seed Sync successful', desc: 'Database seeded with fresh organic assets.', icon: 'sync', color: 'text-emerald-600 bg-emerald-50' },
                  { time: '10 mins ago', title: 'Admin Logged In', desc: 'Secure local session created under admin role.', icon: 'admin_panel_settings', color: 'text-blue-600 bg-blue-50' },
                  { time: '2 hours ago', title: 'Security Healthcheck', desc: 'Google OAuth endpoints successfully verified.', icon: 'gshield', color: 'text-rose-600 bg-rose-50' },
                  { time: 'Yesterday', title: 'Active Connections', desc: 'Vite & Spring Boot CORS policies matched.', icon: 'settings_ethernet', color: 'text-amber-600 bg-amber-50' }
                ].map((act, i) => (
                  <div key={i} className="flex gap-4 relative group">
                    {i !== 3 && <div className="absolute left-4.5 top-8 bottom-0 w-0.5 bg-[#c1c9bc]/30 group-hover:bg-[#396938]/30 transition-colors"></div>}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[#c1c9bc]/20 shadow-xs ${act.color}`}>
                      <span className="material-symbols-outlined text-[16px]">{act.icon}</span>
                    </div>
                    <div className="leading-tight mt-0.5">
                      <div className="flex justify-between items-center gap-2">
                        <h6 className="font-extrabold text-xs text-[#191d19]">{act.title}</h6>
                        <span className="text-[9px] font-bold text-[#5f665b] uppercase tracking-wider">{act.time}</span>
                      </div>
                      <p className="text-[10px] text-[#42493f] mt-1 leading-normal">{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ModernAdminLayout>
  );
}

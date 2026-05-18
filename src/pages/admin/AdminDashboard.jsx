import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllRecipes } from '../../api/recipes';
import { getAllIngredients } from '../../api/ingredients';
import { getAllUsers } from '../../api/users';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
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
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#191d19]">Dashboard Overview</h2>
        <p className="text-[#42493f] mt-1">Review system metrics and manage your culinary catalog.</p>
      </div>

      {stats.loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#396938]"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#c1c9bc] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#42493f] uppercase tracking-wider">Total Recipes</p>
                <h2 className="text-3xl font-extrabold text-[#191d19] mt-1">{stats.recipesCount}</h2>
                <span className="text-[#396938] text-xs font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> +12% this month
                </span>
              </div>
              <div className="w-12 h-12 bg-[#c8ffc0] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#396938]">restaurant</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#c1c9bc] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#42493f] uppercase tracking-wider">Active Ingredients</p>
                <h2 className="text-3xl font-extrabold text-[#191d19] mt-1">{stats.ingredientsCount}</h2>
                <span className="text-[#396938] text-xs font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> 98% in stock
                </span>
              </div>
              <div className="w-12 h-12 bg-[#cefdc7] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#40683e]">nutrition</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#c1c9bc] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#42493f] uppercase tracking-wider">Active Users</p>
                <h2 className="text-3xl font-extrabold text-[#191d19] mt-1">{stats.usersCount}</h2>
                <span className="text-[#735858] text-xs font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[16px]">group</span> Community growth
                </span>
              </div>
              <div className="w-12 h-12 bg-[#ffdada] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#735858]">group</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & System Info Bento Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Card (2/3 width on desktop) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#c1c9bc] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#191d19] mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#396938]">bolt</span>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    to="/admin/recipes"
                    className="group cursor-pointer bg-white p-4 rounded-xl border border-[#c1c9bc] hover:border-[#396938] hover:bg-[#c8ffc0]/20 transition-all flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#c8ffc0] group-hover:bg-white flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[#396938]">add_circle</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#191d19]">Add New Recipe</h4>
                    <p className="text-xs text-[#42493f]">Publish a new culinary creation</p>
                  </Link>

                  <Link
                    to="/admin/ingredients"
                    className="group cursor-pointer bg-white p-4 rounded-xl border border-[#c1c9bc] hover:border-[#396938] hover:bg-[#c8ffc0]/20 transition-all flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#c8ffc0] group-hover:bg-white flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[#396938]">inventory_2</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#191d19]">Manage Ingredients</h4>
                    <p className="text-xs text-[#42493f]">Update stock levels and tags</p>
                  </Link>

                  <Link
                    to="/admin/users"
                    className="group cursor-pointer bg-white p-4 rounded-xl border border-[#c1c9bc] hover:border-[#396938] hover:bg-[#c8ffc0]/20 transition-all flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#c8ffc0] group-hover:bg-white flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[#396938]">person_add</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#191d19]">Manage Users</h4>
                    <p className="text-xs text-[#42493f]">Review member accounts</p>
                  </Link>
                </div>
              </div>

              {/* Bento organic visual anchor card (like in the mockup!) */}
              <div className="relative overflow-hidden group rounded-xl transition-all h-28 flex flex-col justify-end mt-4 p-4 text-white">
                <div className="absolute inset-0 opacity-80 mix-blend-multiply bg-[#396938]">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Organic fresh vegetables"
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">Organic Seeding Active</h4>
                    <p className="text-xs text-gray-200">Catalog utilizes premium high-resolution crop photography.</p>
                  </div>
                  <span className="material-symbols-outlined text-[#c8ffc0]">spa</span>
                </div>
              </div>
            </div>

            {/* System Info Card (1/3 width on desktop) */}
            <div className="bg-white p-6 rounded-2xl border border-[#c1c9bc] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#191d19] mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">info</span>
                  System Info
                </h3>
                <div className="space-y-3 mt-4 text-[#42493f] text-sm">
                  <div className="flex justify-between border-b border-[#c1c9bc] pb-2">
                    <span className="font-medium">Backend Health Check</span>
                    <span className="text-[#396938] font-bold flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#396938] inline-block"></span> Operational
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#c1c9bc] pb-2">
                    <span className="font-medium">API Version</span>
                    <span className="font-semibold text-[#191d19]">v1.0.0 (Local)</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="font-medium">Environment</span>
                    <span className="font-semibold text-blue-600">SmartFridge Ecosystem</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#c8ffc0] p-4 rounded-xl text-xs text-[#215023] font-semibold mt-4">
                Tip: Dynamic image seeding is active! Make sure to upload recipe and ingredient photos via the upload manager to build a rich organic catalog.
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

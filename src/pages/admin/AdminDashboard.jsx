import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllRecipes } from '../../api/recipes';
import { getAllIngredients } from '../../api/ingredients';
import { getAllUsers } from '../../api/users';
import { Link } from 'react-router-dom';

const C = {
  primary: '#396938',
  primaryContainer: '#c8ffc0',
  onPrimaryContainer: '#215023',
  tertiary: '#40683e',
  tertiaryContainer: '#cefdc7',
  secondary: '#735858',
  secondaryContainer: '#ffdada',
  onSecondaryContainer: '#795d5e',
  surface: '#f7faf3',
  surfaceContainer: '#ecefe8',
  surfaceContainerLow: '#f2f5ee',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e6e9e2',
  onSurface: '#191d19',
  onSurfaceVariant: '#42493f',
  outline: '#72796e',
  outlineVariant: '#c1c9bc',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
};

const statCardStyle = {
  backgroundColor: C.surfaceContainerLowest,
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 8px 32px -4px rgba(57,105,56,0.07)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ recipesCount: 0, ingredientsCount: 0, usersCount: 0, loading: true });
  const [recentRecipes, setRecentRecipes] = useState([]);

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
        setRecentRecipes(recipesRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: C.onSurface, letterSpacing: '-0.02em', lineHeight: '40px' }}>
          Overview
        </h1>
        <p style={{ color: C.onSurfaceVariant, fontSize: '15px', marginTop: '4px' }}>
          Monitor and manage your SmartFridge ecosystem.
        </p>
      </div>

      {stats.loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: `3px solid ${C.primaryContainer}`,
            borderTopColor: C.primary,
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* Recipes */}
            <div style={statCardStyle}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Recipes
                </p>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.onSurface, lineHeight: '36px', marginTop: '4px' }}>
                  {stats.recipesCount}
                </h2>
                <span style={{ color: C.primary, fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>
                  Active recipes in catalog
                </span>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: C.primaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: '22px' }}>restaurant</span>
              </div>
            </div>

            {/* Ingredients */}
            <div style={statCardStyle}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Active Ingredients
                </p>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.onSurface, lineHeight: '36px', marginTop: '4px' }}>
                  {stats.ingredientsCount}
                </h2>
                <span style={{ color: C.tertiary, fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                  Ingredient library entries
                </span>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: C.tertiaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: C.tertiary, fontSize: '22px' }}>nutrition</span>
              </div>
            </div>

            {/* Users */}
            <div style={statCardStyle}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Registered Users
                </p>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.onSurface, lineHeight: '36px', marginTop: '4px' }}>
                  {stats.usersCount}
                </h2>
                <span style={{ color: C.onSecondaryContainer, fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>group</span>
                  Community growth
                </span>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: C.secondaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: C.secondary, fontSize: '22px' }}>group</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.onSurface, marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { to: '/admin/recipes', icon: 'add_circle', label: 'Add New Recipe', desc: 'Publish a new culinary creation' },
                { to: '/admin/ingredients', icon: 'inventory_2', label: 'Manage Ingredients', desc: 'Update ingredient library' },
                { to: '/admin/users', icon: 'person_add', label: 'Manage Users', desc: 'Oversee member accounts' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  style={{
                    backgroundColor: C.surface,
                    border: `1px solid ${C.outlineVariant}`,
                    borderRadius: '14px',
                    padding: '20px',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.primary;
                    e.currentTarget.style.backgroundColor = C.primaryContainer;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.outlineVariant;
                    e.currentTarget.style.backgroundColor = C.surface;
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: C.primaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined" style={{ color: C.primary }}>{action.icon}</span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: C.onSurface }}>{action.label}</h4>
                  <p style={{ fontSize: '12px', color: C.onSurfaceVariant, marginTop: '4px' }}>{action.desc}</p>
                </Link>
              ))}

              {/* Hero Visual Card */}
              <div style={{ borderRadius: '14px', overflow: 'hidden', position: 'relative', minHeight: '160px', backgroundColor: C.primary, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'overlay' }}
                  />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>Recipe Catalog</h4>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>Premium culinary database active</p>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom: Recent Recipes + System Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Recent Recipes */}
            <div style={{ backgroundColor: C.surfaceContainerLowest, borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px -4px rgba(57,105,56,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.onSurface }}>Recent Recipes</h3>
                <Link to="/admin/recipes" style={{ color: C.primary, fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentRecipes.length === 0 ? (
                  <p style={{ color: C.onSurfaceVariant, fontSize: '13px' }}>No recipes yet.</p>
                ) : recentRecipes.map((r) => (
                  <div
                    key={r.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px', borderRadius: '10px', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surfaceContainer; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', backgroundColor: C.surfaceContainerHigh, flexShrink: 0 }}>
                      {r.imageUrl ? (
                        <img src={r.imageUrl} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined" style={{ color: C.onSurfaceVariant, fontSize: '20px' }}>restaurant</span>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: C.onSurface, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
                      <p style={{ fontSize: '12px', color: C.onSurfaceVariant, marginTop: '2px' }}>{r.difficulty || 'Recipe'}</p>
                    </div>
                    {r.tags && (
                      <span style={{ backgroundColor: C.tertiaryContainer, color: '#4e774c', fontSize: '11px', fontWeight: 600, padding: '2px 10px', borderRadius: '999px', flexShrink: 0 }}>
                        {r.tags}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div style={{ backgroundColor: C.surfaceContainerLowest, borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px -4px rgba(57,105,56,0.07)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.onSurface, marginBottom: '4px' }}>System Status</h3>
              {[
                { label: 'Backend Health', value: 'Operational', valueColor: C.primary, dot: C.primary },
                { label: 'API Version', value: 'v1 (Local)', valueColor: C.onSurface, dot: null },
                { label: 'Auth Mode', value: 'JWT + Google OAuth', valueColor: C.onSurface, dot: null },
                { label: 'Environment', value: 'SmartFridge Ecosystem', valueColor: '#1d6ecc', dot: null },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 3 ? `1px solid ${C.outlineVariant}` : 'none', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: C.onSurfaceVariant, fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontSize: '13px', color: row.valueColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {row.dot && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: row.dot, display: 'inline-block' }} />}
                    {row.value}
                  </span>
                </div>
              ))}
              <div style={{ backgroundColor: C.primaryContainer, borderRadius: '12px', padding: '14px', marginTop: '8px' }}>
                <p style={{ fontSize: '12px', color: C.onPrimaryContainer, fontWeight: 600, lineHeight: '18px' }}>
                  💡 Upload recipe and ingredient photos to build a rich visual catalog for your users.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

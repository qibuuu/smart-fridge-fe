import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllUsers, updateUser, deleteUser } from '../../api/users';

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
  surfaceBright: '#f7faf3',
  surfaceContainerLow: '#f2f5ee',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e6e9e2',
  surfaceContainer: '#ecefe8',
  onSurface: '#191d19',
  onSurfaceVariant: '#42493f',
  outline: '#72796e',
  outlineVariant: '#c1c9bc',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
};

const getRoleBadge = (role) => {
  if (role === 'ADMIN') return { bg: C.secondaryContainer, color: C.secondary };
  return { bg: C.tertiaryContainer, color: C.tertiary };
};

const getInitials = (username) =>
  username ? username.slice(0, 2).toUpperCase() : '??';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const [formData, setFormData] = useState({ username: '', email: '', role: 'USER', emailVerified: false });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
      setError('');
    } catch { setError('Không thể lấy danh sách người dùng.'); }
    finally { setLoading(false); }
  };

  const handleOpenEdit = (u) => {
    setSelectedUser(u);
    setFormData({ username: u.username || '', email: u.email || '', role: u.role || 'USER', emailVerified: u.emailVerified || false });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try { await deleteUser(id); fetchUsers(); }
    catch { alert('Xóa người dùng thất bại.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser.id, formData);
      setIsModalOpen(false); fetchUsers();
    } catch { alert('Không thể cập nhật người dùng.'); }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const inputStyle = {
    width: '100%', backgroundColor: C.surfaceContainerLow, border: 'none',
    borderRadius: '12px', padding: '12px 16px', fontSize: '14px',
    color: C.onSurface, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 700,
    color: C.onSurfaceVariant, textTransform: 'uppercase',
    letterSpacing: '0.05em', marginBottom: '8px',
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: C.onSurface, letterSpacing: '-0.02em' }}>User Management</h1>
        <p style={{ color: C.onSurfaceVariant, fontSize: '15px', marginTop: '4px' }}>
          Oversee and manage your culinary community platform.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { icon: 'group', label: 'Total Users', value: users.length, bg: C.secondaryContainer, color: C.secondary },
          { icon: 'verified', label: 'Verified', value: users.filter(u => u.emailVerified).length, bg: C.primaryContainer, color: C.primary },
          { icon: 'shield_person', label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, bg: C.tertiaryContainer, color: C.tertiary },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: C.surfaceContainerLowest, borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(57,105,56,0.05)', border: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: s.color, fontSize: '22px' }}>{s.icon}</span>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: C.onSurface, lineHeight: '34px' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div style={{ backgroundColor: C.surfaceContainerLowest, borderRadius: '16px', border: `1px solid ${C.outlineVariant}`, boxShadow: '0 4px 16px rgba(57,105,56,0.05)', overflow: 'hidden' }}>
        {/* Search */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-outlined" style={{ color: C.onSurfaceVariant, fontSize: '20px' }}>search</span>
          <input
            type="text" placeholder="Search users..."
            style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '14px', color: C.onSurface }}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.onSurfaceVariant }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          )}
        </div>

        {error && <div style={{ padding: '12px 20px', backgroundColor: C.errorContainer, color: C.error, fontSize: '13px' }}>{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `3px solid ${C.primaryContainer}`, borderTopColor: C.primary, animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: C.surfaceContainerLow, borderBottom: `1px solid ${C.outlineVariant}` }}>
                  {['User', 'Email Address', 'Role', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '14px 24px', fontSize: '14px', fontWeight: 700, color: C.onSurface, textAlign: i === 4 ? 'right' : 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: C.onSurfaceVariant, fontSize: '14px' }}>
                      No users found.
                    </td>
                  </tr>
                ) : paginated.map((u) => {
                  const role = getRoleBadge(u.role);
                  return (
                    <tr
                      key={u.id}
                      style={{ borderBottom: `1px solid ${C.outlineVariant}`, transition: 'background 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surfaceBright; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: C.primaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt={u.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '14px', fontWeight: 700, color: C.onPrimaryContainer }}>{getInitials(u.username)}</span>
                            )}
                          </div>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: C.onSurface }}>{u.username}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px', fontSize: '14px', color: C.onSurfaceVariant }}>{u.email}</td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ backgroundColor: role.bg, color: role.color, padding: '3px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: u.emailVerified ? C.primary : C.outline, display: 'inline-block' }} />
                          <span style={{ fontSize: '12px', fontWeight: 600, color: u.emailVerified ? C.primary : C.onSurfaceVariant }}>
                            {u.emailVerified ? 'Active' : 'Unverified'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '4px', opacity: 0 }} className="user-actions"
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                        >
                          <button
                            onClick={() => handleOpenEdit(u)}
                            style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant, backgroundColor: 'transparent', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surfaceContainerHigh; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: C.error, backgroundColor: 'transparent', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.errorContainer; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                          </button>
                        </div>
                        {/* Fallback always-visible buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <button
                            onClick={() => handleOpenEdit(u)}
                            style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant, backgroundColor: 'transparent', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surfaceContainerHigh; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: C.error, backgroundColor: 'transparent', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.errorContainer; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div style={{ padding: '14px 24px', borderTop: `1px solid ${C.outlineVariant}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: C.onSurfaceVariant }}>
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} users
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ padding: '6px', borderRadius: '10px', border: `1px solid ${C.outlineVariant}`, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', backgroundColor: 'transparent', opacity: currentPage === 1 ? 0.4 : 1, color: C.onSurfaceVariant }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: currentPage === p ? C.primary : 'transparent', color: currentPage === p ? 'white' : C.onSurfaceVariant, fontWeight: currentPage === p ? 700 : 400, fontSize: '13px' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ padding: '6px', borderRadius: '10px', border: `1px solid ${C.outlineVariant}`, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', backgroundColor: 'transparent', opacity: currentPage === totalPages ? 0.4 : 1, color: C.onSurfaceVariant }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Growth Stat Cards (from mockup) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
        {[
          { bg: C.primaryContainer, color: C.primary, icon: 'trending_up', title: 'User Growth', value: '+12%', sub: 'Compared to last month' },
          { bg: C.secondaryContainer, color: C.secondary, icon: 'verified_user', title: 'Active Creators', value: users.filter(u => u.emailVerified).length, sub: 'Verified community members' },
          { bg: C.tertiaryContainer, color: C.tertiary, icon: 'stars', title: 'Engagement', value: 'High', sub: 'Based on active accounts' },
        ].map((c) => (
          <div key={c.title} style={{ backgroundColor: c.bg, borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: c.color, fontSize: '20px' }}>{c.icon}</span>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: c.color }}>{c.title}</h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 700, color: c.color, lineHeight: '38px' }}>{c.value}</p>
            <p style={{ fontSize: '12px', color: c.color, opacity: 0.8, marginTop: '4px' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.onSurface }}>Edit User</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: C.onSurfaceVariant }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Tên Người Dùng</label>
                <input type="text" required style={inputStyle} value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" required style={inputStyle} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Vai Trò (Role)</label>
                <select style={inputStyle} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox" id="ev-check"
                  style={{ width: '18px', height: '18px', accentColor: C.primary, cursor: 'pointer' }}
                  checked={formData.emailVerified}
                  onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                />
                <label htmlFor="ev-check" style={{ fontSize: '14px', fontWeight: 600, color: C.onSurfaceVariant, cursor: 'pointer' }}>
                  Email Verified
                </label>
              </div>

              <div style={{ borderTop: `1px solid ${C.outlineVariant}`, paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 20px', border: `1px solid ${C.outlineVariant}`, borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: C.onSurfaceVariant, backgroundColor: 'white', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ padding: '10px 24px', backgroundColor: C.primary, color: 'white', borderRadius: '12px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

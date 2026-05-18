import React, { useEffect, useState } from 'react';
import ModernAdminLayout from './components/ModernAdminLayout';
import { getAllUsers, updateUser, deleteUser } from '../../api/users';

export default function ModernManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Edit user state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'USER',
    emailVerified: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (u) => {
    setSelectedUser(u);
    setFormData({
      username: u.username || '',
      email: u.email || '',
      role: u.role || 'USER',
      emailVerified: u.emailVerified || false,
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert('Xóa người dùng thất bại.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser.id, formData);
      setIsDrawerOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật người dùng.');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModernAdminLayout>
      {/* Title segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-[#191d19] tracking-tight bg-gradient-to-r from-[#191d19] to-[#396938] bg-clip-text text-transparent">
            User Management
          </h2>
          <p className="text-[#42493f] mt-1 font-medium">Oversee the list of registered culinary community members and administrators.</p>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center shrink-0 border border-rose-200/40">
            <span className="material-symbols-outlined text-[22px]">group</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-black text-[#191d19] mt-1">{users.length}</p>
          </div>
        </div>

        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#c8ffc0]/60 text-[#215023] rounded-xl flex items-center justify-center shrink-0 border border-[#c1c9bc]/10">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider">Verified Accounts</p>
            <p className="text-2xl font-black text-[#215023] mt-1">
              {users.filter(u => u.emailVerified).length}
            </p>
          </div>
        </div>

        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#cefdc7]/60 text-[#40683e] rounded-xl flex items-center justify-center shrink-0 border border-[#c1c9bc]/10">
            <span className="material-symbols-outlined text-[22px]">shield_person</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider">Administrators</p>
            <p className="text-2xl font-black text-[#40683e] mt-1">
              {users.filter(u => u.role === 'ADMIN' || u.role === 'ROLE_ADMIN').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Filter bar */}
      <div className="border border-white/50 backdrop-blur-md bg-white/60 p-5 rounded-2xl mb-8 flex gap-4 items-center shadow-xs">
        <span className="material-symbols-outlined text-[#5f665b]">search</span>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên tài khoản hoặc email của thành viên..."
          className="w-full bg-transparent border-none focus:outline-hidden text-sm placeholder-[#5f665b]/60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200/50 text-rose-700 rounded-2xl mb-8 font-bold text-sm shadow-xs animate-pulse">
          {error}
        </div>
      )}

      {/* Users Glassmorphic Table Grid */}
      <div className="border border-white/50 backdrop-blur-md bg-white/70 rounded-3xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-[#396938]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#396938] animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2f5ee]/80 border-b border-[#c1c9bc]/30">
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">User</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Email</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Role</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Verified</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e9e2]/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-20 text-[#5f665b] font-bold">
                      Không tìm thấy người dùng nào khớp với từ khóa tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr 
                      key={u.id} 
                      className="hover:bg-[#f7faf3]/60 transition-all duration-150 group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 border border-[#c1c9bc]/30 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                            {u.avatarUrl ? (
                              <img 
                                alt={u.username} 
                                className="w-full h-full object-cover" 
                                src={u.avatarUrl} 
                              />
                            ) : (
                              <div className="w-full h-full bg-rose-50 text-[#735858] flex items-center justify-center font-black text-sm uppercase">
                                {u.username ? u.username.charAt(0) : 'U'}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#191d19] group-hover:text-[#396938] transition-colors leading-tight">
                              {u.username}
                            </span>
                            <span className="text-[10px] text-[#5f665b] font-bold mt-1 tracking-wide">
                              User ID: #{u.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-[#42493f] font-semibold">{u.email}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${
                          u.role === 'ADMIN' || u.role === 'ROLE_ADMIN'
                            ? 'bg-rose-50 text-rose-700 border-rose-200/50'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                          u.emailVerified
                            ? 'bg-blue-50 text-blue-700 border-blue-200/50'
                            : 'bg-amber-50 text-amber-700 border-amber-200/50'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${u.emailVerified ? 'bg-blue-600' : 'bg-amber-600'}`}></span>
                          {u.emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-2 text-[#396938] hover:bg-[#c8ffc0] rounded-xl transition-all"
                            title="Edit User Info/Role"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Right-sliding Drawer for User details & role modification */}
      {isDrawerOpen && selectedUser && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-[#191d19]/25 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer container */}
          <div 
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 bg-white shadow-2xl border-l border-[#c1c9bc]/30 flex flex-col justify-between animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#c1c9bc]/20 bg-[#f2f5ee]/40 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#191d19] tracking-tight">Sửa Thông tin Thành viên</h3>
                <p className="text-[11px] text-[#5f665b] mt-0.5 font-bold uppercase tracking-wider">SmartFridge Cloud Editor</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 hover:bg-[#e6e9e2] text-[#42493f] rounded-full transition-colors flex items-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Fields */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-6">
              {/* Member Profile Card Display */}
              <div className="flex gap-4 items-center bg-[#f7faf3] p-5 rounded-2xl border border-[#c1c9bc]/30">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#e6e9e2] border border-[#c1c9bc]/30 flex items-center justify-center shadow-md shrink-0">
                  {selectedUser.avatarUrl ? (
                    <img 
                      alt="User headshot" 
                      className="w-full h-full object-cover" 
                      src={selectedUser.avatarUrl} 
                    />
                  ) : (
                    <div className="w-full h-full bg-rose-50 text-[#735858] flex items-center justify-center font-black text-lg uppercase">
                      {formData.username ? formData.username.charAt(0) : 'U'}
                    </div>
                  )}
                </div>
                <div className="leading-tight">
                  <h4 className="font-extrabold text-base text-[#191d19]">{formData.username}</h4>
                  <p className="text-xs text-[#5f665b] mt-1">{formData.email}</p>
                </div>
              </div>

              {/* Username Input Display (Read-only for security) */}
              <div>
                <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Tên tài khoản (Chỉ xem)</label>
                <input
                  type="text"
                  disabled
                  className="w-full border border-[#c1c9bc] bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-hidden text-[#5f665b] font-medium"
                  value={formData.username}
                />
              </div>

              {/* Role Select Dropdown */}
              <div>
                <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Phân quyền hệ thống *</label>
                <select
                  required
                  className="w-full border border-[#c1c9bc] focus:border-[#396938] rounded-xl px-4 py-3 text-sm focus:outline-hidden bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                >
                  <option value="USER">Thành viên thông thường (USER)</option>
                  <option value="ADMIN">Quản trị viên hệ thống (ADMIN)</option>
                </select>
              </div>

              {/* Verified Segmented Toggle switch */}
              <div>
                <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-3">Xác thực tài khoản (Email Verified)</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emailVerified: true }))}
                    className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      formData.emailVerified 
                        ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs' 
                        : 'border-[#c1c9bc] hover:bg-gray-50 text-[#5f665b]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Đã xác thực (Verified)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emailVerified: false }))}
                    className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      !formData.emailVerified 
                        ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs' 
                        : 'border-[#c1c9bc] hover:bg-gray-50 text-[#5f665b]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">pending</span>
                    <span>Chờ xác thực (Unverified)</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Footer buttons of Drawer */}
            <div className="px-8 py-6 border-t border-[#c1c9bc]/20 bg-[#f2f5ee]/40 flex gap-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-grow bg-[#396938] hover:bg-[#215023] text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Cập nhật tài khoản</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-3.5 border border-[#c1c9bc] hover:bg-[#e6e9e2] rounded-xl font-bold text-[#42493f] text-sm transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </>
      )}
    </ModernAdminLayout>
  );
}

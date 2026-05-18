import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllUsers, updateUser, deleteUser } from '../../api/users';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
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
      setIsModalOpen(false);
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
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#191d19]">User Management</h2>
          <p className="text-[#42493f]">Oversee the list of registered culinary community members and administrators.</p>
        </div>
      </div>

      {/* Bento Grid Stats like mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl border border-[#c1c9bc] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ffdada] text-[#735858] rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#42493f] uppercase">Total Users</p>
            <p className="text-2xl font-extrabold text-[#191d19]">{users.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#c1c9bc] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#c8ffc0] text-[#215023] rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#42493f] uppercase">Verified Accounts</p>
            <p className="text-2xl font-extrabold text-[#191d19]">
              {users.filter(u => u.emailVerified).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#c1c9bc] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#cefdc7] text-[#40683e] rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">shield_person</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#42493f] uppercase">Administrators</p>
            <p className="text-2xl font-extrabold text-[#191d19]">
              {users.filter(u => u.role === 'ADMIN').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter / Search bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#c1c9bc] mb-6 flex gap-4 items-center">
        <span className="material-symbols-outlined text-[#42493f]">search</span>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          className="w-full bg-transparent border-none focus:outline-hidden text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl mb-6">{error}</div>}

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#c1c9bc] overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#396938]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2f5ee] border-b border-[#c1c9bc]">
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">User</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Verified</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e9e2]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-[#42493f] font-medium">
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#f7faf3] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-[#c1c9bc] flex items-center justify-center shrink-0">
                            {u.avatarUrl ? (
                              <img alt={u.username} className="w-full h-full object-cover" src={u.avatarUrl} />
                            ) : (
                              <span className="material-symbols-outlined text-[#735858]">account_circle</span>
                            )}
                          </div>
                          <span className="font-bold text-[#191d19]">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-[#42493f]">{u.email}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.emailVerified
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${u.emailVerified ? 'bg-blue-600' : 'bg-amber-600'}`}></span>
                          {u.emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Edit User Info/Role"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined">delete</span>
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

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#191d19]">Cập Nhật Người Dùng</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Tên Người Dùng</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Vai Trò (Role)</label>
                <select
                  className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="email-verified-checkbox"
                  className="rounded-sm border-gray-300 text-[#396938] focus:ring-[#396938] h-4 w-4"
                  checked={formData.emailVerified}
                  onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                />
                <label htmlFor="email-verified-checkbox" className="text-sm font-semibold text-[#42493f]">
                  Xác minh Email (Verified)
                </label>
              </div>

              <div className="pt-4 border-t border-[#c1c9bc] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-[#c1c9bc] rounded-xl text-sm font-bold text-[#42493f] hover:bg-gray-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-xs"
                >
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

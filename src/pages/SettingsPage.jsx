import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import apiClient from '../api/apiClient';
import { COLORS } from '../constants';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState(user?.username || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
      navigate('/login');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (passwords.newPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          toast.error('Mật khẩu xác nhận không khớp!');
          setLoading(false);
          return;
        }
        await apiClient.put('/auth/change-password', {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        });
        toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        logout();
        navigate('/login');
        return;
      }
      
      // Logic for updating username if backend supports it, 
      // otherwise just simulated success like old code
      toast.success('Đã cập nhật thông tin thành công!');
      setIsEditing(false);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="page-container has-bottom-nav">
        <div style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}>
          <header style={{ marginBottom: 32, textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 800, color: COLORS.rose900, letterSpacing: '-0.02em' }}>
              Cài đặt
            </h1>
            <p style={{ color: 'rgba(25,29,25,0.6)', fontWeight: 600, marginTop: 4 }}>
              Quản lý tài khoản và bảo mật của bạn
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Account Info Section */}
            <section className="glass-card" style={{ padding: 'clamp(20px, 5vw, 32px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #fb7185, #fb923c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 24, fontWeight: 800,
                  boxShadow: '0 8px 16px rgba(251,113,133,0.3)'
                }}>
                  {(user?.username || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.rose900 }}>
                    {user?.username || 'Người dùng'}
                  </h2>
                  <p style={{ fontSize: 13, color: 'rgba(25,29,25,0.5)', fontWeight: 600 }}>
                    {user?.email || 'user@smartrecipe.com'}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                  Chỉnh sửa hồ sơ
                </button>
              ) : (
                <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, marginBottom: 6, display: 'block' }}>
                      TÊN HIỂN THỊ
                    </label>
                    <input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-base" 
                      placeholder="Nhập tên mới..."
                    />
                  </div>

                  <div style={{ padding: '16px 0', borderTop: '1px solid rgba(254,205,211,0.3)' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.rose900, marginBottom: 12 }}>
                      Đổi mật khẩu
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input 
                        type="password"
                        value={passwords.oldPassword}
                        onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                        className="input-base" 
                        placeholder="Mật khẩu hiện tại"
                      />
                      <input 
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        className="input-base" 
                        placeholder="Mật khẩu mới"
                      />
                      <input 
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        className="input-base" 
                        placeholder="Xác nhận mật khẩu mới"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary" 
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Hủy
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={loading}
                      className="btn-primary" 
                      style={{ flex: 2, justifyContent: 'center' }}
                    >
                      {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Lưu thay đổi'}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* App Settings Section */}
            <section className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.rose900, marginBottom: 16, paddingLeft: 8 }}>
                Ứng dụng
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>notifications</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Thông báo</span>
                  </div>
                  <div style={{ width: 40, height: 20, borderRadius: 10, background: COLORS.primary, position: 'relative' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', right: 2, top: 2 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>dark_mode</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Chế độ tối</span>
                  </div>
                  <div style={{ width: 40, height: 20, borderRadius: 10, background: '#cbd5e1', position: 'relative' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', left: 2, top: 2 }} />
                  </div>
                </div>
              </div>
            </section>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="btn-secondary" 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                border: 'none', 
                background: 'rgba(244, 63, 94, 0.1)', 
                color: '#f43f5e',
                padding: '16px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
              Đăng xuất tài khoản
            </button>
            
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(25,29,25,0.4)', marginTop: 8 }}>
              Phiên bản 2.1.0 • SmartFridge
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

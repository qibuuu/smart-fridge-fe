import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { login as apiLogin, register as apiRegister } from '../api/auth';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { COLORS } from '../constants';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const { login, googleLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === 'register' && form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!'); return;
    }
    setLoading(true);
    try {
      if (tab === 'login') {
        const res = await apiLogin({ username: form.email, password: form.password });
        const { token, ...userData } = res.data;
        login(userData, token);
        toast.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        await apiRegister({ username: form.username, email: form.email, password: form.password });
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setTab('login');
        setForm({ email: form.email, username: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra!');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/google-login', {
        idToken: credentialResponse.credential
      });
      const { token, ...userData } = res.data;
      googleLogin(userData, token);
      toast.success('Đăng nhập Google thành công!');
      navigate('/');
    } catch (err) {
      toast.error('Đăng nhập Google thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #FFEFBA 0%, #FF9A9E 100%)' }}>
      {/* ── Left Hero Panel (hidden on mobile) ── */}
      <div className="login-hero" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(25,29,25,0.65) 0%, rgba(25,29,25,0.15) 50%, transparent 100%)' }} />
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(32px,5vw,80px)', color: 'white', height: '100%' }}>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Hương vị của sự tươi mới.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.9, maxWidth: 380 }}>
            Khám phá những công thức nấu ăn dành riêng cho bạn, quản lý tủ lạnh thông minh và nâng tầm bữa ăn mỗi ngày.
          </p>
        </div>
      </div>

      {/* ── Right: Auth Form ── */}
      <div style={{
        width: 'clamp(320px, 50%, 520px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 'clamp(24px,5vw,60px) clamp(20px,5vw,60px)',
        overflowY: 'auto',
      }}>
        <div style={{
          width: '100%', maxWidth: 400,
          background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.5)', borderRadius: 28,
          padding: 'clamp(24px,5vw,40px)',
          boxShadow: '0 20px 60px rgba(57,105,56,0.2)',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="material-symbols-outlined icon-fill" style={{
                fontSize: 28, background: 'linear-gradient(to right, #f43f5e, #fb923c)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>restaurant_menu</span>
              <span style={{
                fontSize: 24, fontWeight: 900,
                background: 'linear-gradient(to right, #f43f5e, #fb923c)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}>SmartFridge</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#881337' }}>
              {tab === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(25,29,25,0.6)', marginTop: 2 }}>
              {tab === 'login' ? 'Đăng nhập để tiếp tục.' : 'Điền thông tin để bắt đầu hành trình.'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div style={{ background: 'rgba(254,205,211,0.4)', borderRadius: 9999, padding: 4, display: 'flex', border: '1px solid rgba(254,205,211,0.5)' }}>
            {['login', 'register'].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '8px', borderRadius: 9999, border: 'none',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#f43f5e' : 'rgba(244,63,94,0.5)',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}>
                {t === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            ))}
          </div>

          {/* Google Login Section (Login tab only) */}
          {tab === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Đăng nhập Google thất bại')}
                    useOneTap
                    shape="pill"
                    theme="filled_blue"
                    text="signin_with"
                    width="100%"
                  />
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                 <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
                 <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.3)', fontWeight: 700 }}>HOẶC</span>
                 <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
               </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {tab === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#881337' }}>Tên người dùng</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#fda4af', fontSize: 20 }}>person</span>
                  <input name="username" value={form.username} onChange={handleChange} placeholder="username" required={tab === 'register'} className="input-base" style={{ paddingLeft: 40 }} />
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#881337' }}>
                {tab === 'login' ? 'Tên đăng nhập hoặc Email' : 'Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#fda4af', fontSize: 20 }}>mail</span>
                <input name="email" type={tab === 'register' ? 'email' : 'text'} value={form.email} onChange={handleChange}
                  placeholder={tab === 'login' ? 'username hoặc email' : 'chef@example.com'} required className="input-base" style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#881337' }}>Mật khẩu</label>
                {tab === 'login' && (
                  <button type="button" onClick={() => setShowForgotModal(true)} style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#fda4af', fontSize: 20 }}>lock</span>
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  placeholder="••••••••" required className="input-base" style={{ paddingLeft: 40, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#fda4af', display: 'flex',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>
            {tab === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#881337' }}>Xác nhận mật khẩu</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#fda4af', fontSize: 20 }}>lock</span>
                  <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
                    placeholder="••••••••" required={tab === 'register'} className="input-base" style={{ paddingLeft: 40 }} />
                </div>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <><div className="spinner-small" /> Đang xử lý...</>
              ) : (
                <>{tab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(25,29,25,0.6)' }}>
            Tiếp tục đồng nghĩa với việc bạn đồng ý với{' '}
            <a href="#" style={{ color: '#f43f5e', fontWeight: 600, textDecoration: 'none' }}>Điều khoản</a> &{' '}
            <a href="#" style={{ color: '#f43f5e', fontWeight: 600, textDecoration: 'none' }}>Quyền riêng tư</a> của chúng tôi.
          </p>
        </div>
      </div>

      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}

      <style>{`
        @media (max-width: 640px) {
          .login-hero { display: none !important; }
          [style*="width: clamp(320px"] {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        .spinner-small {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

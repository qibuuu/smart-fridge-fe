import { useState } from 'react';
import apiClient from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { COLORS } from '../constants';

export default function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      toast.success('Mã OTP đã được gửi về email của bạn!');
      setStep(2);
    } catch (err) {
      toast.error('Không tìm thấy tài khoản với email này.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { otp, newPassword });
      toast.success('Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.');
      onClose();
    } catch (err) {
      toast.error('Mã OTP không hợp lệ hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(25,29,25,0.4)', backdropFilter: 'blur(4px)' }} />
      <div className="glass-card animate-zoomIn" style={{ position: 'relative', width: '100%', maxWidth: 400, padding: 32 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)' }}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.rose900, marginBottom: 8, textAlign: 'center' }}>
          Quên mật khẩu?
        </h2>
        <p style={{ color: 'rgba(25,29,25,0.6)', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
          {step === 1 ? 'Nhập email của bạn để nhận mã OTP khôi phục.' : 'Nhập mã OTP 6 số và mật khẩu mới của bạn.'}
        </p>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.rose900, display: 'block', marginBottom: 6 }}>Email đăng ký</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="input-base"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ height: 48, borderRadius: 12 }}>
              {loading ? <div className="spinner-small" /> : 'Gửi mã OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.rose900, display: 'block', marginBottom: 6 }}>Mã OTP (6 chữ số)</label>
              <input 
                type="text" 
                required 
                maxLength={6}
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="input-base"
                style={{ textAlign: 'center', letterSpacing: 4, fontSize: 20, fontWeight: 800 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.rose900, display: 'block', marginBottom: 6 }}>Mật khẩu mới</label>
              <input 
                type="password" 
                required 
                minLength={6}
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ height: 48, borderRadius: 12 }}>
              {loading ? <div className="spinner-small" /> : 'Đổi mật khẩu'}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: COLORS.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Quay lại
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

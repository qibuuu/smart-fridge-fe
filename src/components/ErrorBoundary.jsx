import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        background: 'linear-gradient(135deg, #FFEFBA 0%, #FF9A9E 100%)',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#fb7185' }}>error</span>
        <h2 style={{ color: '#881337', fontWeight: 700, margin: 0 }}>Ứng dụng gặp sự cố</h2>
        <p style={{ color: 'rgba(25,29,25,0.7)', margin: 0 }}>Vui lòng tải lại trang để tiếp tục.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Tải lại trang
        </button>
      </div>
    );
  }
}

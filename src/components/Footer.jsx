export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(242,245,238,0.6)',
      borderTop: '1px solid rgba(193,201,188,0.4)',
      borderRadius: '24px 24px 0 0',
      marginTop: 'auto',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        padding: 'clamp(24px,5vw,40px) var(--page-px)',
        maxWidth: 1440,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#c8ffc0',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #c1c9bc',
          }}>
            <img
              src="/logo_bg.png"
              alt="SmartFridge Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#396938' }}>SmartFridge</span>
        </div>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px,3vw,24px)', justifyContent: 'center' }}>
          {['About', 'Recipes', 'Privacy', 'Terms', 'Help'].map((item) => (
            <a key={item} href="#" style={{
              fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={(e) => e.target.style.color = '#396938'}
              onMouseLeave={(e) => e.target.style.color = '#64748b'}
            >
              {item}
            </a>
          ))}
        </nav>
        <div style={{ fontSize: 12, color: 'rgba(25,29,25,0.5)', fontWeight: 500 }}>
          © 2024 SmartFridge · Quản lý tủ lạnh thông minh.
        </div>
      </div>
    </footer>
  );
}

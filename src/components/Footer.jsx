export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(255,241,242,0.3)',
      borderTop: '1px solid rgba(252,205,211,0.4)',
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
        <div style={{ fontSize: 20, fontWeight: 700, color: '#f43f5e' }}>SmartFridge</div>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px,3vw,24px)', justifyContent: 'center' }}>
          {['About', 'Recipes', 'Privacy', 'Terms', 'Help'].map((item) => (
            <a key={item} href="#" style={{
              fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={(e) => e.target.style.color = '#f43f5e'}
              onMouseLeave={(e) => e.target.style.color = '#64748b'}
            >
              {item}
            </a>
          ))}
        </nav>
          © 2024 SmartFridge · Quản lý tủ lạnh thông minh.
      </div>
    </footer>
  );
}

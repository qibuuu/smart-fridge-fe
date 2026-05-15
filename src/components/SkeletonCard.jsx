import { COLORS } from '../constants';

export default function SkeletonCard() {
  return (
    <div 
      className="glass-card animate-pulse" 
      style={{ 
        overflow: 'hidden', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ 
        height: 200, 
        background: 'rgba(57,105,56,0.1)', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="shimmer-effect" />
      </div>
      <div style={{ padding: 16, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ 
          height: 20, 
          width: '80%', 
          background: 'rgba(57,105,56,0.08)', 
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="shimmer-effect" />
        </div>
        <div style={{ 
          height: 14, 
          width: '100%', 
          background: 'rgba(57,105,56,0.05)', 
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="shimmer-effect" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ 
            height: 12, 
            width: 60, 
            background: 'rgba(57,105,56,0.1)', 
            borderRadius: 99,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="shimmer-effect" />
          </div>
          <div style={{ 
            height: 12, 
            width: 40, 
            background: 'rgba(57,105,56,0.1)', 
            borderRadius: 99,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="shimmer-effect" />
          </div>
        </div>
      </div>
      <style>{`
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .7; }
        }
        .shimmer-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

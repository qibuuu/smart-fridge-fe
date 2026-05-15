import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resolveImageUrl } from '../utils/helpers';
import { COLORS } from '../constants';

export default function RecipeCard({ recipe, isFavorite, onFavoriteChange }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để lưu món ăn!');
      return;
    }
    try {
      await onFavoriteChange(recipe.id);
      toast.success(isFavorite ? 'Đã bỏ lưu món ăn' : 'Đã lưu món ăn!');
    } catch (err) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const imageUrl = resolveImageUrl(recipe.imageUrl);

  return (
    <article
      className="glass-card animate-fadeInUp"
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={recipe.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.7s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          onError={(e) => {
            e.target.src = resolveImageUrl(null);
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span
            className={`material-symbols-outlined ${isFavorite ? 'icon-fill' : ''}`}
            style={{
              fontSize: 20,
              color: isFavorite ? COLORS.primaryDark : '#fda4af',
            }}
          >
            favorite
          </span>
        </button>

        {/* Difficulty Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {recipe.difficulty}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexGrow: 1,
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: COLORS.rose900,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          {recipe.title}
        </h3>

        <p
          style={{
            fontSize: 13,
            color: 'rgba(25,29,25,0.65)',
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            flexGrow: 1,
          }}
        >
          {recipe.description || 'Khám phá công thức nấu ăn đặc sắc này...'}
        </p>

        {/* Meta Info */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 4,
            paddingTop: 12,
            borderTop: '1px solid rgba(254,205,211,0.3)',
            color: 'rgba(25,29,25,0.5)',
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              schedule
            </span>
            {recipe.cookingTime || recipe.prepTime || 0}p
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              local_fire_department
            </span>
            {recipe.calories || 0} kcal
          </div>
        </div>
      </div>
    </article>
  );
}

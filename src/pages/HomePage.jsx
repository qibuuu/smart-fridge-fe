import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import { useRecipes } from '../hooks/useRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { TAGS, DEFAULT_HERO_IMAGE } from '../constants';
import { resolveImageUrl } from '../utils/helpers';

export default function HomePage() {
  const navigate = useNavigate();
  const { recipes, loading } = useRecipes();
  const { isFavorite, toggle } = useFavorites();

  const trending = recipes.slice(0, 3);
  const quick = recipes
    .filter((r) => (r.cookingTime || r.prepTime) <= 30)
    .slice(0, 4);
  const quickFinal = quick.length > 0 ? quick : recipes.slice(3, 7);

  const heroRecipe = trending[0];
  const heroImage = resolveImageUrl(heroRecipe?.imageUrl, DEFAULT_HERO_IMAGE);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="page-container has-bottom-nav">
        {/* ── Hero ── */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: 'clamp(16px,4vw,32px)',
            overflow: 'hidden',
            minHeight: 'clamp(280px,50vw,500px)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: 'clamp(20px,4vw,48px)',
            boxShadow: '0 4px 12px rgba(57,105,56,0.1)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${heroImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(25,29,25,0.7) 0%, rgba(25,29,25,0.15) 55%, transparent 100%)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: 640,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <span
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '4px 14px',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'inline-block',
                width: 'fit-content',
              }}
            >
              Nổi bật trong mùa
            </span>
            <h1
              style={{
                fontSize: 'clamp(22px,5vw,40px)',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {heroRecipe?.title || 'Món ngon mỗi ngày'}
            </h1>
            <p
              style={{
                fontSize: 'clamp(14px,3vw,18px)',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.5,
              }}
            >
              {heroRecipe?.description ||
                'Khám phá hương vị tuyệt vời từ những nguyên liệu tươi ngon nhất.'}
            </p>
            <div style={{ paddingTop: 4 }}>
              <button
                onClick={() => heroRecipe && navigate(`/recipes/${heroRecipe.id}`)}
                className="btn-primary"
                style={{ fontSize: 13 }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  restaurant_menu
                </span>
                Xem công thức
              </button>
            </div>
          </div>
        </section>

        {/* ── Category Slider ── */}
        <section style={{ marginTop: 20 }}>
          <div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              paddingBottom: 15,
              scrollbarWidth: 'none',
            }}
          >
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/recipes?tag=${tag}`)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '12px 24px',
                  borderRadius: 9999,
                  border: 'none',
                  background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(8px)',
                  color: '#881337',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#fb7185')}
                onMouseLeave={(e) =>
                  (e.target.style.background = 'rgba(255,255,255,0.6)')
                }
              >
                {tag}
              </button>
            ))}
          </div>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        </section>

        {/* ── Trending Now ── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(22px,4vw,32px)',
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  letterSpacing: '-0.01em',
                }}
              >
                Xu hướng hiện nay
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(25,29,25,0.7)',
                  marginTop: 4,
                }}
              >
                Những món ăn được yêu thích nhất tuần này.
              </p>
            </div>
            <button
              onClick={() => navigate('/recipes')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                color: '#be123c',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              Xem tất cả{' '}
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                arrow_forward
              </span>
            </button>
          </div>

          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 'var(--card-gap)',
              }}
            >
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 'var(--card-gap)',
              }}
            >
              {trending[0] && (
                <div
                  className="glass-card"
                  style={{
                    overflow: 'hidden',
                    cursor: 'pointer',
                    gridColumn: 'span 1',
                  }}
                  onClick={() => navigate(`/recipes/${trending[0].id}`)}
                >
                  <div
                    style={{
                      position: 'relative',
                      height: 'clamp(200px,40vw,300px)',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={resolveImageUrl(trending[0].imageUrl)}
                      alt={trending[0].title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.7s',
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                      onError={(e) => {
                        e.target.src = resolveImageUrl(null);
                      }}
                    />
                  </div>
                  <div
                    style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: '#881337' }}>
                      {trending[0].title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: 'rgba(25,29,25,0.7)',
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {trending[0].description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: 14,
                        paddingTop: 10,
                        borderTop: '1px solid rgba(254,205,211,0.4)',
                        color: 'rgba(25,29,25,0.6)',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 14 }}
                        >
                          schedule
                        </span>{' '}
                        {trending[0].cookingTime || trending[0].prepTime || 0}p
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 14 }}
                        >
                          restaurant
                        </span>{' '}
                        {trending[0].difficulty}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}
              >
                {trending.slice(1, 3).map((r) => (
                  <div
                    key={r.id}
                    className="glass-card"
                    style={{
                      overflow: 'hidden',
                      display: 'flex',
                      cursor: 'pointer',
                      flex: 1,
                    }}
                    onClick={() => navigate(`/recipes/${r.id}`)}
                  >
                    <div style={{ width: 140, flexShrink: 0, overflow: 'hidden' }}>
                      <img
                        src={resolveImageUrl(r.imageUrl)}
                        alt={r.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = resolveImageUrl(null);
                        }}
                      />
                    </div>
                    <div
                      style={{
                        padding: '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        justifyContent: 'center',
                        flexGrow: 1,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: '#881337',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {r.title}
                      </h3>
                      {r.description && (
                        <p
                          style={{
                            fontSize: 13,
                            color: 'rgba(25,29,25,0.65)',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            margin: '2px 0 4px 0',
                          }}
                        >
                          {r.description}
                        </p>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          gap: 12,
                          color: 'rgba(25,29,25,0.6)',
                          fontSize: 12,
                          fontWeight: 700,
                          marginTop: 4,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 14 }}
                          >
                            schedule
                          </span>{' '}
                          {r.cookingTime || r.prepTime || 0}p
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 14 }}
                          >
                            restaurant
                          </span>{' '}
                          {r.difficulty}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Quick & Easy ── */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'clamp(16px,4vw,32px)',
            padding: 'clamp(16px,4vw,32px)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(22px,4vw,32px)',
                fontWeight: 700,
                color: '#881337',
                letterSpacing: '-0.01em',
              }}
            >
              Nhanh chóng & Dễ dàng
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(25,29,25,0.6)',
                marginTop: 4,
              }}
            >
              Những bữa ăn ngon miệng chỉ trong vòng 30 phút.
            </p>
          </div>

          {loading ? (
            <div className="grid-auto-4">
              {[1, 2, 3, 4].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : (
            <div className="grid-auto-4">
              {quickFinal.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  isFavorite={isFavorite(r.id)}
                  onFavoriteChange={() => toggle(r.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>


    </div>
  );
}

import { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import { useRecipes } from '../hooks/useRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { TAGS, DIFFICULTIES, SORT_OPTIONS, COLORS } from '../constants';

export default function AllRecipesPage() {
  const { recipes, loading, error, refetch } = useRecipes();
  const { isFavorite, toggle } = useFavorites();

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');
  const [filterOpen, setFilterOpen] = useState(false);

  const isFirstRender = useRef(true);

  // Real-time search with 400ms debounce
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setKeyword(searchInput);
      refetch(searchInput);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, refetch]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setKeyword(searchInput);
    refetch(searchInput);
  };

  const sorted = useMemo(() => {
    return [...recipes]
      .filter((r) => {
        const matchTag =
          selectedTag === 'Tất cả' || (r.tags && r.tags.includes(selectedTag));
        const matchDifficulty =
          !selectedDifficulty || r.difficulty === selectedDifficulty;
        return matchTag && matchDifficulty;
      })
      .sort((a, b) => {
        if (sortBy === 'Newest') return b.id - a.id;
        if (sortBy === 'Top Rated') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [recipes, selectedTag, selectedDifficulty, sortBy]);

  const showSkeletons = loading && recipes.length === 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main
        className="page-container has-bottom-nav"
        style={{ gap: 'var(--section-gap)' }}
      >
        {/* ── Search Hero ── */}
        <section
          style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto', width: '100%' }}
        >
          <h1
            style={{
              fontSize: 'clamp(24px,5vw,40px)',
              fontWeight: 700,
              color: COLORS.rose900,
              marginBottom: 10,
              letterSpacing: '-0.02em',
            }}
          >
            Bạn đang thèm món gì?
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px,3vw,18px)',
              color: 'rgba(25,29,25,0.7)',
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            Khám phá hàng ngàn công thức nấu ăn ngon miệng.
          </p>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <span
              className="material-symbols-outlined"
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#fda4af',
                fontSize: 22,
                zIndex: 1,
              }}
            >
              search
            </span>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm tên món, nguyên liệu..."
              className="input-base"
              style={{
                paddingLeft: 50,
                paddingRight: 56,
                paddingTop: 14,
                paddingBottom: 14,
                borderRadius: 9999,
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: COLORS.primary,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                arrow_forward
              </span>
            </button>
          </form>
        </section>

        {/* ── Horizontal Tag Slider ── */}
        <section>
          <div
            style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              paddingBottom: 10,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '10px 24px',
                  borderRadius: 9999,
                  border: 'none',
                  background: selectedTag === tag ? COLORS.primary : 'rgba(255,255,255,0.6)',
                  color: selectedTag === tag ? 'white' : COLORS.rose900,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow:
                    selectedTag === tag
                      ? '0 4px 12px rgba(251,113,133,0.3)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>
        </section>

        {/* ── Recipes ── */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(20px,4vw,30px)',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {keyword ? `Kết quả cho "${keyword}"` : 'Công thức nổi bật'}
            </h2>
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setFilterOpen((o) => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 9999,
                  background: filterOpen ? COLORS.primary : 'rgba(255,255,255,0.4)',
                  color: filterOpen ? 'white' : COLORS.rose900,
                  border: '1px solid rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(8px)',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  tune
                </span>
                {selectedDifficulty || 'Độ khó'}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  color: COLORS.rose900,
                  padding: '8px 14px',
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filterOpen && (
            <div
              className="glass-card animate-slideDown"
              style={{
                padding: '16px 20px',
                marginBottom: 16,
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'rgba(25,29,25,0.7)',
                  marginRight: 4,
                }}
              >
                Độ khó:
              </span>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(selectedDifficulty === d ? '' : d)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedDifficulty === d ? COLORS.primary : 'rgba(255,255,255,0.6)',
                    color: selectedDifficulty === d ? 'white' : COLORS.rose900,
                    fontWeight: 700,
                    fontSize: 13,
                    transition: 'all 0.2s',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  {d}
                </button>
              ))}
              {selectedDifficulty && (
                <button
                  onClick={() => setSelectedDifficulty('')}
                  style={{
                    marginLeft: 'auto',
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.primary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
          )}

          {showSkeletons ? (
            <div className="grid-auto-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: 'center',
                padding: 60,
                color: 'rgba(25,29,25,0.6)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 64, color: '#fecdd3' }}
              >
                wifi_off
              </span>
              <p style={{ fontSize: 16, marginTop: 12, fontWeight: 600 }}>
                Không thể tải công thức. Vui lòng kiểm tra kết nối và thử lại.
              </p>
              <button
                onClick={() => refetch()}
                style={{
                  marginTop: 16,
                  padding: '10px 24px',
                  borderRadius: 9999,
                  background: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                Thử lại
              </button>
            </div>
          ) : sorted.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 60,
                color: 'rgba(25,29,25,0.6)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 64, color: '#fecdd3' }}
              >
                search_off
              </span>
              <p style={{ fontSize: 16, marginTop: 12, fontWeight: 600 }}>
                Không tìm thấy công thức nào.
              </p>
            </div>
          ) : (
            <div className="grid-auto-3">
              {sorted.map((r) => (
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

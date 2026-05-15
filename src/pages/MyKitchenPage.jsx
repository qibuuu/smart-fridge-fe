import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SkeletonCard from '../components/SkeletonCard';

import { useRecipes } from '../hooks/useRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../context/ToastContext';
import { COLORS, TAGS, DIFFICULTIES } from '../constants';
import { removeAccents } from '../utils/helpers';

export default function MyKitchenPage() {
  const [tab, setTab] = useState('favorites');
  const [favRecipes, setFavRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const navigate = useNavigate();
  const toast = useToast();

  const { list, listMyRecipes, remove: deleteRecipe } = useRecipes();
  const { items: favIds, toggle: toggleFav } = useFavorites();

  const loadData = async () => {
    setLoading(true);
    try {
      const [myRes, allRes] = await Promise.all([listMyRecipes(), list()]);
      const all = allRes.data || [];
      setFavRecipes(all.filter((r) => favIds.includes(r.id)));
      setMyRecipes(myRes.data || []);
    } catch {
      toast.error('Không thể tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [favIds]);

  const handleFavChange = async (id) => {
    try {
      await toggleFav(id);
      toast.success('Đã cập nhật yêu thích');
    } catch {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleDeleteMyRecipe = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa công thức này?')) return;
    try {
      await deleteRecipe(id);
      setMyRecipes((prev) => prev.filter((r) => r.id !== id));
      toast.success('Đã xóa công thức!');
    } catch {
      toast.error('Không thể xóa!');
    }
  };

  const filteredRecipes = (tab === 'favorites' ? favRecipes : myRecipes).filter((r) => {
    const title = removeAccents(r.title?.toLowerCase() || '');
    const desc = removeAccents(r.description?.toLowerCase() || '');
    const query = removeAccents(searchInput.toLowerCase());
    
    const matchSearch = title.includes(query) || desc.includes(query);
    const matchTag = selectedTag === 'Tất cả' || (r.tags && r.tags.includes(selectedTag));
    return matchSearch && matchTag;
  });

  const displayRecipes = filteredRecipes;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="page-container has-bottom-nav">
        {/* ── Header ── */}
        <header style={{ marginBottom: 32, position: 'relative' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 800, color: COLORS.rose900, letterSpacing: '-0.02em', marginBottom: 4 }}>
              Bếp của tôi
            </h1>
            <p style={{ color: 'rgba(25,29,25,0.6)', fontWeight: 600 }}>
              Không gian ẩm thực cá nhân của bạn.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/settings')}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'rgba(255,255,255,0.6)',
              border: 'none',
              width: 44,
              height: 44,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: COLORS.rose900,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </header>

        {/* ── Search & Filter ── */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ position: 'relative', maxWidth: 600, marginBottom: 20 }}>
            <span className="material-symbols-outlined" style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              color: '#fda4af', fontSize: 22, zIndex: 1
            }}>search</span>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm món trong bếp của bạn..."
              className="input-base"
              style={{
                paddingLeft: 50, borderRadius: 9999,
                background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.4)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  whiteSpace: 'nowrap', padding: '8px 20px', borderRadius: 9999, border: 'none',
                  background: selectedTag === tag ? COLORS.primary : 'rgba(255,255,255,0.5)',
                  color: selectedTag === tag ? 'white' : COLORS.rose900,
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: selectedTag === tag ? '0 4px 12px rgba(57,105,56,0.2)' : '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Stats + Tab row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', borderRadius: 9999, padding: '8px 18px', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: 18, color: '#f43f5e' }}>favorite</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.rose900 }}>{favRecipes.length} Đã lưu</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', borderRadius: 9999, padding: '8px 18px', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: 18, color: '#fb923c' }}>restaurant_menu</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.rose900 }}>{myRecipes.length} Đã tạo</span>
            </div>
          </div>

          {/* Tab toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)', borderRadius: 9999, padding: 4, border: '1px solid rgba(255,255,255,0.4)', marginLeft: 'auto', gap: 4 }}>
            {[{ key: 'favorites', label: 'Yêu thích' }, { key: 'creations', label: 'Món đã tạo' }].map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSelectedTag('Tất cả'); }}
                style={{
                  padding: '8px 20px',
                  borderRadius: 9999,
                  border: 'none',
                  background: tab === t.key ? 'white' : 'transparent',
                  color: tab === t.key ? COLORS.rose900 : 'rgba(25,29,25,0.5)',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: tab === t.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Create recipe button when tab is creations */}
          {tab === 'creations' && (
            <button
              onClick={() => navigate('/add-recipe')}
              className="btn-primary animate-fadeIn"
              style={{
                borderRadius: 9999,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 12px rgba(57,105,56,0.2)',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              Tạo món mới
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid-auto-4">
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <div className={displayRecipes.length > 0 ? "grid-auto-4" : ""}>
            {displayRecipes.length > 0 ? (
              displayRecipes.map((recipe) => (
                <div key={recipe.id} style={{ position: 'relative' }}>
                  {/* Reuse RecipeCard logic or similar */}
                  <div 
                    className="glass-card animate-fadeInUp"
                    style={{ overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                  >
                    <div style={{ height: 160, overflow: 'hidden' }}>
                      <img 
                        src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800'} 
                        alt={recipe.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: 16 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.rose900, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                        {recipe.title}
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(25,29,25,0.4)', textTransform: 'uppercase' }}>
                          {recipe.difficulty}
                        </span>
                        {tab === 'creations' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/edit-recipe/${recipe.id}`); }}
                              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteMyRecipe(recipe.id); }}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                            </button>
                          </div>
                        )}
                        {tab === 'favorites' && (
                           <button 
                            onClick={(e) => { e.stopPropagation(); handleFavChange(recipe.id); }}
                            style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                           >
                            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 20 }}>favorite</span>
                           </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(251,113,133,0.3)' }}>
                  {tab === 'favorites' ? 'heart_broken' : 'no_meals'}
                </span>
                <p style={{ color: 'rgba(25,29,25,0.5)', fontWeight: 600 }}>
                  {tab === 'favorites' ? 'Bạn chưa lưu món ăn nào.' : 'Bạn chưa tạo món ăn nào.'}
                </p>
                <button 
                  onClick={() => navigate(tab === 'favorites' ? '/recipes' : '/add-recipe')}
                  className="btn-primary"
                >
                  {tab === 'favorites' ? 'Khám phá ngay' : 'Tạo món ngay'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { useFridge } from '../hooks/useFridge';
import { useToast } from '../context/ToastContext';
import { resolveImageUrl } from '../utils/helpers';
import { COLORS } from '../constants';
import apiClient from '../api/apiClient';

const INGREDIENT_ICONS = [
  'eco',
  'grocery',
  'egg_alt',
  'set_meal',
  'water_drop',
  'nutrition',
  'cake',
  'kebab_dining',
];
const randomIcon = (name) =>
  INGREDIENT_ICONS[(name?.charCodeAt(0) || 0) % INGREDIENT_ICONS.length];

export default function SmartFridgePage() {
  const { items: fridgeItems, loading, add, remove, clearAll, suggest } = useFridge();
  const [suggestions, setSuggestions] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [expiryInput, setExpiryInput] = useState('');
  const [suggesting, setSuggesting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Autocomplete suggestions state
  const [allIngredients, setAllIngredients] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    apiClient.get('/ingredients')
      .then(res => setAllIngredients(res.data || []))
      .catch(err => console.error('Error loading backend ingredients:', err));
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setNameInput(val);
    if (!val.trim()) {
      setFilteredSuggestions([]);
    } else {
      const filtered = allIngredients.filter((ing) =>
        ing.name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Top 8 suggestions
    }
  };

  const toast = useToast();
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !amountInput) return;
    setAdding(true);
    try {
      await add({
        ingredientName: nameInput.trim(),
        amount: parseFloat(amountInput),
        expiryDate: expiryInput || null,
      });
      setNameInput('');
      setAmountInput('');
      setExpiryInput('');
      toast.success(`Đã thêm "${nameInput}"!`);
    } catch {
      toast.error('Không thể thêm!');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
    } catch {
      toast.error('Không thể xóa!');
    }
  };

  const handleClearAll = async () => {
    if (fridgeItems.length === 0) {
      toast.info('Tủ lạnh đã trống rồi!');
      return;
    }
    
    toast.info('Đang dọn dẹp tủ lạnh...');
    setClearing(true);
    try {
      await clearAll();
      toast.success('Đã dọn sạch tủ lạnh!');
      setSuggestions([]); 
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi dọn tủ!');
    } finally {
      setClearing(false);
    }
  };

  const handleSuggest = async () => {
    setSuggesting(true);
    setSuggestions([]);
    try {
      const res = await suggest();
      setSuggestions(res.data || []);
      if (!res.data?.length) toast.info('Không tìm thấy công thức phù hợp!');
    } catch {
      toast.error('Không thể gợi ý!');
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main
        className="page-container has-bottom-nav"
        style={{ gap: 'var(--section-gap)' }}
      >
        {/* ── Fridge Input Panel ── */}
        <section className="glass-card" style={{ padding: 'clamp(20px,5vw,48px)' }}>
          <h1
            style={{
              fontSize: 'clamp(22px,5vw,36px)',
              fontWeight: 700,
              color: COLORS.rose900,
              letterSpacing: '-0.02em',
              marginBottom: 6,
            }}
          >
            Tủ lạnh thông minh
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(25,29,25,0.7)',
              lineHeight: 1.5,
              marginBottom: 24,
            }}
          >
            Nhập những gì bạn có, AI sẽ tìm món ăn phù hợp nhất.
          </p>

          {/* Input Form */}
          <form
            onSubmit={handleAdd}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}
          >
            <div style={{ position: 'relative', flex: '2 1 200px' }}>
              <input
                value={nameInput}
                onChange={handleNameChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => {
                  // Small delay to allow onMouseDown to fire
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                placeholder="Tên nguyên liệu (VD: Thịt gà...)"
                className="input-base"
                style={{ width: '100%' }}
              />
              {showDropdown && filteredSuggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    marginTop: 6,
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    maxHeight: 250,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {filteredSuggestions.map((ing) => (
                    <div
                      key={ing.id}
                      onMouseDown={() => {
                        setNameInput(ing.name);
                        setShowDropdown(false);
                      }}
                      style={{
                        padding: '12px 16px',
                        fontSize: 14,
                        fontWeight: 500,
                        color: 'rgba(25, 29, 25, 0.85)',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.02)',
                        transition: 'background 0.2s',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(57, 105, 56, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      {ing.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              value={amountInput}
              type="number"
              step="0.1"
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="SL"
              className="input-base"
              style={{ flex: '1 1 80px' }}
            />
            <input
              value={expiryInput}
              type="date"
              onChange={(e) => setExpiryInput(e.target.value)}
              className="input-base"
              style={{ flex: '1 1 150px' }}
            />
            <button
              type="submit"
              disabled={adding}
              className="btn-primary"
              style={{
                padding: '12px 20px',
                opacity: adding ? 0.7 : 1,
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                add
              </span>
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'rgba(25,29,25,0.6)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Đang có trong tủ ({fridgeItems.length})
            </p>

            {fridgeItems.length > 0 && (
              <button 
                onClick={handleClearAll}
                disabled={clearing}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f43f5e',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  opacity: clearing ? 0.5 : 1
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete_sweep</span>
                Dọn tủ lạnh
              </button>
            )}
          </div>

          {/* Chips */}
          {loading ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 100,
                    height: 36,
                    borderRadius: 9999,
                    background: 'rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>
          ) : fridgeItems.length === 0 ? (
            <p
              style={{
                color: 'rgba(25,29,25,0.5)',
                fontStyle: 'italic',
                fontSize: 14,
              }}
            >
              Tủ lạnh đang trống.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {fridgeItems.map((item) => (
                <div key={item.id} className="chip">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 14, color: COLORS.primary }}
                  >
                    {randomIcon(item.ingredientName)}
                  </span>
                  <span>
                    {item.ingredientName} ({item.amount})
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#fda4af',
                      display: 'flex',
                      padding: 2,
                      borderRadius: '50%',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Suggest Button */}
          {fridgeItems.length > 0 && (
            <button
              onClick={handleSuggest}
              disabled={suggesting}
              className="btn-primary"
              style={{ marginTop: 24, opacity: suggesting ? 0.7 : 1 }}
            >
              {suggesting ? (
                <>
                  <div
                    className="spinner"
                    style={{ width: 18, height: 18, borderWidth: 2 }}
                  />{' '}
                  Đang tìm...
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                  >
                    auto_awesome
                  </span>{' '}
                  Gợi ý món ngon
                </>
              )}
            </button>
          )}
        </section>

        {/* ── Suggestions ── */}
        {(suggestions.length > 0 || suggesting) && (
          <section>
            <h2
              style={{
                fontSize: 'clamp(20px,4vw,30px)',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.15)',
                marginBottom: 6,
              }}
            >
              Thực đơn dành riêng cho bạn
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(25,29,25,0.7)',
                marginBottom: 20,
              }}
            >
              Dựa trên những gì bạn đang có trong tủ lạnh.
            </p>

            {suggesting ? (
              <div
                style={{ display: 'flex', justifyContent: 'center', padding: 60 }}
              >
                <div className="spinner" style={{ width: 52, height: 52 }} />
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                  gap: 'var(--card-gap)',
                }}
              >
                {suggestions.map((r) => {
                  const isPerfect = r.matchPercentage >= 100;
                  return (
                    <article
                      key={r.recipeId}
                      className="glass-card"
                      style={{
                        overflow: 'hidden',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onClick={() => navigate(`/recipes/${r.recipeId}`)}
                    >
                      <div
                        style={{ position: 'relative', height: 180, overflow: 'hidden' }}
                      >
                        <img
                          src={resolveImageUrl(r.imageUrl)}
                          alt={r.title}
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
                        {isPerfect && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              background: COLORS.primary,
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: 9999,
                              fontSize: 11,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <span
                              className="material-symbols-outlined icon-fill"
                              style={{ fontSize: 13 }}
                            >
                              stars
                            </span>
                            Đủ nguyên liệu
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          flexGrow: 1,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: COLORS.rose900,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {r.title}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: r.matchPercentage >= 80 ? '#198754' : '#fb923c',
                            }}
                          >
                            Khớp {r.matchPercentage}%
                          </span>
                        </div>
                        <div style={{ background: '#e2e8f0', height: 4, borderRadius: 2 }}>
                          <div
                            style={{
                              background: r.matchPercentage >= 80 ? '#10b981' : '#f59e0b',
                              width: `${r.matchPercentage}%`,
                              height: '100%',
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        {r.missingIngredients?.length > 0 && (
                          <p style={{ fontSize: 11, color: COLORS.slate, lineHeight: 1.4 }}>
                            Thiếu:{' '}
                            <strong>{r.missingIngredients.slice(0, 3).join(', ')}</strong>
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>


    </div>
  );
}

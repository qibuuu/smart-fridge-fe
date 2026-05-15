import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { useRecipes } from '../hooks/useRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { resolveImageUrl, parseIngredient } from '../utils/helpers';
import { COLORS, DEFAULT_RECIPE_IMAGE } from '../constants';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { getById } = useRecipes();
  const { isFavorite, toggle } = useFavorites();
  const { add: addToCart } = useCart();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getById(id);
        setRecipe(res.data);
      } catch (err) {
        toast.error('Không tìm thấy công thức này.');
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFavorite = async () => {
    try {
      await toggle(Number(id));
      toast.success(
        isFavorite(Number(id)) ? 'Đã bỏ yêu thích' : 'Đã lưu công thức!'
      );
    } catch {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleAddToCart = async (ingString) => {
    setAddingToCart(true);
    try {
      const parsed = parseIngredient(ingString);
      await addToCart(parsed);
      toast.success(`Đã thêm "${parsed.ingredientName}" vào giỏ hàng!`);
    } catch {
      toast.error('Có lỗi khi thêm vào giỏ.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (!recipe?.ingredients?.length) {
      toast.info('Không có nguyên liệu nào!');
      return;
    }
    setAddingToCart(true);
    try {
      await Promise.all(
        recipe.ingredients.map((ingString) => addToCart(parseIngredient(ingString)))
      );
      toast.success('Đã thêm tất cả nguyên liệu vào giỏ hàng!');
    } catch {
      toast.error('Có lỗi khi thêm vào giỏ.');
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleIngredient = (idx) =>
    setCheckedIngredients((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="spinner" style={{ width: 56, height: 56 }} />
        </div>
      </div>
    );
  }
  if (!recipe) return null;

  const imageUrl = resolveImageUrl(recipe.imageUrl, DEFAULT_RECIPE_IMAGE);
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions
    ? typeof recipe.instructions === 'string'
      ? recipe.instructions.split('\n').filter(Boolean)
      : recipe.instructions
    : [];

  const metaItems = [
    {
      icon: 'schedule',
      label: 'Thời gian',
      value: recipe.totalTime
        ? `${recipe.totalTime}p`
        : recipe.prepTime
        ? `${recipe.prepTime}p`
        : recipe.cookingTime
        ? `${recipe.cookingTime}p`
        : 'N/A',
    },
    { icon: 'restaurant', label: 'Độ khó', value: recipe.difficulty || 'N/A' },
    {
      icon: 'local_fire_department',
      label: 'Năng lượng',
      value: recipe.calories ? `${recipe.calories} kcal` : 'N/A',
    },
    {
      icon: 'group',
      label: 'Khẩu phần',
      value: recipe.servings ? `${recipe.servings} người` : 'N/A',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main
        className="page-container has-bottom-nav"
        style={{ gap: 'var(--section-gap)' }}
      >
        {/* ── Hero ── */}
        <section>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(240px,50vw,512px)',
              borderRadius: 'clamp(16px,4vw,32px)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(57,105,56,0.1)',
            }}
          >
            <img
              src={imageUrl}
              alt={recipe.title || recipe.name}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.src = resolveImageUrl(null, DEFAULT_RECIPE_IMAGE);
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
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 'clamp(16px,4vw,40px)',
                color: 'white',
              }}
            >
              {recipe.rating && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '4px 12px',
                    borderRadius: 9999,
                    marginBottom: 10,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <span
                    className="material-symbols-outlined icon-fill"
                    style={{ fontSize: 14, color: '#fbbf24' }}
                  >
                    star
                  </span>
                  {recipe.rating}
                </div>
              )}
              <h1
                style={{
                  fontSize: 'clamp(20px,5vw,40px)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: 6,
                  letterSpacing: '-0.02em',
                }}
              >
                {recipe.title || recipe.name}
              </h1>
              {recipe.description && (
                <p
                  style={{
                    fontSize: 'clamp(13px,3vw,17px)',
                    lineHeight: 1.5,
                    opacity: 0.9,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {recipe.description}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="grid-sidebar-layout">
          {/* ── Left Column: Ingredients & Steps ── */}
          <div className="grid-sidebar-left">
            {/* ── Ingredients ── */}
            <section
              className="glass-card"
              style={{ padding: 'clamp(20px,4vw,32px)' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <h2
                  style={{
                    fontSize: 'clamp(20px,4vw,28px)',
                    fontWeight: 700,
                    color: COLORS.rose900,
                  }}
                >
                  Nguyên liệu
                </h2>
                {recipe.servings && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.primary,
                      background: 'rgba(57,105,56,0.12)',
                      padding: '6px 14px',
                      borderRadius: 9999,
                    }}
                  >
                    Dành cho {recipe.servings} người ăn
                  </span>
                )}
              </div>
              {ingredients.length === 0 ? (
                <p style={{ color: 'rgba(25,29,25,0.5)', fontStyle: 'italic' }}>
                  Chưa có danh sách nguyên liệu.
                </p>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
                    gap: 12,
                  }}
                >
                  {ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: checkedIngredients.includes(idx)
                          ? 'rgba(57,105,56,0.1)'
                          : 'rgba(255,255,255,0.8)',
                        border: `1px solid ${
                          checkedIngredients.includes(idx) ? COLORS.primary : 'rgba(193,201,188,0.5)'
                        }`,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        onClick={() => toggleIngredient(idx)}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          flexShrink: 0,
                          border: `2px solid ${
                            checkedIngredients.includes(idx) ? COLORS.primary : 'rgba(114,121,110,0.4)'
                          }`,
                          background: checkedIngredients.includes(idx)
                            ? COLORS.primary
                            : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                        }}
                      >
                        {checkedIngredients.includes(idx) && (
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 14, color: 'white' }}
                          >
                            check
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: COLORS.onSurface,
                            textDecoration: checkedIngredients.includes(idx)
                              ? 'line-through'
                              : 'none',
                            opacity: checkedIngredients.includes(idx) ? 0.5 : 1,
                          }}
                        >
                          {ing}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(ing)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: COLORS.primary,
                          display: 'flex',
                        }}
                        title="Thêm vào giỏ"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 20 }}
                        >
                          add_shopping_cart
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Instructions ── */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2
                style={{
                  fontSize: 'clamp(20px,4vw,28px)',
                  fontWeight: 700,
                  color: COLORS.rose900,
                  marginBottom: 4,
                }}
              >
                Các bước thực hiện
              </h2>
              {instructions.length === 0 ? (
                <p style={{ color: COLORS.onSurfaceVariant, fontStyle: 'italic' }}>
                  Chưa có hướng dẫn thực hiện.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {instructions.map((step, idx) => (
                    <div
                      key={idx}
                      className="glass-card"
                      style={{ padding: 'clamp(16px,3vw,24px)', display: 'flex', gap: 16 }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: idx === 0 ? COLORS.primary : 'rgba(255,255,255,0.8)',
                          color: idx === 0 ? 'white' : COLORS.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          fontWeight: 700,
                          border: `3px solid ${idx === 0 ? COLORS.primaryLight : 'rgba(193,201,188,0.5)'}`,
                          boxShadow:
                            idx === 0 ? '0 4px 12px rgba(57,105,56,0.2)' : 'none',
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div style={{ paddingTop: 4, flex: 1 }}>
                        {typeof step === 'object' ? (
                          <>
                            <h3
                              style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: COLORS.rose900,
                                marginBottom: 6,
                              }}
                            >
                              {step.title || `Bước ${idx + 1}`}
                            </h3>
                            <p
                              style={{
                                fontSize: 14,
                                lineHeight: 1.7,
                                color: COLORS.onSurfaceVariant,
                              }}
                            >
                              {step.description || step}
                            </p>
                          </>
                        ) : (
                          <p
                            style={{
                              fontSize: 14,
                              lineHeight: 1.7,
                              color: COLORS.onSurfaceVariant,
                            }}
                          >
                            {step}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Right Column: Sidebar ── */}
          <div className="grid-sidebar-right">
            {/* Metadata Card */}
            <div
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.rose900 }}>
                Thông tin công thức
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {metaItems.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      paddingBottom: 14,
                      borderBottom: '1px solid rgba(193,201,188,0.5)',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'rgba(57,105,56,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: COLORS.primary,
                        flexShrink: 0,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: COLORS.onSurfaceVariant,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: 2,
                        }}
                      >
                        {item.label}
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.onSurface }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={handleAddAllToCart}
                disabled={addingToCart}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px 20px',
                  opacity: addingToCart ? 0.7 : 1,
                  fontSize: 14,
                }}
              >
                <span
                  className="material-symbols-outlined icon-fill"
                  style={{ fontSize: 20 }}
                >
                  shopping_cart_checkout
                </span>
                {addingToCart ? 'Đang thêm...' : 'Thêm tất cả vào giỏ'}
              </button>
              <button
                onClick={handleFavorite}
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px 20px',
                  fontSize: 14,
                }}
              >
                <span
                  className={`material-symbols-outlined ${
                    isFavorite(Number(id)) ? 'icon-fill' : ''
                  }`}
                  style={{ color: COLORS.primary, fontSize: 20 }}
                >
                  favorite
                </span>
                {isFavorite(Number(id)) ? 'Đã lưu công thức' : 'Lưu vào yêu thích'}
              </button>
            </div>
          </div>
        </div>

      </main>


    </div>
  );
}

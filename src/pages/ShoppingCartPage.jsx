import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

import { useCart } from '../hooks/useCart';
import { useFridge } from '../hooks/useFridge';
import apiClient from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { UNITS, COLORS } from '../constants';

export default function ShoppingCartPage() {
  const { items, loading, add, toggle, clearBought } = useCart();
  const { add: addToFridge } = useFridge();
  const [nameInput, setNameInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [unitInput, setUnitInput] = useState('g');
  const [noteInput, setNoteInput] = useState('');
  const toast = useToast();

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

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !amountInput) return;
    try {
      await add({
        ingredientName: nameInput.trim(),
        amount: parseFloat(amountInput),
        unit: unitInput,
        note: noteInput.trim(),
      });
      setNameInput('');
      setAmountInput('');
      setNoteInput('');
      toast.success(`Đã thêm ${nameInput}`);
    } catch {
      toast.error('Không thể thêm!');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggle(id);
    } catch {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleSelectAll = async () => {
    const allChecked = items.length > 0 && items.every(i => i.bought);
    try {
      const targets = items.filter(i => i.bought === allChecked);
      await Promise.all(targets.map(i => toggle(i.id)));
    } catch {
      toast.error('Không thể cập nhật tất cả!');
    }
  };

  const handleAddToFridgeAndClear = async () => {
    const purchasedItems = items.filter((i) => i.bought);
    if (purchasedItems.length === 0) {
      toast.info('Hãy tick chọn các món đã mua trước!');
      return;
    }

    toast.info('Đang xử lý...');

    try {
      // Add all purchased items to the fridge
      for (const item of purchasedItems) {
        await addToFridge({
          ingredientName: item.ingredientName,
          amount: item.amount,
        });
      }

      toast.success(`Đã thêm ${purchasedItems.length} món vào tủ lạnh!`);
      await clearBought();
      toast.success('Đã dọn dẹp giỏ hàng!');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi thêm vào tủ lạnh!');
    }
  };

  const total = items.length;
  const bought = items.filter((i) => i.bought).length;
  const progress = total === 0 ? 0 : Math.round((bought / total) * 100);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main
        className="page-container has-bottom-nav"
        style={{ gap: 'var(--section-gap)' }}
      >
        {/* ── Header ── */}
        <section className="glass-card" style={{ padding: 'clamp(20px,5vw,48px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 'clamp(24px,5vw,36px)',
                fontWeight: 700,
                color: COLORS.rose900,
                marginBottom: 6,
              }}
            >
              Giỏ đi chợ
            </h1>
            <p style={{ fontSize: 14, color: COLORS.primary, fontWeight: 700 }}>
              Mua sắm đầy đủ để nấu món ngon nhé!
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleAdd}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}
          >
            <div style={{ position: 'relative', flex: '3 1 200px' }}>
              <input
                value={nameInput}
                onChange={handleNameChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => {
                  // Small delay to allow onMouseDown to fire
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                placeholder="Cần mua gì? (VD: Cà chua...)"
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
              style={{ flex: '1 1 70px' }}
            />
            <select
              value={unitInput}
              onChange={(e) => setUnitInput(e.target.value)}
              className="input-base"
              style={{ flex: '1 1 100px', cursor: 'pointer' }}
            >
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <input
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Ghi chú thêm..."
              className="input-base"
              style={{ flex: '1 1 100%' }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '12px 20px', width: '100%', marginTop: 8 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                add_shopping_cart
              </span>{' '}
              Thêm vào giỏ
            </button>
          </form>

          {/* Progress */}
          {total > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <span style={{ color: 'rgba(25,29,25,0.6)' }}>
                  Đã mua {bought}/{total}
                </span>
                <span style={{ color: COLORS.primary }}>{progress}%</span>
              </div>
              <div
                style={{
                  height: 10,
                  background: 'rgba(254,228,230,0.5)',
                  borderRadius: 9999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                    width: `${progress}%`,
                    transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              </div>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <div className="spinner" />
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 64, color: '#fecdd3' }}
              >
                shopping_basket
              </span>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'rgba(25,29,25,0.5)',
                  marginTop: 12,
                }}
              >
                Giỏ hàng đang trống.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Select All Toggle */}
              <div 
                onClick={handleSelectAll}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 10, 
                  padding: '8px 18px', 
                  cursor: 'pointer',
                  width: 'fit-content',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  marginBottom: 8
                }}
              >
                <div style={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: 6, 
                  border: `2px solid ${items.every(i => i.bought) ? COLORS.primary : '#fecdd3'}`,
                  background: items.every(i => i.bought) ? COLORS.primary : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {items.every(i => i.bought) && <span className="material-symbols-outlined" style={{ fontSize: 14, fontWeight: 900 }}>check</span>}
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.rose900 }}>Chọn tất cả</span>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className={`glass-card ${item.bought ? 'purchased' : ''}`}
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: item.bought ? 0.6 : 1,
                    background: item.bought
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(255,255,255,0.6)',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: `2px solid ${item.bought ? COLORS.primary : '#fecdd3'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: item.bought ? COLORS.primary : 'transparent',
                      color: 'white',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    {item.bought && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16, fontWeight: 900 }}
                      >
                        check
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: COLORS.rose900,
                        textDecoration: item.bought ? 'line-through' : 'none',
                      }}
                    >
                      {item.ingredientName}
                    </p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary }}>
                        {item.amount} {item.unit}
                      </p>
                      {item.note && (
                        <p style={{ fontSize: 11, color: COLORS.slate, fontStyle: 'italic' }}>
                          • {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {bought > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToFridgeAndClear();
                  }}
                  className="btn-secondary"
                  style={{
                    marginTop: 20,
                    alignSelf: 'center',
                    border: `1px dashed ${COLORS.primary}`,
                    color: COLORS.primary,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    kitchen
                  </span>
                  Thêm vào tủ lạnh
                </button>
              )}
            </div>
          )}
        </section>
      </main>


    </div>
  );
}

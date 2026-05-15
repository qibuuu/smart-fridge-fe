import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { useMealPlan } from '../hooks/useMealPlan';
import { useRecipes } from '../hooks/useRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../context/ToastContext';
import { COLORS } from '../constants';
import { resolveImageUrl, removeAccents } from '../utils/helpers';

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const MEAL_TYPES = [
  { id: 'Breakfast', label: 'Bữa sáng', icon: 'wb_sunny' },
  { id: 'Lunch', label: 'Bữa trưa', icon: 'lunch_dining' },
  { id: 'Dinner', label: 'Bữa tối', icon: 'bedtime' }
];

export default function MealPlannerPage() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null); // { day, type }
  const [selectionTab, setSelectionTab] = useState('favorites');
  const [favRecipes, setFavRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectionSearch, setSelectionSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);

  const { getMyPlans, addPlan, removePlan, exportToCart, loading: loadingPlans } = useMealPlan();
  const { list, listMyRecipes } = useRecipes();
  const { items: favIds } = useFavorites();
  const toast = useToast();

  const loadPlans = useCallback(async () => {
    try {
      const data = await getMyPlans();
      setPlans(data || []);
    } catch (err) {
      toast.error('Không thể tải thực đơn!');
    }
  }, [getMyPlans, toast]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const loadRecipes = async () => {
    setLoadingData(true);
    try {
      const [allRes, myRes] = await Promise.all([list(), listMyRecipes()]);
      const all = allRes.data || [];
      setFavRecipes(all.filter(r => favIds.includes(r.id)));
      setMyRecipes(myRes.data || []);
    } catch (err) {
      toast.error('Không thể tải danh sách món ăn!');
    } finally {
      setLoadingData(false);
    }
  };

  const handleOpenAdd = (day, type) => {
    setActiveSlot({ day, type });
    setSelectionSearch('');
    setIsModalOpen(true);
    loadRecipes();
  };

  const handleSelectRecipe = async (recipeId) => {
    if (!activeSlot) return;
    try {
      await addPlan(recipeId, activeSlot.day, activeSlot.type);
      toast.success('Đã thêm món vào thực đơn!');
      setIsModalOpen(false);
      loadPlans();
    } catch (err) {
      toast.error('Không thể thêm món!');
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      await removePlan(id);
      toast.success('Đã xóa món khỏi thực đơn!');
      loadPlans();
    } catch (err) {
      toast.error('Không thể xóa!');
    }
  };

  const handleExport = async () => {
    if (plans.length === 0) {
      toast.info('Thực đơn đang trống!');
      return;
    }
    try {
      await exportToCart();
      toast.success('Đã xuất toàn bộ nguyên liệu vào giỏ hàng!');
    } catch (err) {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const getPlansInSlot = (day, type) => {
    return (plans || []).filter(p => p.dayOfWeek === day && p.mealType === type);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="page-container has-bottom-nav">
        {/* Header Section */}
        <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 800, color: COLORS.rose900, letterSpacing: '-0.02em', marginBottom: 4 }}>
              Thực đơn tuần
            </h1>
            <p style={{ color: 'rgba(25,29,25,0.6)', fontWeight: 700 }}>
              Lên kế hoạch bữa ăn và chuẩn bị giỏ hàng.
            </p>
          </div>
          
          <button 
            onClick={handleExport}
            className="btn-primary"
            style={{ 
              borderRadius: 14, 
              padding: '12px 24px', 
              boxShadow: '0 8px 24px rgba(244,63,94,0.3)',
              gap: 8,
              fontSize: 14
            }}
          >
            <span className="material-symbols-outlined">shopping_cart_checkout</span>
            Xuất ra giỏ đi chợ
          </button>
        </header>

        {/* Day Selector (Tag-like Buttons) */}
        <section style={{ marginBottom: 32, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 9999,
                  border: '1px solid rgba(255,255,255,0.4)',
                  background: selectedDay === day ? 'white' : 'rgba(255,255,255,0.4)',
                  color: COLORS.rose900,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedDay === day ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </section>

        {/* Daily View: Meal Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {MEAL_TYPES.map(type => {
            const slotPlans = getPlansInSlot(selectedDay, type.id);
            return (
              <div key={type.id} className="glass-card animate-fadeInUp" style={{ padding: 24, borderRadius: 24, background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{type.icon}</span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.rose900 }}>{type.label}</h3>
                      <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 700 }}>{selectedDay}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenAdd(selectedDay, type.id)}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: 13, borderRadius: 10, background: '#f43f5e', color: 'white' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> Thêm món
                  </button>
                </div>

                {slotPlans.length > 0 ? (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                    gap: 16,
                    justifyContent: 'center'
                  }}>
                    {slotPlans.map(plan => (
                      <div 
                        key={plan.id} 
                        className="animate-fadeIn" 
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 10, 
                          alignItems: 'center', 
                          background: 'rgba(255,255,255,0.5)', 
                          padding: '10px', 
                          borderRadius: 20, 
                          border: '1px solid rgba(255,255,255,0.8)',
                          position: 'relative',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                          <img src={resolveImageUrl(plan.recipeImageUrl)} alt={plan.recipeTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <h4 style={{ 
                          fontSize: 13, 
                          fontWeight: 800, 
                          color: COLORS.rose900, 
                          margin: 0,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '32px'
                        }}>
                          {plan.recipeTitle}
                        </h4>
                        <button 
                          onClick={() => handleDeletePlan(plan.id)}
                          style={{ 
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: '#fff', 
                            border: '1px solid rgba(244,63,94,0.2)', 
                            color: '#f43f5e', 
                            width: 28, 
                            height: 28, 
                            borderRadius: '50%', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(244,63,94,0.2)'
                          }}
                          title="Xóa món"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ height: 100, borderRadius: 16, border: '2px dashed rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.2)', fontWeight: 600, fontSize: 14 }}>
                    Chưa lên kế hoạch cho {type.label.toLowerCase()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selection Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(25,29,25,0.4)', backdropFilter: 'blur(4px)' }} />
            <div className="glass-card animate-zoomIn" style={{ position: 'relative', width: '100%', maxWidth: 500, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
              <div style={{ padding: 20, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 800, color: COLORS.rose900 }}>Chọn món cho {activeSlot?.day}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)' }}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.02)', padding: 4 }}>
                <button 
                  onClick={() => setSelectionTab('favorites')}
                  style={{ flex: 1, padding: '12px', border: 'none', background: selectionTab === 'favorites' ? 'white' : 'transparent', fontWeight: 700, borderRadius: 8, color: selectionTab === 'favorites' ? COLORS.primary : 'rgba(0,0,0,0.4)' }}
                >Yêu thích</button>
                <button 
                  onClick={() => setSelectionTab('my')}
                  style={{ flex: 1, padding: '12px', border: 'none', background: selectionTab === 'my' ? 'white' : 'transparent', fontWeight: 700, borderRadius: 8, color: selectionTab === 'my' ? COLORS.primary : 'rgba(0,0,0,0.4)' }}
                >Món đã tạo</button>
              </div>

              <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.3)', fontSize: 18 }}>search</span>
                  <input 
                    type="text" 
                    placeholder="Tìm tên món ăn..."
                    value={selectionSearch}
                    onChange={(e) => setSelectionSearch(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px 8px 36px', 
                      borderRadius: 10, 
                      border: '1px solid rgba(0,0,0,0.1)', 
                      fontSize: 13,
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {loadingData ? (
                  <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></div>
                ) : (
                  (selectionTab === 'favorites' ? favRecipes : myRecipes)
                    .filter(r => {
                      const title = removeAccents(r.title.toLowerCase());
                      const query = removeAccents(selectionSearch.toLowerCase());
                      return title.includes(query);
                    })
                ).length > 0 ? (
                  (selectionTab === 'favorites' ? favRecipes : myRecipes)
                    .filter(r => {
                      const title = removeAccents(r.title.toLowerCase());
                      const query = removeAccents(selectionSearch.toLowerCase());
                      return title.includes(query);
                    })
                    .map(r => (
                      <div key={r.id} onClick={() => handleSelectRecipe(r.id)} style={{ display: 'flex', gap: 12, padding: 8, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' }} 
                        className="hover-card-bg"
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,105,56,0.05)'; e.currentTarget.style.borderColor = 'rgba(57,105,56,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                      >
                        <img src={resolveImageUrl(r.imageUrl)} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.rose900 }}>{r.title}</h4>
                          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>{r.difficulty} • {r.cookingTime || r.prepTime}p</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p style={{ textAlign: 'center', padding: 40, color: 'rgba(0,0,0,0.4)', fontSize: 14 }}>
                    {selectionSearch ? 'Không tìm thấy món phù hợp.' : 'Chưa có món nào trong danh sách này.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .animate-zoomIn {
          animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

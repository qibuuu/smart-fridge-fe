import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useRecipes } from '../hooks/useRecipes';
import { useToast } from '../context/ToastContext';
import { resolveImageUrl } from '../utils/helpers';
import { COLORS, DIFFICULTIES } from '../constants';

export default function AddRecipePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const toast = useToast();
  const fileRef = useRef();

  const { getById, create, update, upload } = useRecipes();

  const [form, setForm] = useState({
    title: '',
    description: '',
    prepTime: '',
    calories: '',
    difficulty: 'Dễ',
    servings: '2',
    imageUrl: '',
  });
  const [ingredients, setIngredients] = useState([
    { amount: '', unit: 'g', ingredientName: '' },
  ]);
  const [steps, setSteps] = useState(['']);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        setLoading(true);
        try {
          const res = await getById(id);
          const r = res.data;
          setForm({
            title: r.title || '',
            description: r.description || '',
            prepTime: r.prepTime || r.cookingTime || '',
            calories: r.calories || '',
            difficulty: r.difficulty || 'Dễ',
            servings: r.servings || '2',
            imageUrl: r.imageUrl || '',
          });
          // Backend format: "300 g Thịt bò" -> {amount, unit, name}
          if (r.ingredients && r.ingredients.length > 0) {
            setIngredients(
              r.ingredients.map((ing) => {
                const parts = ing.split(' ');
                return {
                  amount: parts[0] || '',
                  unit: parts[1] || 'g',
                  ingredientName: parts.slice(2).join(' ') || ing,
                };
              })
            );
          }
          if (r.instructions) {
            setSteps(
              typeof r.instructions === 'string'
                ? r.instructions.split('\n')
                : r.instructions
            );
          }
        } catch {
          toast.error('Không thể tải dữ liệu công thức!');
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [id]);

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleIngredientChange = (idx, field, val) =>
    setIngredients((prev) =>
      prev.map((ing, i) => (i === idx ? { ...ing, [field]: val } : ing))
    );
  const addIngredient = () =>
    setIngredients((prev) => [...prev, { amount: '', unit: 'g', ingredientName: '' }]);
  const removeIngredient = (idx) =>
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  const handleStepChange = (idx, val) =>
    setSteps((prev) => prev.map((s, i) => (i === idx ? val : s)));
  const addStep = () => setSteps((prev) => [...prev, '']);
  const removeStep = (idx) => setSteps((prev) => prev.filter((_, i) => i !== idx));

  const handleImageFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await upload(file);
      setForm((prev) => ({ ...prev, imageUrl: res.data.url }));
      toast.success('Đã tải ảnh lên!');
    } catch {
      toast.error('Không thể tải ảnh!');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Vui lòng nhập tên món ăn!');
      return;
    }
    if (ingredients.every((i) => !i.ingredientName.trim())) {
      toast.error('Vui lòng thêm ít nhất 1 nguyên liệu!');
      return;
    }

    setSubmitting(true);
    const payload = {
      ...form,
      prepTime: parseInt(form.prepTime) || 0,
      calories: parseInt(form.calories) || 0,
      servings: parseInt(form.servings) || 2,
      ingredients: ingredients
        .filter((i) => i.ingredientName.trim())
        .map((i) => ({
          amount: parseFloat(i.amount) || 0,
          unit: i.unit,
          ingredientName: i.ingredientName.trim(),
        })),
      instructions: steps.filter((s) => s.trim()).join('\n'),
    };

    try {
      if (id) {
        await update(id, payload);
        toast.success('Đã cập nhật công thức!');
      } else {
        await create(payload);
        toast.success('Đã tạo công thức mới!');
      }
      navigate('/my-kitchen');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="spinner" />
        </div>
      </div>
    );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main
        className="page-container has-bottom-nav"
        style={{ gap: 'var(--section-gap)' }}
      >
        <div>
          <h1
            style={{
              fontSize: 'clamp(24px,5vw,36px)',
              fontWeight: 700,
              color: COLORS.rose900,
              marginBottom: 6,
            }}
          >
            {id ? 'Sửa công thức' : 'Thêm công thức mới'}
          </h1>
          <p
            style={{ fontSize: 14, color: COLORS.onSurfaceVariant, fontWeight: 600 }}
          >
            {id
              ? 'Chỉnh sửa lại hương vị cho hoàn hảo hơn!'
              : 'Chia sẻ công thức độc đáo của bạn với mọi người.'}
          </p>
        </div>

        <div className="grid-sidebar-layout">
          {/* ── Left Column: Form Editor ── */}
          <div className="grid-sidebar-left">
            {/* Section 1: Basics & Image */}
            <section
              className="glass-card"
              style={{ padding: 'clamp(20px,4vw,32px)' }}
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleImageFile(e.dataTransfer.files[0]);
                }}
                onClick={() => fileRef.current.click()}
                style={{
                  aspectRatio: '21/9',
                  borderRadius: 20,
                  border: `2px dashed rgba(57,105,56,0.3)`,
                  background: dragOver
                    ? 'rgba(200,255,192,0.3)'
                    : 'rgba(57,105,56,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.2s',
                  marginBottom: 24,
                }}
              >
                {form.imageUrl ? (
                  <img
                    src={resolveImageUrl(form.imageUrl)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    alt="Preview"
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: COLORS.primary }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 48, marginBottom: 8 }}
                    >
                      add_a_photo
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>Tải ảnh món ăn lên</p>
                    <p style={{ fontSize: 12, opacity: 0.7 }}>
                      Kéo thả hoặc nhấn để chọn
                    </p>
                  </div>
                )}
                {uploading && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255,255,255,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className="spinner" style={{ width: 32, height: 32 }} />
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageFile(e.target.files[0])}
                />
              </div>

              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Tên món ăn (Ví dụ: Bún chả Hà Nội)..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid rgba(193,201,188,0.5)',
                  padding: '12px 0',
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.rose900,
                  outline: 'none',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  marginBottom: 16,
                }}
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Viết một chút câu chuyện hoặc miêu tả sức hút về món ăn này..."
                rows={3}
                className="input-base"
                style={{ width: '100%', resize: 'none', padding: 16 }}
              />
            </section>

            {/* Section 2: Metadata */}
            <section
              className="glass-card"
              style={{
                padding: 'clamp(20px,4vw,28px)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))',
                gap: 16,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span>
                  THỜI GIAN (PHÚT)
                </label>
                <input
                  name="prepTime"
                  type="number"
                  value={form.prepTime}
                  onChange={handleFormChange}
                  placeholder="30"
                  className="input-base"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>local_fire_department</span>
                  CALORIES (KCAL)
                </label>
                <input
                  name="calories"
                  type="number"
                  value={form.calories}
                  onChange={handleFormChange}
                  placeholder="450"
                  className="input-base"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>group</span>
                  KHẨU PHẦN (NGƯỜI)
                </label>
                <input
                  name="servings"
                  type="number"
                  value={form.servings}
                  onChange={handleFormChange}
                  placeholder="2"
                  className="input-base"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span>
                  ĐỘ KHÓ
                </label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleFormChange}
                  className="input-base"
                  style={{ cursor: 'pointer' }}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* Section 3: Ingredients */}
            <section
              className="glass-card"
              style={{ padding: 'clamp(20px,4vw,32px)' }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.rose900,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span className="material-symbols-outlined">inventory_2</span> Nguyên liệu cần chuẩn bị
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ingredients.map((ing, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      value={ing.amount}
                      onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                      placeholder="SL"
                      className="input-base"
                      style={{ width: 70 }}
                    />
                    <input
                      value={ing.unit}
                      onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                      placeholder="Đơn vị"
                      className="input-base"
                      style={{ width: 90 }}
                    />
                    <input
                      value={ing.ingredientName}
                      onChange={(e) =>
                        handleIngredientChange(idx, 'ingredientName', e.target.value)
                      }
                      placeholder="Tên nguyên liệu (Ví dụ: Bột mì, Thịt bò...)"
                      className="input-base"
                      style={{ flex: 1 }}
                    />
                    <button
                      onClick={() => removeIngredient(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: COLORS.error,
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addIngredient}
                className="btn-secondary"
                style={{
                  marginTop: 16,
                  width: '100%',
                  border: `1px dashed ${COLORS.primary}`,
                  color: COLORS.primary,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  add_circle
                </span>{' '}
                Thêm nguyên liệu mới
              </button>
            </section>

            {/* Section 4: Instructions */}
            <section
              className="glass-card"
              style={{ padding: 'clamp(20px,4vw,32px)' }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.rose900,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span className="material-symbols-outlined">
                  format_list_numbered
                </span>{' '}
                Các bước thực hiện
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {steps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: COLORS.primary,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 10,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <textarea
                      value={step}
                      onChange={(e) => handleStepChange(idx, e.target.value)}
                      placeholder="Mô tả cụ thể bước thực hiện này..."
                      rows={2}
                      className="input-base"
                      style={{ flex: 1, resize: 'none', padding: 12 }}
                    />
                    <button
                      onClick={() => removeStep(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: COLORS.error,
                        alignSelf: 'center',
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addStep}
                className="btn-secondary"
                style={{
                  marginTop: 16,
                  width: '100%',
                  border: `1px dashed ${COLORS.primary}`,
                  color: COLORS.primary,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  add_circle
                </span>{' '}
                Thêm bước tiếp theo
              </button>
            </section>
          </div>

          {/* ── Right Column: Sidebar ── */}
          <div className="grid-sidebar-right">
            {/* Publishing Panel */}
            <div
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.rose900, marginBottom: 4 }}>
                Xuất bản món ăn
              </h3>
              
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  opacity: submitting ? 0.7 : 1,
                  fontSize: 14,
                }}
              >
                {submitting ? (
                  <>
                    <div
                      className="spinner"
                      style={{ width: 18, height: 18, borderWidth: 2 }}
                    />{' '}
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>publish</span>
                    {id ? 'Cập nhật món ăn' : 'Xuất bản công thức'}
                  </>
                )}
              </button>

              <button
                onClick={() => navigate(-1)}
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px',
                  fontSize: 14,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                Hủy bỏ thay đổi
              </button>
            </div>

            {/* Culinary Pro Tips */}
            <div
              className="glass-card"
              style={{
                padding: '24px',
                background: 'rgba(255,218,218,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: COLORS.rose900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span className="material-symbols-outlined icon-fill" style={{ color: COLORS.primary, fontSize: 20 }}>lightbulb</span>
                Mẹo viết công thức chuẩn
              </h3>
              <ul
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: COLORS.onSurfaceVariant,
                  paddingLeft: 16,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <li>Chụp hình ảnh món ăn dưới ánh sáng tự nhiên để đạt chất lượng bắt mắt nhất.</li>
                <li>Định lượng rõ ràng nguyên liệu bằng các đơn vị thông dụng (g, ml, quả, muỗng...).</li>
                <li>Chia nhỏ hướng dẫn thành nhiều bước ngắn gọn, rõ ý giúp người nấu dễ theo dõi.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
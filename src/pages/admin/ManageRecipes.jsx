import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllRecipes, createRecipe, updateRecipe, deleteRecipe, uploadImage } from '../../api/recipes';
import { useAuth } from '../../context/AuthContext';

const C = {
  primary: '#396938',
  primaryContainer: '#c8ffc0',
  onPrimaryContainer: '#215023',
  tertiary: '#40683e',
  tertiaryContainer: '#cefdc7',
  onTertiaryContainer: '#4e774c',
  secondary: '#735858',
  secondaryContainer: '#ffdada',
  surface: '#f7faf3',
  surfaceBright: '#f7faf3',
  surfaceContainerLow: '#f2f5ee',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e6e9e2',
  surfaceContainer: '#ecefe8',
  onSurface: '#191d19',
  onSurfaceVariant: '#42493f',
  outline: '#72796e',
  outlineVariant: '#c1c9bc',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
};

export default function ManageRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const [formData, setFormData] = useState({
    title: '', description: '', difficulty: 'Dễ',
    prepTime: 20, calories: 250, servings: 2,
    imageUrl: '', tags: 'Món Chính', instructions: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchRecipes(); }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await getAllRecipes();
      setRecipes(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  };

  const blankForm = { title: '', description: '', difficulty: 'Dễ', prepTime: 20, calories: 250, servings: 2, imageUrl: '', tags: 'Món Chính', instructions: '' };

  const handleOpenAdd = () => {
    setIsEditing(false); setCurrentId(null);
    setFormData(blankForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (recipe) => {
    setIsEditing(true); setCurrentId(recipe.id);
    setFormData({
      title: recipe.title || '', description: recipe.description || '',
      difficulty: recipe.difficulty || 'Dễ', prepTime: recipe.prepTime || 20,
      calories: recipe.calories || 250, servings: recipe.servings || 2,
      imageUrl: recipe.imageUrl || '', tags: recipe.tags || 'Món Chính',
      instructions: recipe.instructions || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công thức này?')) return;
    try { await deleteRecipe(id); fetchRecipes(); }
    catch { alert('Failed to delete recipe.'); }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
    } catch { alert('Không thể tải ảnh lên.'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.instructions) { alert('Tên món ăn và hướng dẫn không được để trống!'); return; }
    try {
      const payload = { ...formData, authorId: user?.id || 1 };
      if (isEditing) await updateRecipe(currentId, payload);
      else await createRecipe(payload);
      setIsModalOpen(false); fetchRecipes();
    } catch { alert('Lưu công thức thất bại.'); }
  };

  const filtered = recipes.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const inputStyle = {
    width: '100%', backgroundColor: C.surfaceContainerLow, border: 'none',
    borderRadius: '12px', padding: '12px 16px', fontSize: '14px',
    color: C.onSurface, outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 700,
    color: C.onSurfaceVariant, textTransform: 'uppercase',
    letterSpacing: '0.05em', marginBottom: '8px',
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: C.onSurface, letterSpacing: '-0.02em' }}>Recipe Management</h1>
          <p style={{ color: C.onSurfaceVariant, fontSize: '15px', marginTop: '4px' }}>Review and organize your culinary catalog.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer, borderRadius: '14px', padding: '10px 24px', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(57,105,56,0.15)', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.primary; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.primaryContainer; e.currentTarget.style.color = C.onPrimaryContainer; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
          Add New Recipe
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Recipes', value: recipes.length, color: C.primary },
          { label: 'Main Dishes', value: recipes.filter(r => r.tags?.toLowerCase().includes('chính') || r.tags?.toLowerCase().includes('main')).length, color: C.tertiary },
          { label: 'Easy Level', value: recipes.filter(r => r.difficulty?.toLowerCase().includes('dễ') || r.difficulty?.toLowerCase().includes('easy')).length, color: C.secondary },
          { label: 'Avg. Prep Time', value: recipes.length ? Math.round(recipes.reduce((a, r) => a + (r.prepTime || 0), 0) / recipes.length) + 'm' : '0m', color: C.primary },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: C.surfaceContainerLowest, borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(57,105,56,0.05)', border: `1px solid ${C.outlineVariant}` }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>{s.label}</span>
            <span style={{ fontSize: '32px', fontWeight: 700, color: s.color, lineHeight: '38px' }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div style={{ backgroundColor: C.surfaceContainerLowest, borderRadius: '16px', border: `1px solid ${C.outlineVariant}`, boxShadow: '0 4px 16px rgba(57,105,56,0.05)', overflow: 'hidden' }}>
        {/* Search Bar */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-outlined" style={{ color: C.onSurfaceVariant, fontSize: '20px' }}>search</span>
          <input
            type="text" placeholder="Search recipes..."
            style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '14px', color: C.onSurface }}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.onSurfaceVariant }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          )}
        </div>

        {error && <div style={{ padding: '12px 20px', backgroundColor: C.errorContainer, color: C.error, fontSize: '13px' }}>{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `3px solid ${C.primaryContainer}`, borderTopColor: C.primary, animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: C.surfaceContainerLow, borderBottom: `1px solid ${C.outlineVariant}` }}>
                  {['Image', 'Name', 'Category', 'Difficulty', 'Servings & Prep', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 20px', fontSize: '11px', fontWeight: 700, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: i === 5 ? 'right' : 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: C.onSurfaceVariant, fontSize: '14px' }}>
                      No recipes found.
                    </td>
                  </tr>
                ) : paginated.map((recipe) => (
                  <tr
                    key={recipe.id}
                    style={{ borderBottom: `1px solid ${C.outlineVariant}`, transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surfaceContainer; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ width: '64px', height: '48px', borderRadius: '10px', overflow: 'hidden', backgroundColor: C.surfaceContainerHigh }}>
                        <img
                          alt={recipe.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'; }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: C.onSurface }}>{recipe.title}</span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ backgroundColor: C.tertiaryContainer, color: C.onTertiaryContainer, padding: '3px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                        {recipe.tags || 'Món ăn'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.primary, display: 'inline-block' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: C.primary }}>{recipe.difficulty}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', color: C.onSurfaceVariant }}>
                      {recipe.servings} phần • {recipe.prepTime} phút
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <button
                          onClick={() => handleOpenEdit(recipe)}
                          style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant, backgroundColor: 'transparent', transition: 'all 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.primaryContainer; e.currentTarget.style.color = C.primary; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.onSurfaceVariant; }}
                          title="Edit"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(recipe.id)}
                          style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant, backgroundColor: 'transparent', transition: 'all 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.errorContainer; e.currentTarget.style.color = C.error; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.onSurfaceVariant; }}
                          title="Delete"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.outlineVariant}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: C.onSurfaceVariant }}>
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} recipes
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ padding: '6px', borderRadius: '10px', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', backgroundColor: 'transparent', opacity: currentPage === 1 ? 0.4 : 1, color: C.onSurfaceVariant }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: currentPage === p ? C.primary : 'transparent', color: currentPage === p ? 'white' : C.onSurfaceVariant, fontWeight: currentPage === p ? 700 : 400, fontSize: '13px' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ padding: '6px', borderRadius: '10px', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', backgroundColor: 'transparent', opacity: currentPage === totalPages ? 0.4 : 1, color: C.onSurfaceVariant }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: C.onSurface }}>
                {isEditing ? 'Update Recipe' : 'Add New Recipe'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: C.onSurfaceVariant }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Tên Món Ăn *</label>
                  <input required style={inputStyle} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Phân loại / Tag</label>
                  <input style={inputStyle} placeholder="Món Chính, Canh, Breakfast..." value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Mô Tả Ngắn</label>
                <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Độ Khó</label>
                  <select style={inputStyle} value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}>
                    <option>Dễ</option><option>Trung Bình</option><option>Khó</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Chuẩn bị (phút)</label>
                  <input type="number" style={inputStyle} value={formData.prepTime} onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={labelStyle}>Calories</label>
                  <input type="number" style={inputStyle} value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={labelStyle}>Khẩu phần</label>
                  <input type="number" style={inputStyle} value={formData.servings} onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label style={labelStyle}>Hình Ảnh Công Thức</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '60px', borderRadius: '12px', overflow: 'hidden', backgroundColor: C.surfaceContainerHigh, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="material-symbols-outlined" style={{ color: C.onSurfaceVariant, fontSize: '24px' }}>image</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" id="recipe-img" className="hidden" onChange={handleImageChange} disabled={uploading} />
                    <label htmlFor="recipe-img" style={{ display: 'inline-block', backgroundColor: C.surfaceContainerLow, border: `1px solid ${C.outlineVariant}`, borderRadius: '10px', padding: '8px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: C.onSurfaceVariant }}>
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </label>
                    <input type="text" placeholder="Or paste image URL..." style={{ ...inputStyle, marginTop: '8px', padding: '8px 12px', fontSize: '13px' }} value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Hướng Dẫn Nấu Ăn *</label>
                <textarea rows={5} required placeholder="Bước 1: Sơ chế...&#10;Bước 2: Nấu nước..." style={{ ...inputStyle, resize: 'vertical' }} value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} />
              </div>

              <div style={{ borderTop: `1px solid ${C.outlineVariant}`, paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 20px', border: `1px solid ${C.outlineVariant}`, borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: C.onSurfaceVariant, backgroundColor: 'white', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ padding: '10px 24px', backgroundColor: C.primary, color: 'white', borderRadius: '12px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'opacity 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
                  {isEditing ? 'Save Changes' : 'Add Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

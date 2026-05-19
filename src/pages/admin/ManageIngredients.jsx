import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllIngredients, createIngredient, updateIngredient, deleteIngredient } from '../../api/ingredients';
import { uploadImage } from '../../api/recipes';

const C = {
  primary: '#396938',
  primaryContainer: '#c8ffc0',
  onPrimaryContainer: '#215023',
  tertiary: '#40683e',
  tertiaryContainer: '#cefdc7',
  secondary: '#735858',
  secondaryContainer: '#ffdada',
  surface: '#f7faf3',
  surfaceContainerLow: '#f2f5ee',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e6e9e2',
  surfaceBright: '#f7faf3',
  onSurface: '#191d19',
  onSurfaceVariant: '#42493f',
  outline: '#72796e',
  outlineVariant: '#c1c9bc',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
};

const iconColors = ['#396938', '#40683e', '#735858', '#4e774c', '#594041'];

export default function ManageIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const [formData, setFormData] = useState({ name: '', unit: 'g', imageUrl: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchIngredients(); }, []);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const res = await getAllIngredients();
      setIngredients(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách nguyên liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false); setCurrentId(null);
    setFormData({ name: '', unit: 'g', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ing) => {
    setIsEditing(true); setCurrentId(ing.id);
    setFormData({ name: ing.name || '', unit: ing.unit || 'g', imageUrl: ing.imageUrl || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) return;
    try { await deleteIngredient(id); fetchIngredients(); }
    catch (err) { alert('Xóa nguyên liệu thất bại.'); }
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
    if (!formData.name || !formData.unit) { alert('Tên và đơn vị không được để trống!'); return; }
    try {
      if (isEditing) await updateIngredient(currentId, formData);
      else await createIngredient(formData);
      setIsModalOpen(false); fetchIngredients();
    } catch { alert('Lưu nguyên liệu thất bại.'); }
  };

  const filtered = ingredients.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: C.onSurface, letterSpacing: '-0.02em' }}>Ingredients Library</h1>
          <p style={{ color: C.onSurfaceVariant, fontSize: '15px', marginTop: '4px' }}>Maintain your inventory of raw components and units.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer, borderRadius: '14px', padding: '10px 24px', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(57,105,56,0.15)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.primary; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.primaryContainer; e.currentTarget.style.color = C.onPrimaryContainer; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          Add New Ingredient
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { icon: 'inventory_2', label: 'Total Items', value: ingredients.length, bg: C.tertiaryContainer, color: C.tertiary },
          { icon: 'warning', label: 'No Image', value: ingredients.filter(i => !i.imageUrl).length, bg: C.secondaryContainer, color: C.secondary },
          { icon: 'category', label: 'Unique Units', value: new Set(ingredients.map(i => i.unit)).size, bg: C.primaryContainer, color: C.primary },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: C.surfaceContainerLowest, borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(57,105,56,0.05)', border: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: s.color, fontSize: '22px' }}>{s.icon}</span>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ fontSize: '26px', fontWeight: 700, color: C.onSurface, lineHeight: '32px' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div style={{ backgroundColor: C.surfaceContainerLowest, borderRadius: '16px', border: `1px solid ${C.outlineVariant}`, boxShadow: '0 4px 16px rgba(57,105,56,0.05)', overflow: 'hidden' }}>

        {/* Search Bar */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-outlined" style={{ color: C.onSurfaceVariant, fontSize: '20px' }}>search</span>
          <input
            type="text"
            placeholder="Search ingredients..."
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

        {/* Table */}
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
                  {['Icon', 'Name', 'Unit', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 20px', fontSize: '11px', fontWeight: 700, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: i === 3 ? 'right' : 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '48px', color: C.onSurfaceVariant, fontSize: '14px' }}>
                      No ingredients found.
                    </td>
                  </tr>
                ) : paginated.map((ing, idx) => (
                  <tr
                    key={ing.id}
                    className="ingredient-row"
                    style={{ borderBottom: `1px solid ${C.outlineVariant}`, transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surfaceBright; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: C.surfaceContainerHigh, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {ing.imageUrl ? (
                          <img src={ing.imageUrl} alt={ing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span className="material-symbols-outlined" style={{ color: iconColors[idx % iconColors.length], fontSize: '20px' }}>eco</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: C.onSurface }}>{ing.name}</p>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ backgroundColor: C.surfaceContainerHigh, color: C.onSurfaceVariant, padding: '2px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                        {ing.unit}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <button
                          onClick={() => handleOpenEdit(ing)}
                          style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: C.primary, backgroundColor: 'transparent', transition: 'background 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.primaryContainer; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          title="Edit"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(ing.id)}
                          style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: C.error, backgroundColor: 'transparent', transition: 'background 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.errorContainer; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
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

        {/* Pagination Footer */}
        {!loading && filtered.length > 0 && (
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.outlineVariant}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.surfaceContainerLowest }}>
            <span style={{ fontSize: '12px', color: C.onSurfaceVariant }}>
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} ingredients
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px 14px', borderRadius: '10px', border: `1px solid ${C.outlineVariant}`, backgroundColor: 'transparent', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1, fontSize: '13px', color: C.onSurfaceVariant }}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: currentPage === page ? C.primary : 'transparent', color: currentPage === page ? 'white' : C.onSurfaceVariant, fontWeight: currentPage === page ? 700 : 400, fontSize: '13px' }}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '6px 14px', borderRadius: '10px', border: `1px solid ${C.outlineVariant}`, backgroundColor: 'transparent', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1, fontSize: '13px', color: C.onSurfaceVariant }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.onSurface }}>
                {isEditing ? 'Edit Ingredient' : 'Add New Ingredient'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: C.onSurfaceVariant }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Ingredient Name', key: 'name', placeholder: 'e.g. Baby Spinach, Avocado...' },
                { label: 'Unit', key: 'unit', placeholder: 'g, kg, piece, ml...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>{label}</label>
                  <input
                    type="text" required placeholder={placeholder}
                    style={{ width: '100%', backgroundColor: C.surfaceContainerLow, border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: C.onSurface, outline: 'none', boxSizing: 'border-box' }}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    onFocus={(e) => { e.target.style.boxShadow = `0 0 0 2px ${C.primary}`; }}
                    onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              ))}

              {/* Image Upload */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Image (Optional)</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', backgroundColor: C.surfaceContainerHigh, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: '28px' }}>eco</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" id="ing-img" className="hidden" onChange={handleImageChange} disabled={uploading} />
                    <label htmlFor="ing-img" style={{ display: 'inline-block', backgroundColor: C.surfaceContainerLow, border: `1px solid ${C.outlineVariant}`, borderRadius: '10px', padding: '8px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: C.onSurfaceVariant }}>
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </label>
                    <input
                      type="text" placeholder="Or paste image URL..."
                      style={{ width: '100%', marginTop: '8px', backgroundColor: C.surfaceContainerLow, border: 'none', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: C.onSurface, outline: 'none', boxSizing: 'border-box' }}
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </div>
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
                  {isEditing ? 'Save Changes' : 'Add Ingredient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

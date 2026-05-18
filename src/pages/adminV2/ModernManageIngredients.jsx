import React, { useEffect, useState } from 'react';
import ModernAdminLayout from './components/ModernAdminLayout';
import { getAllIngredients, createIngredient, updateIngredient, deleteIngredient } from '../../api/ingredients';
import { uploadImage } from '../../api/recipes';

export default function ModernManageIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    unit: 'g',
    imageUrl: '',
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

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
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      unit: 'g',
      imageUrl: '',
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (ing) => {
    setIsEditing(true);
    setCurrentId(ing.id);
    setFormData({
      name: ing.name || '',
      unit: ing.unit || 'g',
      imageUrl: ing.imageUrl || '',
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
      try {
        await deleteIngredient(id);
        fetchIngredients();
      } catch (err) {
        console.error(err);
        alert('Xóa nguyên liệu thất bại.');
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      console.error(err);
      alert('Không thể tải ảnh lên.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.unit) {
      alert('Tên nguyên liệu và đơn vị không được để trống!');
      return;
    }

    try {
      if (isEditing) {
        await updateIngredient(currentId, formData);
      } else {
        await createIngredient(formData);
      }
      setIsDrawerOpen(false);
      fetchIngredients();
    } catch (err) {
      console.error(err);
      alert('Lưu nguyên liệu thất bại.');
    }
  };

  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModernAdminLayout>
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-[#191d19] tracking-tight bg-gradient-to-r from-[#191d19] to-[#396938] bg-clip-text text-transparent">
            Ingredients Library
          </h2>
          <p className="text-[#42493f] mt-1 font-medium">Maintain the list of organic raw materials and kitchen supplies.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#396938] hover:bg-[#215023] text-white px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Add Ingredient</span>
        </button>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#cefdc7]/60 text-[#40683e] rounded-xl flex items-center justify-center shrink-0 border border-[#c1c9bc]/10">
            <span className="material-symbols-outlined text-[22px]">inventory_2</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider">Total Items</p>
            <p className="text-2xl font-black text-[#191d19] mt-1">{ingredients.length}</p>
          </div>
        </div>

        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center shrink-0 border border-amber-200/40">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider">Unassigned Images</p>
            <p className="text-2xl font-black text-amber-700 mt-1">
              {ingredients.filter(i => !i.imageUrl).length}
            </p>
          </div>
        </div>

        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#c8ffc0]/60 text-[#215023] rounded-xl flex items-center justify-center shrink-0 border border-[#c1c9bc]/10">
            <span className="material-symbols-outlined text-[22px]">local_shipping</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider">Total Units</p>
            <p className="text-2xl font-black text-[#215023] mt-1">
              {new Set(ingredients.map(i => i.unit)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Search / Filter box */}
      <div className="border border-white/50 backdrop-blur-md bg-white/60 p-5 rounded-2xl mb-8 flex gap-4 items-center shadow-xs">
        <span className="material-symbols-outlined text-[#5f665b]">search</span>
        <input
          type="text"
          placeholder="Tìm kiếm nguyên liệu bằng tên..."
          className="w-full bg-transparent border-none focus:outline-hidden text-sm placeholder-[#5f665b]/60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200/50 text-rose-700 rounded-2xl mb-8 font-bold text-sm shadow-xs animate-pulse">
          {error}
        </div>
      )}

      {/* Ingredients Grid / Table */}
      <div className="border border-white/50 backdrop-blur-md bg-white/70 rounded-3xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-[#396938]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#396938] animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2f5ee]/80 border-b border-[#c1c9bc]/30">
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Icon</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Name</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Unit</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e9e2]/60">
                {filteredIngredients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-20 text-[#5f665b] font-bold">
                      Không tìm thấy nguyên liệu nào trong kho thư viện.
                    </td>
                  </tr>
                ) : (
                  filteredIngredients.map((ing) => (
                    <tr 
                      key={ing.id} 
                      className="hover:bg-[#f7faf3]/60 transition-all duration-150 group"
                    >
                      <td className="px-8 py-5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-[#c1c9bc]/30 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                          {ing.imageUrl ? (
                            <img 
                              alt={ing.name} 
                              className="w-full h-full object-cover" 
                              src={ing.imageUrl} 
                              onError={(e) => { e.target.src = ''; }}
                            />
                          ) : (
                            <div className="w-full h-full bg-[#c8ffc0]/40 flex items-center justify-center text-[#396938]">
                              <span className="material-symbols-outlined text-[22px]">eco</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-[#191d19] group-hover:text-[#396938] transition-colors leading-tight">
                            {ing.name}
                          </span>
                          <span className="text-[10px] text-[#5f665b] font-bold mt-1 tracking-wide">
                            Code: #ING-{ing.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#e6e9e2] text-[#42493f] text-xs font-bold border border-[#c1c9bc]/10">
                          {ing.unit}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(ing)}
                            className="p-2 text-[#396938] hover:bg-[#c8ffc0] rounded-xl transition-all"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(ing.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Right-sliding Drawer for Ingredient creation/editing */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-[#191d19]/25 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer container */}
          <div 
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 bg-white shadow-2xl border-l border-[#c1c9bc]/30 flex flex-col justify-between animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#c1c9bc]/20 bg-[#f2f5ee]/40 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#191d19] tracking-tight">
                  {isEditing ? 'Sửa Nguyên liệu' : 'Thêm Nguyên liệu Mới'}
                </h3>
                <p className="text-[11px] text-[#5f665b] mt-0.5 font-bold uppercase tracking-wider">SmartFridge Cloud Editor</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 hover:bg-[#e6e9e2] text-[#42493f] rounded-full transition-colors flex items-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Fields container */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-6">
              {/* Cover image live preview & file upload */}
              <div className="flex flex-col gap-4 items-center bg-[#f7faf3] p-5 rounded-2xl border border-[#c1c9bc]/30">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#e6e9e2] border border-[#c1c9bc]/30 flex items-center justify-center shrink-0 shadow-md relative">
                  {formData.imageUrl ? (
                    <img 
                      alt="Ingredient Preview" 
                      className="w-full h-full object-cover" 
                      src={formData.imageUrl} 
                    />
                  ) : (
                    <div className="w-full h-full bg-[#c8ffc0]/40 flex items-center justify-center text-[#396938]">
                      <span className="material-symbols-outlined text-[36px]">eco</span>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-[#191d19]/40 flex items-center justify-center rounded-full">
                      <span className="material-symbols-outlined text-white animate-spin">sync</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Ảnh đại diện nguyên liệu</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="ing-file-input"
                  />
                  <label
                    htmlFor="ing-file-input"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#c1c9bc] hover:border-[#396938] hover:bg-[#c8ffc0]/10 rounded-xl cursor-pointer text-xs font-bold text-[#42493f] transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">cloud_upload</span>
                    Tải ảnh lên
                  </label>
                </div>
              </div>

              {/* Ingredient Name */}
              <div>
                <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Tên nguyên liệu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thịt Bò Thăn, Nấm Đùi Gà"
                  className="w-full border border-[#c1c9bc] focus:border-[#396938] focus:ring-1 focus:ring-[#396938] rounded-xl px-4 py-3 text-sm transition-all focus:outline-hidden"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Metric unit dropdown/input selection */}
              <div>
                <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Đơn vị đo lường *</label>
                <select
                  required
                  className="w-full border border-[#c1c9bc] focus:border-[#396938] rounded-xl px-4 py-3 text-sm focus:outline-hidden bg-white"
                  value={formData.unit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                >
                  <option value="g">Gam (g)</option>
                  <option value="ml">Mililít (ml)</option>
                  <option value="kg">Kilôgam (kg)</option>
                  <option value="quả">Quả (quả)</option>
                  <option value="muỗng">Muỗng (muỗng)</option>
                  <option value="tép">Tép (tép)</option>
                </select>
              </div>
            </form>

            {/* Footer buttons inside Drawer */}
            <div className="px-8 py-6 border-t border-[#c1c9bc]/20 bg-[#f2f5ee]/40 flex gap-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-grow bg-[#396938] hover:bg-[#215023] text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Lưu nguyên liệu</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-3.5 border border-[#c1c9bc] hover:bg-[#e6e9e2] rounded-xl font-bold text-[#42493f] text-sm transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </>
      )}
    </ModernAdminLayout>
  );
}

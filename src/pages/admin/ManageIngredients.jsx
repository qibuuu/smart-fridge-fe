import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllIngredients, createIngredient, updateIngredient, deleteIngredient } from '../../api/ingredients';
import { uploadImage } from '../../api/recipes';

export default function ManageIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ing) => {
    setIsEditing(true);
    setCurrentId(ing.id);
    setFormData({
      name: ing.name || '',
      unit: ing.unit || 'g',
      imageUrl: ing.imageUrl || '',
    });
    setIsModalOpen(true);
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
      setIsModalOpen(false);
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
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#191d19]">Ingredients Library</h2>
          <p className="text-[#42493f]">Maintain the list of organic raw materials and kitchen supplies.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#40683e] hover:bg-[#284f28] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add Ingredient
        </button>
      </div>

      {/* Bento Grid Stats like mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl border border-[#c1c9bc] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#cefdc7] text-[#40683e] rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#42493f] uppercase">Total Items</p>
            <p className="text-2xl font-extrabold text-[#191d19]">{ingredients.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#c1c9bc] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ffdada] text-[#735858] rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#42493f] uppercase">Unassigned Icons</p>
            <p className="text-2xl font-extrabold text-[#191d19]">
              {ingredients.filter(i => !i.imageUrl).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#c1c9bc] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#c8ffc0] text-[#215023] rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#42493f] uppercase">Total Units</p>
            <p className="text-2xl font-extrabold text-[#191d19]">
              {new Set(ingredients.map(i => i.unit)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Filter / Search bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#c1c9bc] mb-6 flex gap-4 items-center">
        <span className="material-symbols-outlined text-[#42493f]">search</span>
        <input
          type="text"
          placeholder="Tìm kiếm nguyên liệu..."
          className="w-full bg-transparent border-none focus:outline-hidden text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl mb-6">{error}</div>}

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#c1c9bc] overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#396938]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2f5ee] border-b border-[#c1c9bc]">
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e9e2]">
                {filteredIngredients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-[#42493f] font-medium">
                      Không tìm thấy nguyên liệu nào.
                    </td>
                  </tr>
                ) : (
                  filteredIngredients.map((ing) => (
                    <tr key={ing.id} className="hover:bg-[#f7faf3] transition-colors">
                      <td className="px-6 py-5">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-[#c1c9bc] flex items-center justify-center">
                          {ing.imageUrl ? (
                            <img alt={ing.name} className="w-full h-full object-cover" src={ing.imageUrl} />
                          ) : (
                            <span className="material-symbols-outlined text-[#40683e]">eco</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-[#191d19]">{ing.name}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-full bg-[#e6e9e2] text-[#42493f] text-xs font-bold">
                          {ing.unit}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(ing)}
                            className="p-2 text-[#40683e] hover:bg-emerald-50 rounded-xl transition-all"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(ing.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined">delete</span>
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

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#191d19]">
                {isEditing ? 'Cập Nhật Nguyên Liệu' : 'Thêm Nguyên Liệu Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Tên Nguyên Liệu</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Rau bina, Bơ, Trứng..."
                  className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Đơn Vị Tính</label>
                <input
                  type="text"
                  required
                  placeholder="g, kg, quả, muỗng, ml..."
                  className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Biểu Tượng / Hình Ảnh</label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-xs bg-gray-100 border flex items-center justify-center shrink-0">
                    {formData.imageUrl ? (
                      <img className="w-full h-full object-cover" src={formData.imageUrl} />
                    ) : (
                      <span className="material-symbols-outlined text-[#40683e] text-3xl">eco</span>
                    )}
                  </div>
                  <div className="grow">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="ingredient-image-input"
                      onChange={handleImageChange}
                      disabled={uploading}
                    />
                    <label
                      htmlFor="ingredient-image-input"
                      className="inline-block bg-[#f2f5ee] hover:bg-[#e6e9e2] border border-[#c1c9bc] rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition-all"
                    >
                      {uploading ? 'Đang tải ảnh...' : 'Chọn ảnh / Tải lên'}
                    </label>
                    <input
                      type="text"
                      placeholder="Hoặc dán URL ảnh..."
                      className="w-full mt-2 bg-[#f2f5ee] border-none rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-[#396938]"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#c1c9bc] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-[#c1c9bc] rounded-xl text-sm font-bold text-[#42493f] hover:bg-gray-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#40683e] hover:bg-[#284f28] text-white rounded-xl text-sm font-bold transition-all shadow-xs"
                >
                  {isEditing ? 'Lưu Thay Đổi' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

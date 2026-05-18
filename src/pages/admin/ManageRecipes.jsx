import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllRecipes, createRecipe, updateRecipe, deleteRecipe, uploadImage } from '../../api/recipes';
import { useAuth } from '../../context/AuthContext';

export default function ManageRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Dễ',
    prepTime: 20,
    calories: 250,
    servings: 2,
    imageUrl: '',
    tags: 'Món Chính',
    instructions: '',
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

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

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      description: '',
      difficulty: 'Dễ',
      prepTime: 20,
      calories: 250,
      servings: 2,
      imageUrl: '',
      tags: 'Món Chính',
      instructions: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (recipe) => {
    setIsEditing(true);
    setCurrentId(recipe.id);
    setFormData({
      title: recipe.title || '',
      description: recipe.description || '',
      difficulty: recipe.difficulty || 'Dễ',
      prepTime: recipe.prepTime || 20,
      calories: recipe.calories || 250,
      servings: recipe.servings || 2,
      imageUrl: recipe.imageUrl || '',
      tags: recipe.tags || 'Món Chính',
      instructions: recipe.instructions || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công thức này?')) {
      try {
        await deleteRecipe(id);
        fetchRecipes();
      } catch (err) {
        console.error(err);
        alert('Failed to delete recipe.');
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
    if (!formData.title || !formData.instructions) {
      alert('Tên món ăn và hướng dẫn không được để trống!');
      return;
    }

    try {
      const payload = {
        ...formData,
        authorId: user?.id || 1,
      };

      if (isEditing) {
        await updateRecipe(currentId, payload);
      } else {
        await createRecipe(payload);
      }
      setIsModalOpen(false);
      fetchRecipes();
    } catch (err) {
      console.error(err);
      alert('Lưu công thức thất bại.');
    }
  };

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#191d19]">Recipe Management</h2>
          <p className="text-[#42493f]">Review, create, and organize your system's culinary recipes.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#396938] hover:bg-[#215023] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add New Recipe
        </button>
      </div>

      {/* Bento Layout Stats (Small highlight cards like mockup!) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-xs flex flex-col border border-[#c1c9bc]">
          <span className="text-xs font-bold text-[#42493f] uppercase tracking-wider mb-1">Total Recipes</span>
          <span className="text-2xl font-extrabold text-[#396938]">{recipes.length}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xs flex flex-col border border-[#c1c9bc]">
          <span className="text-xs font-bold text-[#42493f] uppercase tracking-wider mb-1">Main Dishes</span>
          <span className="text-2xl font-extrabold text-[#40683e]">
            {recipes.filter(r => r.tags?.toLowerCase().includes('chính') || r.tags?.toLowerCase().includes('main')).length}
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xs flex flex-col border border-[#c1c9bc]">
          <span className="text-xs font-bold text-[#42493f] uppercase tracking-wider mb-1">Easy Level</span>
          <span className="text-2xl font-extrabold text-[#735858]">
            {recipes.filter(r => r.difficulty?.toLowerCase().includes('dễ') || r.difficulty?.toLowerCase().includes('easy')).length}
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xs flex flex-col border border-[#c1c9bc]">
          <span className="text-xs font-bold text-[#42493f] uppercase tracking-wider mb-1">Avg. Prep Time</span>
          <span className="text-2xl font-extrabold text-[#396938]">
            {recipes.length ? Math.round(recipes.reduce((acc, curr) => acc + (curr.prepTime || 0), 0) / recipes.length) : 0}m
          </span>
        </div>
      </div>

      {/* Filter / Search bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#c1c9bc] mb-6 flex gap-4 items-center">
        <span className="material-symbols-outlined text-[#42493f]">search</span>
        <input
          type="text"
          placeholder="Tìm kiếm công thức nấu ăn..."
          className="w-full bg-transparent border-none focus:outline-hidden text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl mb-6">{error}</div>}

      {/* Recipes Table */}
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
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Image</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider">Servings & Prep</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#42493f] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e9e2]">
                {filteredRecipes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-[#42493f] font-medium">
                      Không tìm thấy công thức nào.
                    </td>
                  </tr>
                ) : (
                  filteredRecipes.map((recipe) => (
                    <tr key={recipe.id} className="hover:bg-[#f7faf3] transition-colors">
                      <td className="px-6 py-5">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shadow-xs bg-gray-100">
                          <img
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                            src={recipe.imageUrl || '/default-recipe.png'}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-[#191d19]">{recipe.title}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#cefdc7] text-[#40683e] text-xs font-bold">
                          {recipe.tags || 'Món ăn'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold">
                        {recipe.difficulty}
                      </td>
                      <td className="px-6 py-5 text-sm text-[#42493f]">
                        {recipe.servings} phần • {recipe.prepTime} phút
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(recipe)}
                            className="p-2 text-[#396938] hover:bg-emerald-50 rounded-xl transition-all"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(recipe.id)}
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
          <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#191d19]">
                {isEditing ? 'Cập Nhật Công Thức' : 'Thêm Công Thức Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Tên Món Ăn</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Phân loại / Tag</label>
                  <input
                    type="text"
                    placeholder="Món chính, Món canh, Breakfast,..."
                    className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Mô Tả Ngắn</label>
                <textarea
                  rows="2"
                  className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Độ Khó</label>
                  <select
                    className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option>Dễ</option>
                    <option>Trung Bình</option>
                    <option>Khó</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Chuẩn Bị (phút)</label>
                  <input
                    type="number"
                    className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Calories</label>
                  <input
                    type="number"
                    className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Khẩu Phần (người)</label>
                  <input
                    type="number"
                    className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Hình Ảnh Công Thức</label>
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-16 rounded-xl overflow-hidden shadow-xs bg-gray-100 border flex items-center justify-center shrink-0">
                    {formData.imageUrl ? (
                      <img className="w-full h-full object-cover" src={formData.imageUrl} />
                    ) : (
                      <span className="material-symbols-outlined text-gray-400">image</span>
                    )}
                  </div>
                  <div className="grow">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="recipe-image-input"
                      onChange={handleImageChange}
                      disabled={uploading}
                    />
                    <label
                      htmlFor="recipe-image-input"
                      className="inline-block bg-[#f2f5ee] hover:bg-[#e6e9e2] border border-[#c1c9bc] rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition-all"
                    >
                      {uploading ? 'Đang tải ảnh...' : 'Chọn ảnh / Tải lên'}
                    </label>
                    <input
                      type="text"
                      placeholder="Hoặc dán URL ảnh trực tiếp..."
                      className="w-full mt-2 bg-[#f2f5ee] border-none rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-[#396938]"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#42493f] uppercase tracking-wider mb-2">Hướng Dẫn Nấu Ăn</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Bước 1: Sơ chế...&#10;Bước 2: Nấu nước..."
                  className="w-full bg-[#f2f5ee] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#396938]"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>

              <div className="pt-4 border-t border-[#c1c9bc] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-[#c1c9bc] rounded-xl text-sm font-bold text-[#42493f] hover:bg-gray-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#396938] hover:bg-[#215023] text-white rounded-xl text-sm font-bold transition-all shadow-xs"
                >
                  {isEditing ? 'Lưu Thay Đổi' : 'Thêm Công Thức'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

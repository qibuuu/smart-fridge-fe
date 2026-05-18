import React, { useEffect, useState } from 'react';
import ModernAdminLayout from './components/ModernAdminLayout';
import { getAllRecipes, createRecipe, updateRecipe, deleteRecipe, uploadImage } from '../../api/recipes';
import { useAuth } from '../../context/AuthContext';

export default function ModernManageRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Expanded row tracking state
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

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
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (e, recipe) => {
    e.stopPropagation(); // Avoid triggering row expansion
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
    setIsDrawerOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Avoid triggering row expansion
    if (window.confirm('Bạn có chắc chắn muốn xóa công thức này?')) {
      try {
        await deleteRecipe(id);
        fetchRecipes();
        if (expandedRecipeId === id) setExpandedRecipeId(null);
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
      setIsDrawerOpen(false);
      fetchRecipes();
    } catch (err) {
      console.error(err);
      alert('Lưu công thức thất bại.');
    }
  };

  const toggleExpandRecipe = (id) => {
    if (expandedRecipeId === id) {
      setExpandedRecipeId(null);
    } else {
      setExpandedRecipeId(id);
    }
  };

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModernAdminLayout>
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-[#191d19] tracking-tight bg-gradient-to-r from-[#191d19] to-[#396938] bg-clip-text text-transparent">
            Recipe Management
          </h2>
          <p className="text-[#42493f] mt-1 font-medium">Review, create, and organize your system's culinary recipes.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#396938] hover:bg-[#215023] text-white px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Add New Recipe</span>
        </button>
      </div>

      {/* Bento Layout Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider block">Total Recipes</span>
          <span className="text-3xl font-black text-[#396938] mt-2">{recipes.length}</span>
        </div>
        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider block">Main Dishes</span>
          <span className="text-3xl font-black text-[#40683e] mt-2">
            {recipes.filter(r => r.tags?.toLowerCase().includes('chính') || r.tags?.toLowerCase().includes('main')).length}
          </span>
        </div>
        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider block">Easy Level</span>
          <span className="text-3xl font-black text-[#735858] mt-2">
            {recipes.filter(r => r.difficulty?.toLowerCase().includes('dễ') || r.difficulty?.toLowerCase().includes('easy')).length}
          </span>
        </div>
        <div className="border border-white/40 backdrop-blur-xs bg-white/70 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#5f665b] uppercase tracking-wider block">Avg. Prep Time</span>
          <span className="text-3xl font-black text-[#396938] mt-2">
            {recipes.length ? Math.round(recipes.reduce((acc, curr) => acc + (curr.prepTime || 0), 0) / recipes.length) : 0}m
          </span>
        </div>
      </div>

      {/* Glassmorphic Search / Filter bar */}
      <div className="border border-white/50 backdrop-blur-md bg-white/60 p-5 rounded-2xl mb-8 flex gap-4 items-center shadow-xs">
        <span className="material-symbols-outlined text-[#5f665b]">search</span>
        <input
          type="text"
          placeholder="Tìm kiếm công thức nấu ăn bằng tên hoặc nguyên liệu..."
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

      {/* Recipes Glassmorphic Table Container */}
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
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Image</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Name</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Tags</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Difficulty</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest">Servings & Prep</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#42493f] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e9e2]/60">
                {filteredRecipes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-[#5f665b] font-bold">
                      Không tìm thấy công thức nào trong dữ liệu.
                    </td>
                  </tr>
                ) : (
                  filteredRecipes.map((recipe) => {
                    const isExpanded = expandedRecipeId === recipe.id;
                    return (
                      <React.Fragment key={recipe.id}>
                        {/* Interactive Row */}
                        <tr 
                          onClick={() => toggleExpandRecipe(recipe.id)}
                          className={`hover:bg-[#f7faf3]/60 cursor-pointer transition-colors duration-200 group ${
                            isExpanded ? 'bg-[#c8ffc0]/10' : ''
                          }`}
                        >
                          <td className="px-8 py-5">
                            <div className="w-16 h-12 rounded-xl overflow-hidden shadow-sm bg-[#e6e9e2] border border-[#c1c9bc]/20 group-hover:scale-[1.04] transition-transform duration-300">
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
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-[#191d19] group-hover:text-[#396938] transition-colors leading-tight">
                                {recipe.title}
                              </span>
                              <span className="text-[10px] text-[#5f665b] font-bold mt-1 tracking-wide">
                                ID: #{recipe.id}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#cefdc7]/50 text-[#215023] text-xs font-bold border border-[#cefdc7]">
                              {recipe.tags || 'Món ăn'}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              recipe.difficulty?.toLowerCase().includes('dễ') || recipe.difficulty?.toLowerCase().includes('easy')
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                                : recipe.difficulty?.toLowerCase().includes('khó') || recipe.difficulty?.toLowerCase().includes('hard')
                                ? 'bg-rose-50 text-rose-700 border-rose-200/50'
                                : 'bg-amber-50 text-amber-700 border-amber-200/50'
                            }`}>
                              {recipe.difficulty}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm text-[#42493f] font-semibold">
                            {recipe.servings} phần • {recipe.prepTime} phút
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => handleOpenEdit(e, recipe)}
                                className="p-2 text-[#396938] hover:bg-[#c8ffc0] rounded-xl transition-all"
                                title="Edit"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, recipe.id)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                title="Delete"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Collapsible Row Detail Block */}
                        {isExpanded && (
                          <tr className="bg-[#fcfdfa]/80">
                            <td colSpan="6" className="px-8 py-6 border-b border-[#c1c9bc]/20">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-1.5 duration-200">
                                <div>
                                  <h6 className="text-xs font-black text-[#191d19] uppercase tracking-widest flex items-center gap-1.5 mb-3">
                                    <span className="material-symbols-outlined text-[#396938] text-[16px]">menu_book</span>
                                    Mô tả món ăn
                                  </h6>
                                  <p className="text-xs text-[#42493f] leading-relaxed bg-white/50 p-4 rounded-xl border border-[#c1c9bc]/15 shadow-2xs font-medium">
                                    {recipe.description || 'Không có mô tả chi tiết cho công thức này.'}
                                  </p>
                                </div>
                                <div>
                                  <h6 className="text-xs font-black text-[#191d19] uppercase tracking-widest flex items-center gap-1.5 mb-3">
                                    <span className="material-symbols-outlined text-[#396938] text-[16px]">cooking</span>
                                    Hướng dẫn nấu ăn
                                  </h6>
                                  <p className="text-xs text-[#42493f] leading-relaxed whitespace-pre-line bg-white/50 p-4 rounded-xl border border-[#c1c9bc]/15 shadow-2xs font-medium">
                                    {recipe.instructions || 'Chưa cung cấp các bước hướng dẫn chi tiết.'}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Glassmorphic Sliding Drawer (Drawer trượt từ bên phải) */}
      {isDrawerOpen && (
        <>
          {/* Backdrop screen cover */}
          <div 
            className="fixed inset-0 z-40 bg-[#191d19]/25 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer container */}
          <div 
            className="fixed inset-y-0 right-0 w-full sm:w-[680px] z-50 bg-white shadow-2xl border-l border-[#c1c9bc]/30 flex flex-col justify-between animate-in slide-in-from-right duration-300"
          >
            {/* Header of Drawer */}
            <div className="px-8 py-6 border-b border-[#c1c9bc]/20 bg-[#f2f5ee]/40 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#191d19] tracking-tight">
                  {isEditing ? 'Hiệu chỉnh Công thức' : 'Tạo Công thức Mới'}
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

            {/* Form Fields Scroller */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-6">
              {/* Image upload with Live Preview */}
              <div className="flex flex-col sm:flex-row gap-6 items-center bg-[#f7faf3] p-5 rounded-2xl border border-[#c1c9bc]/30">
                <div className="w-32 h-24 rounded-xl overflow-hidden bg-[#e6e9e2] border border-[#c1c9bc]/30 flex items-center justify-center shrink-0 shadow-inner relative">
                  <img
                    alt="Upload Preview"
                    className="w-full h-full object-cover"
                    src={formData.imageUrl || '/default-recipe.png'}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200';
                    }}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-[#191d19]/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white animate-spin">sync</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Ảnh đại diện công thức</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="recipe-file-input"
                  />
                  <label
                    htmlFor="recipe-file-input"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c1c9bc] hover:border-[#396938] hover:bg-[#c8ffc0]/10 rounded-xl cursor-pointer text-xs font-bold text-[#42493f] transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                    Tải ảnh lên hệ thống
                  </label>
                  <p className="text-[10px] text-[#5f665b] mt-2 font-medium">Hỗ trợ các định dạng tiêu chuẩn (PNG, JPG). Dung lượng tối đa 5MB.</p>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Tên công thức món ăn *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phở Bò Hà Nội Cổ Truyền"
                  className="w-full border border-[#c1c9bc] focus:border-[#396938] focus:ring-1 focus:ring-[#396938] rounded-xl px-4 py-3 text-sm transition-all focus:outline-hidden"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Flex Grid inputs for metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Độ khó</label>
                  <select
                    className="w-full border border-[#c1c9bc] focus:border-[#396938] rounded-xl px-4 py-3 text-sm focus:outline-hidden bg-white"
                    value={formData.difficulty}
                    onChange={(e) => setFormData((prev) => ({ ...prev, difficulty: e.target.value }))}
                  >
                    <option value="Dễ">Dễ (Easy)</option>
                    <option value="Trung bình">Trung bình (Medium)</option>
                    <option value="Khó">Khó (Hard)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Thời gian (Phút)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-[#c1c9bc] focus:border-[#396938] rounded-xl px-4 py-3 text-sm focus:outline-hidden"
                    value={formData.prepTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Calories (Kcal)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-[#c1c9bc] focus:border-[#396938] rounded-xl px-4 py-3 text-sm focus:outline-hidden"
                    value={formData.calories}
                    onChange={(e) => setFormData((prev) => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Khẩu phần (Người)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-[#c1c9bc] focus:border-[#396938] rounded-xl px-4 py-3 text-sm focus:outline-hidden"
                    value={formData.servings}
                    onChange={(e) => setFormData((prev) => ({ ...prev, servings: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Nhóm / Phân loại</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Món Chính, Món Khai Vị"
                    className="w-full border border-[#c1c9bc] focus:border-[#396938] rounded-xl px-4 py-3 text-sm focus:outline-hidden"
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
              </div>

              {/* Description field */}
              <div>
                <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Mô tả ngắn gọn</label>
                <textarea
                  placeholder="Tóm tắt một vài câu về hương vị hay nguồn gốc của món ăn..."
                  rows="3"
                  className="w-full border border-[#c1c9bc] focus:border-[#396938] rounded-xl px-4 py-3 text-sm focus:outline-hidden resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Instructions field */}
              <div>
                <label className="text-xs font-black text-[#191d19] uppercase tracking-wider block mb-2">Các bước thực hiện *</label>
                <textarea
                  required
                  placeholder="Bước 1: Sơ chế hành, tỏi, gừng...\nBước 2: Ninh xương lấy nước ngọt..."
                  rows="6"
                  className="w-full border border-[#c1c9bc] focus:border-[#396938] rounded-xl px-4 py-3 text-sm focus:outline-hidden font-mono text-xs leading-relaxed"
                  value={formData.instructions}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
                />
              </div>
            </form>

            {/* Footer action drawer */}
            <div className="px-8 py-6 border-t border-[#c1c9bc]/20 bg-[#f2f5ee]/40 flex gap-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-grow bg-[#396938] hover:bg-[#215023] text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Lưu thông tin</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-3.5 border border-[#c1c9bc] hover:bg-[#e6e9e2] rounded-xl font-bold text-[#42493f] text-sm transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </>
      )}
    </ModernAdminLayout>
  );
}

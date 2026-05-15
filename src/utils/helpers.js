import { API_BASE_URL, DEFAULT_FOOD_IMAGE } from '../constants';

/**
 * Resolve ảnh từ backend hoặc URL đầy đủ.
 * VD: "/uploads/photo.jpg" → "http://localhost:8080/uploads/photo.jpg"
 */
export const resolveImageUrl = (url, fallback = DEFAULT_FOOD_IMAGE) => {
  if (!url) return fallback;
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
};

/**
 * Parse chuỗi nguyên liệu backend trả về thành object.
 * VD: "300 g Thịt bò" → { amount: 300, unit: 'g', name: 'Thịt bò' }
 */
export const parseIngredientString = (str) => {
  const parts = str.split(' ');
  return {
    amount:  parseFloat(parts[0]) || 0,
    unit:    parts[1] || '',
    name:    parts.slice(2).join(' ') || str,
  };
};

/**
 * Build cart payload từ chuỗi nguyên liệu.
 */
export const parseIngredient = (ingString) => {
  const { amount, unit, name } = parseIngredientString(ingString);
  return { ingredientName: name, amount, unit };
};

/**
 * Loại bỏ dấu tiếng Việt để tìm kiếm không dấu.
 */
export const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

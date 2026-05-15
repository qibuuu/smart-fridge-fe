import apiClient from './apiClient';

export const getAllRecipes = (keyword = '') =>
  apiClient.get('/recipes', { params: keyword ? { keyword } : {} });

export const getRecipeById = (id) => apiClient.get(`/recipes/${id}`);

export const createRecipe = (data) => apiClient.post('/recipes', data);

export const updateRecipe = (id, data) => apiClient.put(`/recipes/${id}`, data);

export const deleteRecipe = (id) => apiClient.delete(`/recipes/${id}`);

export const suggestByIngredients = (ingredients) =>
  apiClient.get('/recipes/suggest', { params: { ingredients } });

export const createCustomRecipe = (data) => apiClient.post('/recipes/my-kitchen', data);

export const getMyRecipes = () => apiClient.get('/recipes/my-recipes');

export const updateCustomRecipe = (id, data) => apiClient.put(`/recipes/my-kitchen/${id}`, data);

export const deleteCustomRecipe = (id) => apiClient.delete(`/recipes/my-kitchen/${id}`);

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/recipes/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

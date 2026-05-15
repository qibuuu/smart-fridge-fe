import apiClient from './apiClient';

export const getMyFavorites = () => apiClient.get('/favorites/my-list');

export const toggleFavorite = (recipeId) => apiClient.post(`/favorites/${recipeId}`);

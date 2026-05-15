import { useState, useEffect } from 'react';
import { getMyFavorites, toggleFavorite } from '../api/favorites';
import { useAuth } from '../context/AuthContext';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated }       = useAuth();

  useEffect(() => {
    if (!isAuthenticated) { setFavorites([]); return; }
    getMyFavorites()
      .then(res => setFavorites(res.data || []))
      .catch(() => setFavorites([]));
  }, [isAuthenticated]);

  const toggle = async (recipeId) => {
    await toggleFavorite(recipeId);
    setFavorites(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const isFavorite = (recipeId) => favorites.includes(recipeId);

  return { 
    favorites, 
    items: favorites, // Alias for MyKitchenPage
    isFavorite, 
    toggle,
    toggleFav: toggle // Alias for MyKitchenPage
  };
}

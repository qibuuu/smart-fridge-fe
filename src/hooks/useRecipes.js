import { useState, useEffect, useCallback } from 'react';
import { 
  getAllRecipes, 
  getRecipeById, 
  getMyRecipes, 
  createCustomRecipe, 
  updateCustomRecipe, 
  deleteCustomRecipe,
  uploadImage
} from '../api/recipes';

export function useRecipes(initialKeyword = '') {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (keyword = initialKeyword) => {
    setLoading(true);
    try {
      const res = await getAllRecipes(keyword);
      setRecipes(res.data || []);
      return res;
    } catch (err) {
      setError(err);
      return { data: [] };
    } finally {
      setLoading(false);
    }
  }, [initialKeyword]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const list = () => getAllRecipes();
  const listMyRecipes = () => getMyRecipes();
  const getById = (id) => getRecipeById(id);
  const create = (data) => createCustomRecipe(data);
  const update = (id, data) => updateCustomRecipe(id, data);
  const remove = (id) => deleteCustomRecipe(id);
  const upload = (file) => uploadImage(file);

  return { 
    recipes, 
    loading, 
    error, 
    refetch: fetchAll,
    list,
    listMyRecipes,
    getById,
    create,
    update,
    remove,
    upload
  };
}

export function useRecipeDetail(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getRecipeById(id)
      .then(res => setRecipe(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  return { recipe, loading, error };
}

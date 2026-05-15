import { useState, useCallback } from 'react';
import apiClient from '../api/apiClient';

export function useMealPlan() {
  const [loading, setLoading] = useState(false);

  const getMyPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/meal-plans');
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPlan = async (recipeId, dayOfWeek, mealType) => {
    const res = await apiClient.post('/meal-plans', { recipeId, dayOfWeek, mealType });
    return res.data;
  };

  const removePlan = async (id) => {
    await apiClient.delete(`/meal-plans/${id}`);
  };

  const exportToCart = async () => {
    await apiClient.post('/meal-plans/export-to-cart');
  };

  return { loading, getMyPlans, addPlan, removePlan, exportToCart };
}

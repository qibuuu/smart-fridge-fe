import { useState, useEffect } from 'react';
import { getMyFridge, addToFridge, deleteFromFridge, suggestFromFridge } from '../api/fridge';

export function useFridge() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyFridge()
      .then(res => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const add = async (data) => {
    const res = await addToFridge(data);
    setItems(prev => [...prev, res.data]);
    return res.data;
  };

  const remove = async (id) => {
    await deleteFromFridge(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const suggest = () => suggestFromFridge();

  const clearAll = async () => {
    // Delete items sequentially to be safer
    for (const item of items) {
      await deleteFromFridge(item.id);
    }
    setItems([]);
  };

  return { items, loading, add, remove, clearAll, suggest };
}

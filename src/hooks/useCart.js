import { useState, useEffect } from 'react';
import { getCart, addToCart, toggleCartItem, deleteCartItem } from '../api/cart';

export function useCart() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart()
      .then(res => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const add = async (data) => {
    const res = await addToCart(data);
    setItems(prev => [...prev, res.data]);
  };

  const toggle = async (id) => {
    const res = await toggleCartItem(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, bought: res.data.bought } : i));
  };

  const remove = async (id) => {
    await deleteCartItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const removePurchased = async () => {
    const purchased = items.filter(i => i.bought);
    await Promise.all(purchased.map(i => deleteCartItem(i.id)));
    setItems(prev => prev.filter(i => !i.bought));
  };

  return { 
    items, 
    loading, 
    add, 
    toggle, 
    remove, 
    removePurchased,
    clearBought: removePurchased // Alias for ShoppingCartPage
  };
}

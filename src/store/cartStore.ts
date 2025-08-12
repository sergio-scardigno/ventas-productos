import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Si el producto ya existe, actualizar cantidad
            const updatedItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            const newTotal = updatedItems.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );
            return { items: updatedItems, total: newTotal };
          } else {
            // Si es un producto nuevo, agregarlo
            const newItem: CartItem = { product, quantity };
            const newItems = [...state.items, newItem];
            const newTotal = newItems.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );
            return { items: newItems, total: newTotal };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.product.id !== productId
          );
          const newTotal = updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          return { items: updatedItems, total: newTotal };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          );
          const newTotal = updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          return { items: updatedItems, total: newTotal };
        });
      },

      clearCart: () => {
        set({ items: [], total: 0 });
      },

      getItemQuantity: (productId: string) => {
        const state = get();
        const item = state.items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
); 
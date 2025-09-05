'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, getItemQuantity } = useCartStore();
  const currentQuantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
          }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Sin Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        {product.stock > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="p-1 rounded-full bg-gray-700 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium text-gray-900">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                className="p-1 rounded-full bg-gray-700 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Agregar al Carrito</span>
            </button>
            
            {currentQuantity > 0 && (
              <div className="text-center text-sm text-green-600 font-medium">
                {currentQuantity} en el carrito
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
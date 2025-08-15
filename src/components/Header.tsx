'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import Cart from './Cart';

export default function Header() {
  const { items } = useCartStore();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Ventas Productos
            </Link>
          </div>

          {/* Carrito */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Productos
            </Link>
            <Cart />
          </div>
        </div>
      </div>
    </header>
  );
} 
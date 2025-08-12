'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const [paymentId, setPaymentId] = useState<string>('');

  useEffect(() => {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIdParam = urlParams.get('payment_id');
    const statusParam = urlParams.get('status');
    
    if (paymentIdParam) {
      setPaymentId(paymentIdParam);
    }

    // Limpiar el carrito del localStorage
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600">
            Tu pago ha sido procesado correctamente.
          </p>
          {paymentId && (
            <p className="text-sm text-gray-500 mt-2">
              ID de pago: {paymentId}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Inicio
          </Link>
          
          <Link
            href="/"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
} 
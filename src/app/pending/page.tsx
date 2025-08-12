'use client';

import { useEffect, useState } from 'react';
import { Clock, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PendingPage() {
  const [paymentId, setPaymentId] = useState<string>('');

  useEffect(() => {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIdParam = urlParams.get('payment_id');
    
    if (paymentIdParam) {
      setPaymentId(paymentIdParam);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pago Pendiente
          </h1>
          <p className="text-gray-600">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
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
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Verificar Estado
          </button>
        </div>
      </div>
    </div>
  );
} 
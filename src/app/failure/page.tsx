'use client';

import { useEffect, useState } from 'react';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function FailurePage() {
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      setErrorMessage(decodeURIComponent(errorParam));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pago Fallido
          </h1>
          <p className="text-gray-600">
            No se pudo procesar tu pago. Por favor, inténtalo de nuevo.
          </p>
          {errorMessage && (
            <p className="text-sm text-red-500 mt-2">
              Error: {errorMessage}
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
            onClick={() => window.history.back()}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Intentar de Nuevo
          </button>
        </div>
      </div>
    </div>
  );
} 
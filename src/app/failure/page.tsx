'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, AlertTriangle, Home, RefreshCw, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function FailurePage() {
  const searchParams = useSearchParams();
  const [errorData, setErrorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');
    const paymentType = searchParams.get('payment_type');
    const merchantOrderId = searchParams.get('merchant_order_id');

    setErrorData({
      paymentId,
      status,
      externalReference,
      paymentType,
      merchantOrderId,
      timestamp: new Date().toLocaleString('es-AR')
    });

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Procesando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icono de error */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pago No Procesado
        </h1>
        
        <p className="text-gray-600 mb-6">
          No pudimos procesar tu pago. No te preocupes, no se realizó ningún cargo.
        </p>

        {/* Información del error */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-red-900 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Detalles del Error
          </h3>
          
          <div className="space-y-2 text-sm">
            {errorData?.paymentId && (
              <div className="flex justify-between">
                <span className="text-red-700">ID de Pago:</span>
                <span className="font-mono text-red-900">{errorData.paymentId}</span>
              </div>
            )}
            
            {errorData?.externalReference && (
              <div className="flex justify-between">
                <span className="text-red-700">Referencia:</span>
                <span className="font-mono text-red-900">{errorData.externalReference}</span>
              </div>
            )}
            
            {errorData?.status && (
              <div className="flex justify-between">
                <span className="text-red-700">Estado:</span>
                <span className="text-red-600 font-semibold capitalize">{errorData.status}</span>
              </div>
            )}
            
            {errorData?.timestamp && (
              <div className="flex justify-between">
                <span className="text-red-700">Fecha:</span>
                <span className="text-red-900">{errorData.timestamp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje de ayuda */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>¿Qué puedes hacer?</strong>
          </p>
          <ul className="text-blue-700 text-sm mt-2 space-y-1 text-left">
            <li>• Verificar que tu tarjeta tenga fondos suficientes</li>
            <li>• Revisar que los datos de la tarjeta sean correctos</li>
            <li>• Intentar con otro método de pago</li>
            <li>• Contactar a tu banco si el problema persiste</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Intentar de Nuevo
          </button>
          
          <Link
            href="/"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Volver a la Tienda
          </Link>
        </div>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center text-blue-600 hover:text-blue-700 cursor-pointer">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">¿Necesitas ayuda?</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Si el problema persiste, contacta a nuestro equipo de soporte.
          </p>
        </div>
      </div>
    </div>
  );
} 
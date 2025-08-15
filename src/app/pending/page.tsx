'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, AlertCircle, Home, RefreshCw, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PendingPage() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');
    const paymentType = searchParams.get('payment_type');
    const merchantOrderId = searchParams.get('merchant_order_id');

    setPaymentData({
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Procesando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icono de pendiente */}
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pago en Proceso
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos cuando se complete.
        </p>

        {/* Información del pago */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Detalles del Pago
          </h3>
          
          <div className="space-y-2 text-sm">
            {paymentData?.paymentId && (
              <div className="flex justify-between">
                <span className="text-yellow-700">ID de Pago:</span>
                <span className="font-mono text-yellow-900">{paymentData.paymentId}</span>
              </div>
            )}
            
            {paymentData?.externalReference && (
              <div className="flex justify-between">
                <span className="text-yellow-700">Referencia:</span>
                <span className="font-mono text-yellow-900">{paymentData.externalReference}</span>
              </div>
            )}
            
            {paymentData?.status && (
              <div className="flex justify-between">
                <span className="text-yellow-700">Estado:</span>
                <span className="text-yellow-600 font-semibold capitalize">{paymentData.status}</span>
              </div>
            )}
            
            {paymentData?.timestamp && (
              <div className="flex justify-between">
                <span className="text-yellow-700">Fecha:</span>
                <span className="text-yellow-900">{paymentData.timestamp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje informativo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>¿Qué significa esto?</strong>
          </p>
          <ul className="text-blue-700 text-sm mt-2 space-y-1 text-left">
            <li>• Tu pago está siendo verificado por el sistema</li>
            <li>• Puede tomar entre 5 minutos y 24 horas</li>
            <li>• Recibirás una notificación por email</li>
            <li>• No se realizará ningún cargo hasta confirmar</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Verificar Estado
          </button>
          
          <Link
            href="/"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
            Si tienes dudas sobre el estado de tu pago, contacta a nuestro equipo de soporte.
          </p>
        </div>
      </div>
    </div>
  );
} 
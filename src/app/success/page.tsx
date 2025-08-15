'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ShoppingBag, Home, Receipt } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');
    const paymentType = searchParams.get('payment_type');
    const merchantOrderId = searchParams.get('merchant_order_id');

    setOrderData({
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Procesando confirmación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icono de éxito */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu compra ha sido procesada correctamente
        </p>

        {/* Información del pago */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Receipt className="w-4 h-4 mr-2" />
            Detalles del Pago
          </h3>
          
          <div className="space-y-2 text-sm">
            {orderData?.paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-600">ID de Pago:</span>
                <span className="font-mono text-gray-900">{orderData.paymentId}</span>
              </div>
            )}
            
            {orderData?.externalReference && (
              <div className="flex justify-between">
                <span className="text-gray-600">Referencia:</span>
                <span className="font-mono text-gray-900">{orderData.externalReference}</span>
              </div>
            )}
            
            {orderData?.status && (
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="text-green-600 font-semibold capitalize">{orderData.status}</span>
              </div>
            )}
            
            {orderData?.paymentType && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="text-gray-900 capitalize">{orderData.paymentType}</span>
              </div>
            )}
            
            {orderData?.timestamp && (
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="text-gray-900">{orderData.timestamp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje de confirmación */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            <strong>Importante:</strong> Recibirás un email de confirmación con todos los detalles de tu compra.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Volver a la Tienda
          </Link>
          
          <button
            onClick={() => window.print()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Imprimir Comprobante
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Si tienes alguna pregunta sobre tu compra, contacta a nuestro equipo de soporte.
          </p>
        </div>
      </div>
    </div>
  );
} 
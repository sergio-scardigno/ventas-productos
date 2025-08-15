'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Receipt } from 'lucide-react';
import Link from 'next/link';

interface OrderData {
  paymentId: string | null;
  status: string | null;
  externalReference: string | null;
  paymentType: string | null;
  merchantOrderId: string | null;
  timestamp: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    if (!searchParams) return;
    
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        {/* Icono de éxito */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Pago Exitoso!
        </h1>
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. ¡Gracias por tu compra!
        </p>

        {/* Información del pago */}
        {orderData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Receipt className="w-4 h-4 mr-2 text-green-500" />
              Detalles del Pago
            </h3>
            
            {orderData.paymentId && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">ID de Pago:</span> {orderData.paymentId}
              </p>
            )}
            
            {orderData.status && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Estado:</span> {orderData.status}
              </p>
            )}
            
            {orderData.externalReference && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Referencia:</span> {orderData.externalReference}
              </p>
            )}
            
            {orderData.paymentType && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Tipo de Pago:</span> {orderData.paymentType}
              </p>
            )}
            
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Hora:</span> {orderData.timestamp}
            </p>
          </div>
        )}

        {/* Mensaje de confirmación */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            <strong>¿Qué sigue?</strong>
          </p>
          <ul className="text-green-700 text-sm mt-2 space-y-1 text-left">
            <li>• Recibirás un email de confirmación</li>
            <li>• Tu orden está siendo procesada</li>
            <li>• Te notificaremos cuando esté lista</li>
            <li>• Guarda esta información para seguimiento</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Seguir Comprando
          </Link>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
} 
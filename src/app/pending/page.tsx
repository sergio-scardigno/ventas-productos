'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, AlertCircle, Home, RefreshCw, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface PaymentData {
  paymentId: string | null;
  status: string | null;
  externalReference: string | null;
  paymentType: string | null;
  merchantOrderId: string | null;
  timestamp: string;
}

function PendingPageContent() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    if (!searchParams) return;
    
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        {/* Icono de pendiente */}
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pago Pendiente
        </h1>
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos cuando se complete.
        </p>

        {/* Información del pago */}
        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
              Detalles del Pago
            </h3>
            
            {paymentData.paymentId && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">ID de Pago:</span> {paymentData.paymentId}
              </p>
            )}
            
            {paymentData.status && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Estado:</span> {paymentData.status}
              </p>
            )}
            
            {paymentData.externalReference && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Referencia:</span> {paymentData.externalReference}
              </p>
            )}
            
            {paymentData.paymentType && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Tipo de Pago:</span> {paymentData.paymentType}
              </p>
            )}
            
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Hora:</span> {paymentData.timestamp}
            </p>
          </div>
        )}

        {/* Mensaje informativo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>¿Qué significa esto?</strong>
          </p>
          <ul className="text-blue-700 text-sm mt-2 space-y-1 text-left">
            <li>• Tu pago está siendo revisado por el banco</li>
            <li>• Esto puede tomar de 24 a 48 horas</li>
            <li>• Recibirás una notificación cuando se complete</li>
            <li>• No se realizará ningún cargo hasta que se confirme</li>
          </ul>
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
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar Estado
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" />
            ¿Necesitas Ayuda?
          </h4>
          <p className="text-sm text-blue-700">
            Si tienes preguntas sobre tu pago pendiente, contacta con nuestro soporte.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <PendingPageContent />
    </Suspense>
  );
} 
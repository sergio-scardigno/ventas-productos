'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, AlertTriangle, Home, RefreshCw, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface ErrorData {
  paymentId: string | null;
  status: string | null;
  externalReference: string | null;
  paymentType: string | null;
  merchantOrderId: string | null;
  timestamp: string;
}

function FailurePageContent() {
  const searchParams = useSearchParams();
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    if (!searchParams) return;
    
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        {/* Icono de error */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pago Fallido
        </h1>
        <p className="text-gray-600 mb-6">
          Lo sentimos, no pudimos procesar tu pago. Revisa los detalles a continuación.
        </p>

        {/* Información del pago */}
        {errorData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
              Detalles del Pago
            </h3>
            
            {errorData.paymentId && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">ID de Pago:</span> {errorData.paymentId}
              </p>
            )}
            
            {errorData.status && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Estado:</span> {errorData.status}
              </p>
            )}
            
            {errorData.externalReference && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Referencia:</span> {errorData.externalReference}
              </p>
            )}
            
            {errorData.paymentType && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Tipo de Pago:</span> {errorData.paymentType}
              </p>
            )}
            
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Hora:</span> {errorData.timestamp}
            </p>
          </div>
        )}

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
            Intentar de Nuevo
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" />
            ¿Necesitas Ayuda?
          </h4>
          <p className="text-sm text-blue-700">
            Si tienes problemas con tu pago, contacta con nuestro soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <FailurePageContent />
    </Suspense>
  );
} 
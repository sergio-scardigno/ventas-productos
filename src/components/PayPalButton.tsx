'use client';

import { useEffect, useRef, useState } from 'react';
import { CartItem } from '@/types';

interface PayPalButtonProps {
  items: CartItem[];
  total: number;
  onSuccess: (orderId: string) => void;
  onError: (error: unknown) => void;
}

interface PayPalOrder {
  id: string;
  status: string;
}

interface PayPalActions {
  order: {
    create: (data: unknown) => Promise<string>;
    capture: () => Promise<PayPalOrder>;
  };
}

interface PayPalSDK {
  Buttons: (config: {
    createOrder: (data: unknown, actions: PayPalActions) => Promise<string>;
    onApprove: (data: PayPalOrder, actions: PayPalActions) => Promise<void>;
    onError: (error: unknown) => void;
  }) => {
    render: (container: HTMLDivElement) => void;
  };
}

export default function PayPalButton({ items, total, onSuccess, onError }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    // Verificar que existe el Client ID de PayPal
    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      console.error('❌ NEXT_PUBLIC_PAYPAL_CLIENT_ID no está configurado');
      onError(new Error('Configuración de PayPal incompleta'));
      return;
    }

    // Cargar PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => {
      console.error('❌ Error al cargar PayPal SDK');
      onError(new Error('Error al cargar PayPal'));
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onError]);

  useEffect(() => {
    if (!paypalLoaded || !paypalButtonRef.current) return;

    // Configurar PayPal
    const paypal = (window as unknown as { paypal: PayPalSDK }).paypal;
    if (!paypal) return;

    try {
      paypal.Buttons({
        onInit: (data: unknown, actions: PayPalActions) => {
          console.log('✅ PayPal inicializado correctamente');
          return Promise.resolve();
        },
        createOrder: (data: unknown, actions: PayPalActions) => {
          try {
                         return actions.order.create({
               purchase_units: [
                 {
                   amount: {
                     value: (total / 100).toFixed(2), // Convertir centavos a dólares
                     currency_code: 'USD',
                     breakdown: {
                       item_total: {
                         value: (total / 100).toFixed(2), // Total de los items
                         currency_code: 'USD'
                       }
                     }
                   },
                   description: `Compra de ${items.length} producto(s)`,
                   items: items.map((item) => ({
                     name: item.product.name,
                     quantity: item.quantity.toString(),
                     unit_amount: {
                       value: (item.product.price / 100).toFixed(2), // Convertir centavos a dólares
                       currency_code: 'USD'
                     }
                   }))
                 }
               ]
             });
          } catch (error) {
            console.error('❌ Error al crear orden:', error);
            setError('Error al crear orden de PayPal');
            throw error;
          }
        },
        onApprove: async (data: PayPalOrder, actions: PayPalActions) => {
          try {
            setIsLoading(true);
            setError(null);
            
            // Verificar que tenemos un ID de orden válido
            if (!data || !data.id) {
              console.error('❌ ID de orden inválido:', data);
              throw new Error('ID de orden inválido');
            }
            
            console.log('💰 Capturando orden de PayPal:', data.id);
            
            // Agregar un pequeño delay para evitar problemas de timing
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const order = await actions.order.capture();
            console.log('✅ Orden capturada:', order);
            
            if (order && order.status === 'COMPLETED') {
              console.log('🎉 Pago completado exitosamente');
              onSuccess(order.id || data.id);
            } else {
              console.error('❌ Estado de orden inesperado:', order?.status);
              const errorMsg = `Estado de orden inesperado: ${order?.status || 'desconocido'}`;
              setError(errorMsg);
              onError(new Error(errorMsg));
            }
          } catch (error) {
            console.error('❌ Error al capturar orden:', error);
            
            // Manejar errores específicos de PayPal
            let errorMessage = 'Error al procesar el pago con PayPal';
            if (error instanceof Error) {
              if (error.message.includes('Window closed')) {
                errorMessage = 'La ventana de PayPal se cerró. Inténtalo de nuevo.';
              } else if (error.message.includes('global_session_not_found')) {
                errorMessage = 'Sesión de PayPal expirada. Recarga la página e inténtalo de nuevo.';
              } else {
                errorMessage = error.message;
              }
            }
            
            setError(errorMessage);
            onError(error);
          } finally {
            setIsLoading(false);
          }
        },
        onError: (err: unknown) => {
          console.error('❌ Error en PayPal:', err);
          setError('Error en PayPal. Inténtalo de nuevo.');
          onError(err);
        },
        onCancel: () => {
          console.log('❌ Usuario canceló el pago');
          setError('Pago cancelado por el usuario');
        }
      }).render(paypalButtonRef.current);
    } catch (error) {
      console.error('Error al configurar PayPal:', error);
      setError('Error al configurar PayPal');
      onError(error);
    }
  }, [paypalLoaded, items, total, onSuccess, onError]);

  if (isLoading) {
    return (
      <div className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center">
        Procesando pago...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3">
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => {
            setError(null);
            // Recargar PayPal para crear una nueva sesión
            window.location.reload();
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Reintentar con PayPal
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={paypalButtonRef} className="w-full" />
    </div>
  );
}
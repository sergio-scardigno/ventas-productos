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
  id?: string;
  orderID?: string;
  order_id?: string;
  paymentID?: string;
  status?: string;
  [key: string]: unknown; // Permitir propiedades adicionales
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
    console.log('🔍 Verificando NEXT_PUBLIC_PAYPAL_CLIENT_ID...');
    console.log('🔍 Valor:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'Configurado' : 'No configurado');
    
    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      console.error('❌ NEXT_PUBLIC_PAYPAL_CLIENT_ID no está configurado');
      onError(new Error('Configuración de PayPal incompleta'));
      return;
    }
    
    console.log('✅ NEXT_PUBLIC_PAYPAL_CLIENT_ID configurado correctamente');

    // Cargar PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => {
      console.log('✅ PayPal SDK cargado correctamente');
      setPaypalLoaded(true);
    };
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
    if (!paypal) {
      console.error('❌ PayPal SDK no encontrado en window');
      return;
    }
    
    console.log('🔧 Configurando botones de PayPal...');

    try {
      console.log('🔧 PayPal SDK encontrado:', paypal);
      console.log('🔧 PayPal.Buttons disponible:', typeof paypal.Buttons);
      
      const buttonConfig = {
        createOrder: (data: unknown, actions: PayPalActions) => {
          try {
            console.log('🛒 Creando orden de PayPal...');
            console.log('📊 Datos de la orden:', { total, items: items.length, currency: 'USD' });
            console.log('🔍 Items individuales:', items.map(item => ({ name: item.product.name, price: item.product.price, quantity: item.quantity })));
            
            // Logging completo del objeto actions
            console.log('🔧 Objeto actions recibido:', actions);
            console.log('🔧 actions.order:', actions.order);
            console.log('🔧 actions.order.create:', actions.order?.create);
            console.log('🔧 Tipo de actions.order.create:', typeof actions.order?.create);
            
            // Orden ultra-simplificada para pruebas
            const testOrderData = {
              purchase_units: [
                {
                  amount: {
                    value: "1.00", // Valor fijo de prueba
                    currency_code: "USD"
                  },
                  description: "Test order"
                }
              ]
            };
            
            console.log('📋 Orden de prueba a enviar:', JSON.stringify(testOrderData, null, 2));
            console.log('🔧 Llamando a actions.order.create...');
            
            // Verificar que actions.order.create existe
            if (!actions.order || typeof actions.order.create !== 'function') {
              throw new Error('actions.order.create no es una función');
            }
            
            console.log('🔧 actions.order.create es una función válida');
            const result = actions.order.create(testOrderData);
            console.log('✅ actions.order.create llamado exitosamente');
            
            return result;
          } catch (error) {
            console.error('❌ Error al crear orden:', error);
            console.error('🔍 Detalles del error:', {
              message: error instanceof Error ? error.message : 'Error desconocido',
              stack: error instanceof Error ? error.stack : 'No stack trace',
              error: error
            });
            setError('Error al crear orden de PayPal');
            throw error;
          }
        },
        onApprove: async (data: PayPalOrder, actions: PayPalActions) => {
          try {
            console.log('🎯 onApprove llamado con datos:', data);
            console.log('🔍 Tipo de data:', typeof data);
            console.log('🔍 Data es null/undefined:', data === null || data === undefined);
            console.log('🔍 Data es objeto:', typeof data === 'object');
            console.log('🔍 Propiedades de data:', Object.keys(data || {}));
            console.log('🔍 Data completo (JSON):', JSON.stringify(data, null, 2));
            
            setIsLoading(true);
            setError(null);
            
            // Verificar que tenemos datos de orden válidos
            if (!data) {
              console.error('❌ Datos de orden vacíos:', data);
              throw new Error('Datos de orden vacíos');
            }
            
            // Buscar el ID de orden en diferentes propiedades posibles
            let orderId = null;
            if (data.id) {
              orderId = data.id;
            } else if (data.orderID) {
              orderId = data.orderID;
            } else if (data.order_id) {
              orderId = data.order_id;
            } else if (data.paymentID) {
              orderId = data.paymentID;
            }
            
            console.log('🔍 ID de orden encontrado:', orderId);
            
            if (!orderId) {
              console.error('❌ ID de orden no encontrado en ninguna propiedad:', {
                id: data.id,
                orderID: data.orderID,
                order_id: data.order_id,
                paymentID: data.paymentID
              });
              throw new Error('ID de orden no encontrado');
            }
            
            console.log('💰 Capturando orden de PayPal:', orderId);
            console.log('📋 Datos completos de la orden:', JSON.stringify(data, null, 2));
            
            // Agregar un pequeño delay para evitar problemas de timing
            console.log('⏳ Esperando 1 segundo antes de capturar...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('🔍 Iniciando captura de orden...');
            console.log('🔧 Actions en onApprove:', actions);
            console.log('🔧 actions.order:', actions.order);
            console.log('🔧 actions.order.capture:', actions.order?.capture);
            console.log('🔧 Tipo de actions.order.capture:', typeof actions.order?.capture);
            
            const order = await actions.order.capture();
            console.log('✅ Orden capturada:', order);
            
            if (order && order.status === 'COMPLETED') {
              console.log('🎉 Pago completado exitosamente');
              const finalOrderId = order.id || orderId;
              console.log('🆔 ID de orden final:', finalOrderId);
              onSuccess(finalOrderId);
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
              } else if (error.message.includes('ID de orden')) {
                errorMessage = 'Error en la creación de la orden. Inténtalo de nuevo.';
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
        // Callbacks opcionales que pueden no estar disponibles en todas las versiones
        ...(typeof (window as unknown as { paypal?: { Buttons?: { prototype?: { onInit?: unknown } } } }).paypal?.Buttons?.prototype?.onInit !== 'undefined' && {
          onInit: () => {
            console.log('✅ PayPal inicializado correctamente');
          }
        })
        // Nota: onCancel no está disponible en esta versión del SDK
        // Las cancelaciones se manejan a través de onError
      };
      
      console.log('🔧 Configuración de botones preparada:', buttonConfig);
      console.log('🔧 Renderizando botones...');
      
      paypal.Buttons(buttonConfig).render(paypalButtonRef.current);
      console.log('✅ Botones renderizados exitosamente');
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
          <p className="text-xs text-red-600 mt-1">
            Si el problema persiste, recarga la página
          </p>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => {
              console.log('🔄 Reintentando con PayPal...');
              setError(null);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Reintentar con PayPal
          </button>
          <button
            onClick={() => {
              console.log('🔄 Recargando página para nueva sesión...');
              window.location.reload();
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={paypalButtonRef} className="w-full" />
    </div>
  );
}
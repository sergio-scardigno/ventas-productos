'use client';

import { useEffect, useRef, useState } from 'react';
import { CartItem } from '@/types';

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalButtonProps {
  items: CartItem[];
  total: number;
  userEmail?: string;
  userName?: string;
  onSuccess: (orderId: string) => Promise<void>;
  onError: (error: any) => void;
}

export default function PayPalButton({ 
  items, 
  total, 
  userEmail = '', 
  userName = '',
  onSuccess, 
  onError 
}: PayPalButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const buttonsRendered = useRef(false);

  useEffect(() => {
    // Verificar si el script ya está cargado
    if (window.paypal) {
      setSdkReady(true);
      return;
    }

    // Cargar el script de PayPal
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.async = true;
    
    script.onload = () => {
      setSdkReady(true);
    };

    script.onerror = () => {
      onError(new Error('No se pudo cargar el SDK de PayPal'));
    };

    document.body.appendChild(script);

    // Limpieza
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onError]);

  useEffect(() => {
    if (!sdkReady || !paypalButtonRef.current || buttonsRendered.current) return;

    // Limpiar contenedor
    if (paypalButtonRef.current.hasChildNodes()) {
      paypalButtonRef.current.innerHTML = '';
    }

    // Renderizar botones
    try {
      const buttons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
        },
        createOrder: function(data: any, actions: any) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (total / 100).toFixed(2),
                currency_code: 'USD',
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: (total / 100).toFixed(2)
                  }
                }
              },
              items: items.map(item => ({
                name: item.product.name.substring(0, 127),
                unit_amount: {
                  currency_code: 'USD',
                  value: (item.product.price / 100).toFixed(2),
                },
                quantity: item.quantity.toString(),
                description: item.product.description?.substring(0, 127) || '',
                category: 'DIGITAL_GOODS'
              })),
              description: `Compra de ${items.length} producto(s)`,
            }],
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
          });
        },
        onApprove: async function(data: any, actions: any) {
          try {
            const order = await actions.order.capture();
            
            // Guardar la orden en Google Sheets
            const response = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: order.id,
                items: items.map(item => ({
                  id: item.product.id,
                  name: item.product.name,
                  quantity: item.quantity,
                  price: item.product.price,
                })),
                total,
                userEmail,
                userName,
              }),
            });

            if (!response.ok) {
              throw new Error('Error al guardar la orden');
            }

            await onSuccess(order.id);
          } catch (error) {
            console.error('Error al procesar el pago:', error);
            onError(error);
          }
        },
        onError: function(err: any) {
          console.error('Error en el pago con PayPal:', err);
          onError(err);
        },
        onCancel: function(data: any) {
          console.log('Pago cancelado por el usuario');
          onError(new Error('Pago cancelado por el usuario'));
        }
      });
      
      if (paypalButtonRef.current) {
        buttons.render(paypalButtonRef.current);
        buttonsRendered.current = true;
      }
    } catch (error) {
      console.error('Error al renderizar botones de PayPal:', error);
      onError(error);
    }
  }, [sdkReady, items, total, onSuccess, onError, userEmail, userName]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (paypalButtonRef.current) {
        paypalButtonRef.current.innerHTML = '';
      }
      buttonsRendered.current = false;
    };
  }, []);

  return (
    <div>
      {!sdkReady && <p>Cargando PayPal...</p>}
      <div ref={paypalButtonRef} className="w-full"></div>
    </div>
  );
}
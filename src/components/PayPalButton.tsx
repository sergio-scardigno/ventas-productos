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
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    // Cargar PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!paypalLoaded || !paypalButtonRef.current) return;

    // Configurar PayPal
    const paypal = (window as unknown as { paypal: PayPalSDK }).paypal;
    if (!paypal) return;

    try {
      paypal.Buttons({
        createOrder: (data: unknown, actions: PayPalActions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total.toString(),
                  currency_code: 'USD'
                },
                description: `Compra de ${items.length} producto(s)`,
                items: items.map((item) => ({
                  name: item.product.name,
                  quantity: item.quantity.toString(),
                  unit_amount: {
                    value: item.product.price.toString(),
                    currency_code: 'USD'
                  }
                }))
              }
            ]
          });
        },
        onApprove: async (data: PayPalOrder, actions: PayPalActions) => {
          try {
            setIsLoading(true);
            const order = await actions.order.capture();
            
            if (order.status === 'COMPLETED') {
              onSuccess(order.id);
            } else {
              onError(new Error(`Estado de orden inesperado: ${order.status}`));
            }
          } catch (error) {
            onError(error);
          } finally {
            setIsLoading(false);
          }
        },
        onError: (err: unknown) => {
          onError(err);
        }
      }).render(paypalButtonRef.current);
    } catch (error) {
      console.error('Error al configurar PayPal:', error);
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

  return (
    <div className="w-full">
      <div ref={paypalButtonRef} className="w-full" />
    </div>
  );
}
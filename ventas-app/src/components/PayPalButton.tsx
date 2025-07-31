'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';

interface PayPalButtonProps {
  items: CartItem[];
  total: number;
  onSuccess: (orderId: string) => void;
  onError: (error: any) => void;
}

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
  currency: 'USD',
  intent: 'capture',
};

export default function PayPalButton({ items, total, onSuccess, onError }: PayPalButtonProps) {
  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (total / 100).toFixed(2), // Convertir centavos a dólares
            currency_code: 'USD',
          },
          description: `Compra de ${items.length} producto(s)`,
          custom_id: `order-${Date.now()}`,
          items: items.map((item) => ({
            name: item.product.name,
            unit_amount: {
              currency_code: 'USD',
              value: (item.product.price / 100).toFixed(2),
            },
            quantity: item.quantity.toString(),
            description: item.product.description.substring(0, 127), // PayPal limit
          })),
        },
      ],
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const order = await actions.order.capture();
      onSuccess(order.id);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="w-full">
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay',
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
} 
'use client';

import { PaymentMethod } from '@/types';
import { CreditCard, Wallet } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodChange 
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Selecciona tu método de pago
      </h3>
      
      <div className="space-y-2">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="mercadopago"
            checked={selectedMethod === 'mercadopago'}
            onChange={(e) => onMethodChange(e.target.value as PaymentMethod)}
            className="mr-3 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex items-center flex-1">
            <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Mercado Pago</div>
              <div className="text-sm text-gray-500">
                Tarjetas, efectivo y transferencias
              </div>
            </div>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={selectedMethod === 'paypal'}
            onChange={(e) => onMethodChange(e.target.value as PaymentMethod)}
            className="mr-3 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex items-center flex-1">
            <Wallet className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">PayPal</div>
              <div className="text-sm text-gray-500">
                Pago seguro con PayPal
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
} 
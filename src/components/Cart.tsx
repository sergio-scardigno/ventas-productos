'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { PaymentMethod } from '@/types';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import PaymentMethodSelector from './PaymentMethodSelector';
import PayPalButton from './PayPalButton';

export default function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mercadopago');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMercadoPagoCheckout = async () => {
    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Iniciando checkout con Mercado Pago...');
      
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Preferencia creada:', data);

      if (!data.sandbox_init_point) {
        throw new Error('No se recibió la URL de pago de Mercado Pago');
      }

      // Guardar información de la orden en localStorage para recuperarla después
      const orderInfo = {
        items: items,
        total: total,
        preferenceId: data.id,
        externalReference: data.external_reference,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('currentOrder', JSON.stringify(orderInfo));

      // Redirigir al usuario a Mercado Pago
      console.log('Redirigiendo a Mercado Pago:', data.sandbox_init_point);
      
      // Redirigir directamente en la misma ventana para mejor compatibilidad
      window.location.href = data.sandbox_init_point;
      
    } catch (error) {
      console.error('Error en checkout de Mercado Pago:', error);
      
      let errorMessage = 'Error al procesar el pago. Inténtalo de nuevo.';
      
      if (error instanceof Error) {
        if (error.message.includes('Token de acceso')) {
          errorMessage = 'Error de configuración del sistema de pagos. Contacta al administrador.';
        } else if (error.message.includes('estructura de los items')) {
          errorMessage = 'Error en los productos del carrito. Recarga la página e inténtalo de nuevo.';
        } else if (error.message.includes('No se recibió la URL')) {
          errorMessage = 'Error al generar el enlace de pago. Inténtalo de nuevo.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSuccess = async (orderId: string) => {
    alert(`¡Pago exitoso! ID de orden: ${orderId}`);
    clearCart();
    setIsOpen(false);
  };

  const handlePayPalError = (error: unknown) => {
    console.error('Error en PayPal:', error);
    alert('Error al procesar el pago con PayPal. Inténtalo de nuevo.');
  };

  return (
    <>
      {/* Botón del carrito */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors duration-200"
      >
        <ShoppingCart className="w-6 h-6" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {items.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Modal del carrito */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Carrito de Compras</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-96">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.product.name}</h3>
                        <p className="text-blue-600 font-semibold">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Selector de método de pago */}
                <PaymentMethodSelector
                  selectedMethod={selectedMethod}
                  onMethodChange={setSelectedMethod}
                />

                {/* Botones de pago */}
                <div className="space-y-3 mt-4">
                  {selectedMethod === 'mercadopago' ? (
                    <button
                      onClick={handleMercadoPagoCheckout}
                      disabled={isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      {isProcessing ? 'Procesando...' : 'Pagar con Mercado Pago'}
                    </button>
                  ) : (
                    <PayPalButton
                      items={items}
                      total={total}
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                    />
                  )}
                  
                  <button
                    onClick={clearCart}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 
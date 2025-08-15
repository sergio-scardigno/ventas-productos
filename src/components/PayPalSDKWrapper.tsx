'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalSDKWrapperProps {
  clientId: string;
  onLoad: (paypal: any) => void;
  children: React.ReactNode;
}

export function PayPalSDKWrapper({ clientId, onLoad, children }: PayPalSDKWrapperProps) {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // Verificar si el script ya está cargado
    if (window.paypal) {
      setSdkReady(true);
      onLoad(window.paypal);
      return;
    }

    // Función para cargar el script de PayPal
    const loadPayPalSDK = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      script.async = true;
      
      script.onload = () => {
        setSdkReady(true);
        onLoad(window.paypal);
      };

      script.onerror = () => {
        console.error('Error al cargar el SDK de PayPal');
      };

      document.body.appendChild(script);
    };

    loadPayPalSDK();

    // Limpieza
    return () => {
      const scripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
      scripts.forEach(script => script.remove());
    };
  }, [clientId, onLoad]);

  if (!sdkReady) {
    return <div>Cargando PayPal...</div>;
  }

  return <>{children}</>;
}

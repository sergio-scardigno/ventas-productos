'use client';

import { useEffect, useState } from 'react';

interface PayPalSDKWrapperProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    paypal?: unknown;
  }
}

export default function PayPalSDKWrapper({ children }: PayPalSDKWrapperProps) {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // Verificar si PayPal ya está cargado
    if (window.paypal) {
      setSdkReady(true);
      return;
    }

    // Cargar PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => setSdkReady(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  if (!sdkReady) {
    return <div>Cargando PayPal...</div>;
  }

  return <>{children}</>;
}

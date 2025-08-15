import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? '✅ Configurado' : '❌ No configurado',
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL ? '✅ Configurado' : '❌ No configurado',
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? 
        (process.env.GOOGLE_PRIVATE_KEY.length > 50 ? '✅ Configurado (longitud: ' + process.env.GOOGLE_PRIVATE_KEY.length + ')' : '⚠️ Configurado pero muy corto') : 
        '❌ No configurado',
      MERCADO_PAGO_ACCESS_TOKEN: process.env.MERCADO_PAGO_ACCESS_TOKEN ? '✅ Configurado' : '❌ No configurado',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ? '✅ Configurado' : '❌ No configurado',
    };

    console.log('🔍 Debug de variables de entorno:', envInfo);

    return NextResponse.json({
      message: 'Debug de variables de entorno',
      environment: process.env.NODE_ENV,
      variables: envInfo,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Error en debug-env:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de entorno' },
      { status: 500 }
    );
  }
}

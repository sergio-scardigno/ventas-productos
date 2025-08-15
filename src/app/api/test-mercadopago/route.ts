import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Iniciando prueba de MercadoPago...');
    
    // Verificar que existe el token de acceso
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      console.log('❌ Token no configurado');
      return NextResponse.json(
        { 
          success: false, 
          error: 'MERCADO_PAGO_ACCESS_TOKEN no está configurado',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    console.log('✅ Token encontrado:', process.env.MERCADO_PAGO_ACCESS_TOKEN.substring(0, 20) + '...');

    // Verificar que existe la URL base
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('✅ URL base:', baseUrl);

    // Prueba simple de conexión a la API de MercadoPago
    console.log('🔍 Probando conexión con API de MercadoPago...');
    
    const testResponse = await fetch('https://api.mercadopago.com/v1/payments/search', {
      headers: {
        'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Respuesta de API:', testResponse.status, testResponse.statusText);

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('❌ Error en API:', errorText);
      throw new Error(`Error en API: ${testResponse.status} - ${errorText}`);
    }

    console.log('✅ Conexión con API exitosa');

    return NextResponse.json({
      success: true,
      message: 'Conexión con MercadoPago exitosa',
      timestamp: new Date().toISOString(),
      mercadopago_status: {
        access_token: 'Configurado',
        api_connection: 'OK',
        token_preview: process.env.MERCADO_PAGO_ACCESS_TOKEN.substring(0, 20) + '...'
      },
      environment: {
        node_env: process.env.NODE_ENV || 'development',
        base_url: baseUrl
      }
    });

  } catch (error) {
    console.error('❌ Error en prueba de MercadoPago:', error);
    
    let errorMessage = 'Error desconocido';
    let errorDetails = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('access_token')) {
        errorDetails = 'Token de acceso inválido o expirado';
      } else if (error.message.includes('network')) {
        errorDetails = 'Error de conexión con la API de MercadoPago';
      } else if (error.message.includes('permission')) {
        errorDetails = 'Permisos insuficientes en la cuenta de MercadoPago';
      } else if (error.message.includes('fetch')) {
        errorDetails = 'Error al hacer la petición HTTP';
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

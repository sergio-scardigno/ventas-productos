import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🛒 Iniciando creación de preferencia...');
    
    // Verificar que existe el token de acceso
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      console.error('❌ MERCADO_PAGO_ACCESS_TOKEN no está configurado');
      return NextResponse.json(
        { error: 'Configuración de Mercado Pago incompleta' },
        { status: 500 }
      );
    }

    // Obtener y validar el body
    const body = await request.json();
    console.log('📦 Body recibido:', JSON.stringify(body, null, 2));
    
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ Items inválidos o vacíos');
      return NextResponse.json(
        { error: 'No hay items en el carrito' },
        { status: 400 }
      );
    }

    // Validar estructura de items
    for (const item of items) {
      if (!item.product?.id || !item.product?.name || !item.product?.price || !item.quantity) {
        console.error('❌ Estructura de item inválida:', item);
        return NextResponse.json(
          { error: 'Estructura de items inválida' },
          { status: 400 }
        );
      }
    }

    console.log('✅ Items válidos:', items.length);

    // Importar dinámicamente para evitar problemas
    const { MercadoPagoConfig, Preference } = await import('mercadopago');
    
    // Configurar Mercado Pago
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN 
    });

    // Verificar que existe la URL base
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('🌐 URL base configurada:', baseUrl);

    // Crear preferencia de pago
    const preference = {
      items: items.map((item) => ({
        id: item.product.id,
        title: item.product.name,
        unit_price: Number(item.product.price),
        quantity: Number(item.quantity),
        currency_id: 'ARS',
        picture_url: item.product.image || undefined,
        description: item.product.description || item.product.name,
      })),
      back_urls: {
        success: `${baseUrl}/success`,
        failure: `${baseUrl}/failure`,
        pending: `${baseUrl}/pending`
      },
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      external_reference: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      // Campos adicionales para mejor compatibilidad
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      // Configuración para evitar errores
      binary_mode: false,
      // Información del comprador (opcional pero recomendado)
      payer: {
        name: "Comprador",
        email: "comprador@test.com"
      }
    };

    console.log('📋 Preferencia a crear:', JSON.stringify(preference, null, 2));

    const preferenceClient = new Preference(client);
    const response = await preferenceClient.create({ body: preference });

    console.log('✅ Preferencia creada exitosamente:', {
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      external_reference: preference.external_reference
    });
    
  } catch (error) {
    console.error('❌ Error al crear preferencia de Mercado Pago:', error);
    
    // Manejo específico de errores de Mercado Pago
    if (error instanceof Error) {
      if (error.message.includes('access_token')) {
        return NextResponse.json(
          { error: 'Token de acceso de Mercado Pago inválido' },
          { status: 401 }
        );
      }
      if (error.message.includes('items')) {
        return NextResponse.json(
          { error: 'Error en la estructura de los items' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor al crear preferencia de pago' },
      { status: 500 }
    );
  }
} 
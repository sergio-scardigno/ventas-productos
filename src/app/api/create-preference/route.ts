import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CartItem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Verificar que existe el token de acceso
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      console.error('MERCADO_PAGO_ACCESS_TOKEN no está configurado');
      return NextResponse.json(
        { error: 'Configuración de Mercado Pago incompleta' },
        { status: 500 }
      );
    }

    // Configurar Mercado Pago
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN 
    });
    
    const { items }: { items: CartItem[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay items en el carrito' },
        { status: 400 }
      );
    }

    // Verificar que existe la URL base
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Crear preferencia de pago
    const preference = {
      items: items.map((item) => ({
        id: item.product.id,
        title: item.product.name,
        unit_price: item.product.price,
        quantity: item.quantity,
        picture_url: item.product.image,
        description: item.product.description,
      })),
      back_urls: {
        success: `${baseUrl}/success`,
        failure: `${baseUrl}/failure`,
        pending: `${baseUrl}/pending`,
      },
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      external_reference: `order-${Date.now()}`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
    };

    const preferenceClient = new Preference(client);
    const response = await preferenceClient.create({ body: preference });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
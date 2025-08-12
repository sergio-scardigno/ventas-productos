import { NextRequest, NextResponse } from 'next/server';
import { CartItem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay items en el carrito' },
        { status: 400 }
      );
    }

    // Aquí podrías implementar la lógica para crear una orden en tu base de datos
    // Por ahora, solo retornamos un éxito simulado
    const orderId = `paypal-order-${Date.now()}`;

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Orden creada exitosamente',
    });
  } catch (error) {
    console.error('Error al procesar orden de PayPal:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
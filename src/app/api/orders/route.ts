import { NextRequest, NextResponse } from 'next/server';
import { saveOrderToSheet, getOrdersFromSheet } from '@/lib/googleSheets';
import { Order } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Asegúrate de que el cuerpo del request coincide con lo que esperas
    // Puede que necesites validar y extraer los datos específicos de la orden aquí

    await saveOrderToSheet(body);

    return NextResponse.json({ message: 'Orden guardada exitosamente' }, { status: 201 });

  } catch (error) {
    console.error('Error al guardar la orden:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al guardar la orden', error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await getOrdersFromSheet();
    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al obtener las órdenes', error: errorMessage }, { status: 500 });
  }
}

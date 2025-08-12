import { NextResponse } from 'next/server';
import { getOrdersFromSheet } from '@/lib/googleSheets';

export async function GET() {
  try {
    const orders = await getOrdersFromSheet();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return NextResponse.json(
      { error: 'Error al cargar las órdenes' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { saveOrderToSheet } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📦 Orden recibida:', body);

    // Guardar en Google Sheets
    await saveOrderToSheet(body);

    return NextResponse.json({
      success: true,
      message: 'Orden guardada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al procesar orden:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Por ahora, devolvemos un mensaje informativo
    // En producción, esto se conectaría con Google Sheets
    return NextResponse.json({ 
      message: 'Endpoint de órdenes funcionando',
      note: 'Google Sheets integration simplified for now'
    });
  } catch (error) {
    console.error('❌ Error al obtener órdenes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Probando funcionalidad básica...');
    
    return NextResponse.json({
      success: true,
      message: 'Funcionalidad básica funcionando',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      note: 'Google Sheets integration simplified for now'
    });
  } catch (error) {
    console.error('❌ Error en test de funcionalidad:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

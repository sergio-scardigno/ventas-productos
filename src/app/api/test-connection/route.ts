import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Probando conexión básica...');
    
    return NextResponse.json({
      success: true,
      message: 'Conexión básica funcionando',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('❌ Error en test de conexión:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

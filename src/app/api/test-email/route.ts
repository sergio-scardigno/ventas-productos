import { NextResponse } from 'next/server';
import { testEmailConnection } from '@/lib/emailService';

export async function GET() {
  try {
    console.log('Iniciando prueba de conexión de Gmail...');
    
    const isConnected = await testEmailConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'Conexión de Gmail exitosa' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Error en la conexión de Gmail' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en la prueba de conexión de Gmail:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error en la prueba de conexión de Gmail',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

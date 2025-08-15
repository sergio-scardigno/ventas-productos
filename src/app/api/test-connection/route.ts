import { NextResponse } from 'next/server';
import { testGoogleSheetsConnection } from '@/lib/googleSheets';

export async function GET() {
  try {
    console.log('Iniciando prueba de conexión...');
    
    const isConnected = await testGoogleSheetsConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'Conexión a Google Sheets exitosa' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Error en la conexión a Google Sheets' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en la prueba de conexión:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error en la prueba de conexión',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

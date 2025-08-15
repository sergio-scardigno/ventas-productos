import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

interface OrderData {
  payment_id: string;
  external_reference: string;
  payer_email: string;
  payer_name: string;
  amount: number;
  currency: string;
  payment_method: string;
  installments: number;
  status: string;
  created_at: string;
  approved_at: string;
  items: string;
  payment_status: string;
  payment_date: string;
  total_items: number;
}

export async function POST(request: NextRequest) {
  try {
    console.log('💾 Iniciando guardado de orden en Google Sheets...');
    
    // Verificar variables de entorno
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('❌ Variables de entorno de Google Sheets no configuradas');
      return NextResponse.json(
        { error: 'Configuración de Google Sheets incompleta' },
        { status: 500 }
      );
    }

    // Obtener datos de la orden
    const orderData: OrderData = await request.json();
    console.log('📦 Datos de orden recibidos:', orderData);

    // Configurar autenticación de Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Preparar fila para Google Sheets
    const row = [
      orderData.payment_id,
      orderData.external_reference,
      orderData.payer_email,
      orderData.payer_name,
      orderData.amount,
      orderData.currency,
      orderData.payment_method,
      orderData.installments,
      orderData.status,
      orderData.created_at,
      orderData.approved_at,
      orderData.items,
      orderData.payment_status,
      orderData.payment_date,
      orderData.total_items,
      new Date().toISOString(), // timestamp de cuando se guardó
    ];

    console.log('📊 Fila preparada para Google Sheets:', row);

    // Agregar fila al final de la hoja de órdenes
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Orders!A:P', // Asumiendo que tienes una hoja llamada "Orders"
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    console.log('✅ Orden guardada exitosamente en Google Sheets');
    console.log('📋 Respuesta de Google Sheets:', response.data);

    return NextResponse.json({
      success: true,
      message: 'Orden guardada exitosamente',
      orderId: orderData.payment_id,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Error al guardar orden en Google Sheets:', error);
    
    let errorMessage = 'Error interno del servidor';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Endpoint GET para probar la conexión
export async function GET() {
  try {
    console.log('🔍 Probando conexión con Google Sheets...');
    
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Variables de entorno no configuradas' },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Intentar leer la hoja para verificar conexión
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Orders!A1:Z1', // Leer solo la primera fila
    });

    return NextResponse.json({
      success: true,
      message: 'Conexión con Google Sheets exitosa',
      sheetInfo: {
        id: process.env.GOOGLE_SHEET_ID,
        title: response.data.values?.[0] || 'Headers no encontrados',
        rowCount: response.data.values?.length || 0,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Error al probar conexión con Google Sheets:', error);
    return NextResponse.json(
      { error: 'Error de conexión con Google Sheets' },
      { status: 500 }
    );
  }
}

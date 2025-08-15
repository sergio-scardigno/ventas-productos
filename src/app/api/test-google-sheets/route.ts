import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    console.log('🧪 Iniciando test de Google Sheets...');
    
    // Verificar variables
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
    
    console.log('📋 SPREADSHEET_ID:', SPREADSHEET_ID);
    console.log('📧 CLIENT_EMAIL:', GOOGLE_CLIENT_EMAIL);
    console.log('🔑 PRIVATE_KEY length:', GOOGLE_PRIVATE_KEY?.length);
    
    if (!SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      throw new Error('Faltan variables de entorno requeridas');
    }
    
    // Preparar credenciales
    let privateKey = GOOGLE_PRIVATE_KEY;
    
    // Limpiar y formatear la clave privada
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    
    // Reemplazar \n con saltos de línea reales
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    const credentials = {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    };
    
    console.log('🔑 Credenciales preparadas, intentando conectar...');
    
    // Crear autenticación
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    console.log('🔐 Autenticación creada, obteniendo cliente de sheets...');
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('📊 Cliente de sheets obtenido, intentando leer datos...');
    
    // Intentar leer datos
    const RANGE = 'Productos!A2:F';
    console.log(`📋 Leyendo rango: ${RANGE}`);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });
    
    const rows = response.data.values;
    console.log('📊 Respuesta de Google Sheets:', rows);
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({
        message: 'Test de Google Sheets completado',
        status: 'success',
        result: 'No se encontraron filas en el rango especificado',
        rows: [],
        rowCount: 0,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Procesar filas
    const products = rows
      .filter(row => row.length >= 3 && row[0] && row[1] && row[2])
      .map((row, index) => ({
        id: row[0] || `product-${index}`,
        name: row[1] || 'Producto sin nombre',
        price: parseFloat(row[2]) || 0,
        image: row[3] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: row[4] || 'Sin descripción',
        stock: parseInt(row[5]) || 0,
      }))
      .filter(product => product.name !== 'Producto sin nombre' && product.price > 0);
    
    console.log('✅ Productos procesados:', products);
    
    return NextResponse.json({
      message: 'Test de Google Sheets completado',
      status: 'success',
      result: 'Conexión exitosa',
      rawRows: rows,
      processedProducts: products,
      rowCount: rows.length,
      productCount: products.length,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error en test de Google Sheets:', error);
    
    return NextResponse.json({
      message: 'Test de Google Sheets falló',
      status: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

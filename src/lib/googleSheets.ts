import { google } from 'googleapis';
import { Product } from '@/types';
import { readFileSync } from 'fs';
import { join } from 'path';

// Función para cargar las credenciales desde el archivo JSON
function loadCredentials() {
  try {
    const credentialsPath = join(process.cwd(), 'just-glow-468123-v4-7bb25d1d5bc2.json');
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
    console.log('✓ Credenciales cargadas desde archivo JSON');
    return credentials;
  } catch (error) {
    console.error('Error al cargar credenciales desde archivo JSON:', error);
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      console.log('✓ Usando credenciales desde variables de entorno');
      return {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    }
    throw new Error('No se pudieron cargar las credenciales de Google');
  }
}

const credentials = loadCredentials();

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/spreadsheets'
  ],
});

// Verificar la autenticación al inicializar
auth.getClient().catch(error => {
  console.error('Error de autenticación con Google Sheets:', error);
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getProductsFromSheet(): Promise<Product[]> {
  try {
    const spreadsheetId = "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";
    const range = 'Productos!A2:F';

    console.log('Intentando conectar con Google Sheets:', spreadsheetId);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log('No se encontraron datos en la hoja');
      return [];
    }

    // Convertir filas a productos
    const products: Product[] = rows.map((row, index) => ({
      id: row[0] || `product-${index}`,
      name: row[1] || '',
      price: parseFloat(row[2]) || 0,
      image: row[3] || '',
      description: row[4] || '',
      stock: parseInt(row[5]) || 0,
    }));

    // Filtrar productos válidos (con nombre y precio)
    return products.filter(product => product.name && product.price > 0);

  } catch (error) {
    console.error('Error al leer Google Sheets:', error);
    throw new Error('Error al cargar productos desde Google Sheets');
  }
}

// Función para desarrollo con datos de ejemplo
export function getMockProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'Laptop Gaming',
      price: 150000,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
      description: 'Laptop gaming de alto rendimiento con gráficos dedicados',
      stock: 10,
    },
    {
      id: '2',
      name: 'Smartphone Pro',
      price: 80000,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      description: 'Smartphone de última generación con cámara profesional',
      stock: 15,
    },
    {
      id: '3',
      name: 'Auriculares Wireless',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      description: 'Auriculares bluetooth con cancelación de ruido',
      stock: 20,
    },
    {
      id: '4',
      name: 'Tablet Pro',
      price: 95000,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
      description: 'Tablet profesional para trabajo y entretenimiento',
      stock: 8,
    },
    {
      id: '5',
      name: 'Smartwatch',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      description: 'Reloj inteligente con monitoreo de salud',
      stock: 12,
    },
    {
      id: '6',
      name: 'Cámara DSLR',
      price: 120000,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      description: 'Cámara réflex digital profesional',
      stock: 5,
    },
  ];
}

// Función para guardar órdenes en Google Sheets
export async function saveOrderToSheet(orderData: any): Promise<void> {
  try {
    // Verificar que tenemos autenticación válida
    const authClient = await auth.getClient();
    console.log('Cliente de autenticación obtenido exitosamente');
    
    const spreadsheetId = "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";

    // Crear fila con los datos de la orden
    const orderRow = [
      orderData.payment_id || '',
      orderData.external_reference || '',
      orderData.payer_email || '',
      orderData.payer_name || '',
      orderData.amount || 0,
      orderData.currency || 'USD',
      orderData.payment_method || '',
      orderData.installments || 1,
      orderData.status || 'pending',
      orderData.created_at || new Date().toISOString(),
      orderData.approved_at || '',
      JSON.stringify(orderData.items || []), // Productos comprados
    ];

    console.log('Intentando guardar orden en Google Sheets:', {
      spreadsheetId,
      range: 'Orders!A:L',
      orderRow
    });

    // Agregar la fila al final de la hoja de órdenes
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Orders!A:L', // Asumiendo que tienes una hoja llamada "Orders"
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [orderRow],
      },
    });

    console.log('Orden guardada exitosamente en Google Sheets:', result.data);
  } catch (error: unknown) {
    console.error('Error detallado al guardar orden en Google Sheets:', error);
    
    // Si es un error de autenticación, proporcionar más detalles
    if ((error as any).code === 'ERR_OSSL_UNSUPPORTED') {
      console.error('Error de OpenSSL - Problema con la clave privada');
      console.error('Verifica que GOOGLE_PRIVATE_KEY esté correctamente configurada');
    }
    
    throw error;
  }
}

// Función para obtener todas las órdenes
export async function getOrdersFromSheet(): Promise<any[]> {
  try {
    const spreadsheetId = "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Orders!A:L', // Asumiendo que tienes una hoja llamada "Orders"
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Convertir filas a objetos de orden
    const orders = rows.slice(1).map((row) => ({
      payment_id: row[0],
      external_reference: row[1],
      payer_email: row[2],
      payer_name: row[3],
      amount: parseFloat(row[4]),
      currency: row[5],
      payment_method: row[6],
      installments: parseInt(row[7]),
      status: row[8],
      created_at: row[9],
      approved_at: row[10],
      items: row[11] ? JSON.parse(row[11]) : [],
    }));

    return orders;
  } catch (error) {
    console.error('Error al leer órdenes desde Google Sheets:', error);
    throw error;
  }
}

// Función para probar la conexión a Google Sheets
export async function testGoogleSheetsConnection(): Promise<boolean> {
  try {
    console.log('Probando conexión a Google Sheets...');
    
    // Verificar autenticación
    const authClient = await auth.getClient();
    console.log('✓ Autenticación exitosa');
    
    // Verificar acceso a la hoja de productos
    const spreadsheetId = "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    console.log('✓ Acceso a la hoja de cálculo:', response.data.properties?.title);
    console.log('✓ Hojas disponibles:', response.data.sheets?.map(s => s.properties?.title));
    
    return true;
  } catch (error) {
    console.error('✗ Error en la conexión a Google Sheets:', error);
    return false;
  }
}

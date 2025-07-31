import { google } from 'googleapis';
import { Product } from '@/types';

// Configuración de Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getProductsFromSheet(): Promise<Product[]> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = process.env.GOOGLE_SHEET_RANGE || 'A2:F'; // Asumiendo que la primera fila son headers

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID no está configurado');
    }

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
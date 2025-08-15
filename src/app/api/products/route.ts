import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuración de Google Sheets
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";
const RANGE = 'Productos!A2:F'; // Asumiendo que tienes una hoja llamada "Productos"

// Función para obtener credenciales desde archivo JSON
function getCredentialsFromFile() {
  try {
    const credentialsPath = join(process.cwd(), 'just-glow-468123-v4-7bb25d1d5bc2.json');
    
    if (!require('fs').existsSync(credentialsPath)) {
      throw new Error(`Archivo de credenciales no encontrado en: ${credentialsPath}`);
    }
    
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
    return credentials;
  } catch (error) {
    console.error('❌ Error al cargar credenciales desde archivo:', error);
    throw error;
  }
}

// Función para obtener productos desde Google Sheets
async function getProductsFromGoogleSheets() {
  try {
    console.log('🔗 Conectando con Google Sheets...');
    
    const credentials = getCredentialsFromFile();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log(`📋 Obteniendo productos desde: ${SPREADSHEET_ID}`);
    console.log(`📊 Rango: ${RANGE}`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('⚠️ No se encontraron productos en Google Sheets');
      return [];
    }

    console.log(`✅ ${rows.length} filas obtenidas de Google Sheets`);

    // Convertir filas a productos
    const products = rows
      .filter(row => row.length >= 3 && row[0] && row[1] && row[2]) // Filtrar filas válidas
      .map((row, index) => ({
        id: row[0] || `product-${index}`,
        name: row[1] || 'Producto sin nombre',
        price: parseFloat(row[2]) || 0,
        image: row[3] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: row[4] || 'Sin descripción',
        stock: parseInt(row[5]) || 0,
      }))
      .filter(product => product.name !== 'Producto sin nombre' && product.price > 0); // Filtrar productos válidos

    console.log(`✅ ${products.length} productos válidos procesados`);
    return products;

  } catch (error) {
    console.error('❌ Error al obtener productos de Google Sheets:', error);
    throw error;
  }
}

// Datos de ejemplo como fallback
const mockProducts = [
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
];

export async function GET() {
  try {
    console.log('🚀 Iniciando obtención de productos...');
    
    let products;
    
    // Intentar obtener productos de Google Sheets
    if (process.env.NODE_ENV === 'development') {
      try {
        products = await getProductsFromGoogleSheets();
        console.log('✅ Productos obtenidos de Google Sheets');
      } catch (sheetsError) {
        const errorMessage = sheetsError instanceof Error ? sheetsError.message : 'Error desconocido';
        console.error('⚠️ Error con Google Sheets, usando productos de ejemplo:', errorMessage);
        products = mockProducts;
      }
    } else {
      console.log('⚠️ No es modo desarrollo, usando productos de ejemplo');
      products = mockProducts;
    }

    console.log(`📦 Devolviendo ${products.length} productos`);
    return NextResponse.json(products);

  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    
    // En caso de error, devolver productos de ejemplo
    console.log('🔄 Devolviendo productos de ejemplo como fallback');
    return NextResponse.json(mockProducts);
  }
} 
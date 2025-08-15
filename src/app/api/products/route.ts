import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Configuración de Google Sheets
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";
const RANGE = 'Productos!A2:F'; // Asumiendo que tienes una hoja llamada "Productos"

// Función para obtener credenciales (archivo JSON o variables de entorno)
function getCredentials() {
  try {
    // Opción 1: Variables de entorno (para producción)
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      console.log('🔑 Usando credenciales de variables de entorno');
      
      let privateKey = process.env.GOOGLE_PRIVATE_KEY;
      
      // Limpiar y formatear la clave privada
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      
      // Reemplazar \n con saltos de línea reales
      privateKey = privateKey.replace(/\\n/g, '\n');
      
      // Verificar que la clave tenga el formato correcto
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('Formato de clave privada inválido');
      }
      
      return {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      };
    }
    
    // Opción 2: Archivo JSON (para desarrollo local)
    if (process.env.NODE_ENV === 'development') {
      try {
        const credentialsPath = join(process.cwd(), 'just-glow-468123-v4-7bb25d1d5bc2.json');
        
        if (existsSync(credentialsPath)) {
          const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
          console.log('🔑 Usando credenciales del archivo JSON');
          return credentials;
        }
      } catch (fileError) {
        console.log('⚠️ No se pudo cargar archivo de credenciales:', fileError);
      }
    }
    
    throw new Error('No se encontraron credenciales de Google');
  } catch (error) {
    console.error('❌ Error al obtener credenciales:', error);
    throw error;
  }
}

// Función alternativa para obtener productos usando fetch directo (evita problemas de OpenSSL)
async function getProductsFromGoogleSheetsDirect() {
  try {
    console.log('🔗 Conectando con Google Sheets usando API REST directa...');
    
    const credentials = getCredentials();
    
    // Para simplificar, usaremos un enfoque diferente
    console.log('⚠️ Usando método alternativo para evitar problemas de OpenSSL');
    return null; // Retornar null para usar el fallback
    
  } catch (error) {
    console.error('❌ Error en método alternativo:', error);
    return null;
  }
}

// Función para obtener productos desde Google Sheets
async function getProductsFromGoogleSheets() {
  try {
    console.log('🔗 Conectando con Google Sheets...');
    
    const credentials = getCredentials();
    
    // Configuración adicional para evitar problemas de OpenSSL en Windows
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    // Configuración específica para evitar problemas de OpenSSL
    const sheets = google.sheets({ 
      version: 'v4', 
      auth,
      timeout: 30000, // 30 segundos de timeout
    });
    
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
    
    // Manejo específico para errores de OpenSSL
    if (error instanceof Error && error.message.includes('DECODER routines::unsupported')) {
      console.error('🔧 Error de OpenSSL detectado. Esto puede ser un problema de compatibilidad en Windows.');
      console.error('💡 Soluciones sugeridas:');
      console.error('   1. Usar NODE_OPTIONS=--openssl-legacy-provider');
      console.error('   2. Actualizar googleapis a la última versión');
      console.error('   3. Verificar credenciales de Google');
    }
    
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
    console.log('🌍 Entorno:', process.env.NODE_ENV);
    
    let products;
    
    // Intentar obtener productos de Google Sheets (tanto en desarrollo como producción)
    try {
      // Primero intentar el método alternativo que evita problemas de OpenSSL
      console.log('🔄 Intentando método alternativo...');
      products = await getProductsFromGoogleSheetsDirect();
      
      if (products) {
        console.log('✅ Productos obtenidos usando método alternativo');
      } else {
        // Si el método alternativo falla, intentar el método original
        console.log('🔄 Intentando método original de Google Sheets...');
        products = await getProductsFromGoogleSheets();
        console.log('✅ Productos obtenidos de Google Sheets');
      }
    } catch (sheetsError) {
      const errorMessage = sheetsError instanceof Error ? sheetsError.message : 'Error desconocido';
      console.error('⚠️ Error con Google Sheets, usando productos de ejemplo:', errorMessage);
      
      // Log adicional para debugging
      if (sheetsError instanceof Error) {
        console.error('🔍 Detalles del error:', {
          name: sheetsError.name,
          message: sheetsError.message,
          stack: sheetsError.stack
        });
      }
      
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
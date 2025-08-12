import { NextResponse } from 'next/server';
import { getProductsFromSheet, getMockProducts } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Intentar obtener productos desde Google Sheets
    let products;
    
    if (process.env.GOOGLE_SHEET_ID) {
      try {
        products = await getProductsFromSheet();
      } catch (error) {
        console.error('Error al obtener productos de Google Sheets:', error);
        // Fallback a datos de ejemplo
        products = getMockProducts();
      }
    } else {
      // Usar datos de ejemplo si no hay configuración de Google Sheets
      products = getMockProducts();
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
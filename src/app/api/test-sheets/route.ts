import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuración de Google Sheets
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";

interface TestResults {
  success: boolean;
  message: string;
  details: {
    GOOGLE_SHEET_ID: string;
    NODE_ENV: string;
    spreadsheet?: {
      title: string;
      sheets: string[];
    };
    headers?: string[];
    error?: string;
  };
  recommendations: string[];
}

// Función para obtener credenciales desde archivo JSON
function getCredentialsFromFile() {
  try {
    const credentialsPath = join(process.cwd(), 'just-glow-468123-v4-7bb25d1d5bc2.json');
    console.log('📁 Buscando archivo de credenciales en:', credentialsPath);
    
    if (!require('fs').existsSync(credentialsPath)) {
      throw new Error(`Archivo de credenciales no encontrado en: ${credentialsPath}`);
    }
    
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
    console.log('✅ Credenciales cargadas desde archivo JSON');
    console.log('📧 Email de servicio:', credentials.client_email);
    
    return credentials;
  } catch (error) {
    console.error('❌ Error al cargar credenciales desde archivo:', error);
    throw error;
  }
}

export async function GET() {
  try {
    console.log('🧪 Iniciando prueba de conexión con Google Sheets...');
    
    const results: TestResults = {
      success: false,
      message: '',
      details: {
        GOOGLE_SHEET_ID: SPREADSHEET_ID,
        NODE_ENV: process.env.NODE_ENV || 'development'
      },
      recommendations: []
    };

    // 1. Verificar archivo de credenciales
    console.log('📋 Verificando archivo de credenciales...');
    
    if (process.env.NODE_ENV !== 'development') {
      results.message = 'Esta prueba solo funciona en desarrollo';
      results.recommendations.push('⚠️ Ejecuta en modo desarrollo para usar archivo JSON');
      return NextResponse.json(results, { status: 400 });
    }

    // 2. Probar conexión
    console.log('🔗 Probando conexión con Google Sheets...');
    try {
      const credentials = getCredentialsFromFile();
      
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      
      // Verificar acceso a la hoja
      console.log('📊 Verificando acceso a la hoja...');
      const spreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });

      results.details.spreadsheet = {
        title: spreadsheetInfo.data.properties?.title || 'Sin título',
        sheets: spreadsheetInfo.data.sheets?.map(s => s.properties?.title || 'Sin título') || [],
      };

      console.log('✅ Acceso a hoja verificado:', results.details.spreadsheet.title);
      console.log('📋 Hojas disponibles:', results.details.spreadsheet.sheets);

      // Probar lectura de datos
      const testRange = 'Productos!A1:F1'; // Leer encabezados
      console.log('📖 Probando lectura de datos...');
      
      const testResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: testRange,
      });

      if (testResponse.data.values && testResponse.data.values.length > 0) {
        results.details.headers = testResponse.data.values[0];
        console.log('✅ Lectura de datos exitosa');
        console.log('📋 Encabezados encontrados:', results.details.headers);
        
        results.success = true;
        results.message = 'Conexión con Google Sheets exitosa';
        results.recommendations.push('✅ Conexión funcionando correctamente');
        results.recommendations.push('✅ Puedes usar la API de productos');
      } else {
        results.message = 'Hoja de productos vacía o no encontrada';
        results.recommendations.push('⚠️ Verifica que la hoja "Productos" tenga datos');
        results.recommendations.push('⚠️ Verifica que el rango A1:F1 contenga encabezados');
      }

    } catch (connectionError) {
      console.error('❌ Error de conexión:', connectionError);
      results.message = 'Error al conectar con Google Sheets';
      results.details.error = connectionError instanceof Error ? connectionError.message : 'Error desconocido';
      
      if (connectionError instanceof Error) {
        if (connectionError.message.includes('invalid_grant')) {
          results.recommendations.push('❌ Token de acceso expirado o inválido');
          results.recommendations.push('🔄 Regenera las credenciales de servicio');
        } else if (connectionError.message.includes('notFound')) {
          results.recommendations.push('❌ ID de hoja de cálculo no encontrado');
          results.recommendations.push('🔍 Verifica que GOOGLE_SHEET_ID sea correcto');
        } else if (connectionError.message.includes('forbidden')) {
          results.recommendations.push('❌ Sin permisos para acceder a la hoja');
          results.recommendations.push('🔑 Verifica que la cuenta de servicio tenga acceso');
        } else if (connectionError.message.includes('DECODER routines::unsupported')) {
          results.recommendations.push('❌ Error en formato de credenciales');
          results.recommendations.push('🔄 Verifica el archivo JSON de credenciales');
        }
      }
    }

    console.log('📊 Prueba completada');
    return NextResponse.json(results);

  } catch (error) {
    console.error('❌ Error en prueba de conexión:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

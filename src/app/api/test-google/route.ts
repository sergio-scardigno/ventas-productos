import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar variables de entorno básicas
    const hasGoogleSheetId = !!process.env.GOOGLE_SHEET_ID;
    const hasGoogleClientEmail = !!process.env.GOOGLE_CLIENT_EMAIL;
    const hasGooglePrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;
    
    // Verificar longitud de la clave privada
    const privateKeyLength = process.env.GOOGLE_PRIVATE_KEY?.length || 0;
    const privateKeyValid = privateKeyLength > 100; // Debe ser bastante larga
    
    const envStatus = {
      NODE_ENV: process.env.NODE_ENV || 'No definido',
      GOOGLE_SHEET_ID: hasGoogleSheetId ? '✅ Configurado' : '❌ No configurado',
      GOOGLE_CLIENT_EMAIL: hasGoogleClientEmail ? '✅ Configurado' : '❌ No configurado',
      GOOGLE_PRIVATE_KEY: hasGooglePrivateKey ? 
        (privateKeyValid ? `✅ Configurado (${privateKeyLength} chars)` : `⚠️ Muy corta (${privateKeyLength} chars)`) : 
        '❌ No configurado',
    };

    console.log('🔍 Estado de variables de entorno:', envStatus);

    return NextResponse.json({
      message: 'Test de configuración de Google Sheets',
      status: 'success',
      environment: process.env.NODE_ENV,
      variables: envStatus,
      recommendations: getRecommendations(envStatus),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Error en test-google:', error);
    return NextResponse.json(
      { 
        error: 'Error al verificar configuración',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

function getRecommendations(envStatus: Record<string, string>) {
  const recommendations = [];
  
  if (envStatus.GOOGLE_SHEET_ID.includes('❌')) {
    recommendations.push('Configura GOOGLE_SHEET_ID en Vercel');
  }
  
  if (envStatus.GOOGLE_CLIENT_EMAIL.includes('❌')) {
    recommendations.push('Configura GOOGLE_CLIENT_EMAIL en Vercel');
  }
  
  if (envStatus.GOOGLE_PRIVATE_KEY.includes('❌')) {
    recommendations.push('Configura GOOGLE_PRIVATE_KEY en Vercel');
  }
  
  if (envStatus.GOOGLE_PRIVATE_KEY.includes('⚠️')) {
    recommendations.push('GOOGLE_PRIVATE_KEY parece ser muy corta, verifica el formato');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Todas las variables están configuradas correctamente');
  }
  
  return recommendations;
}

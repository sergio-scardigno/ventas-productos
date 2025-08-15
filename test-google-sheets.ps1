# Script para probar específicamente la API de Google Sheets
# y verificar si el error de OpenSSL se ha resuelto

Write-Host "🧪 Probando API de Google Sheets..." -ForegroundColor Yellow
Write-Host "📍 URL: http://localhost:3000/api/products" -ForegroundColor Cyan

try {
    # Hacer petición a la API
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET
    
    Write-Host "✅ API respondió correctamente" -ForegroundColor Green
    Write-Host "📦 Productos obtenidos: $($response.Count)" -ForegroundColor Green
    
    # Mostrar los productos
    $response | ForEach-Object {
        Write-Host "   • $($_.name) - $($_.price)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "🔍 Verificando logs del servidor..." -ForegroundColor Yellow
    Write-Host "💡 Si ves productos de ejemplo, significa que Google Sheets falló" -ForegroundColor Yellow
    Write-Host "💡 Si ves productos de Google Sheets, significa que funciona correctamente" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error al probar la API: $($_.Exception.Message)" -ForegroundColor Red
}

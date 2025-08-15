# Script para iniciar el servidor con OpenSSL legacy provider
# Configuración directa de la variable de entorno

Write-Host "🔧 Configurando OpenSSL legacy provider..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--openssl-legacy-provider"

Write-Host "✅ NODE_OPTIONS configurado: $env:NODE_OPTIONS" -ForegroundColor Green
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Cyan

# Ejecutar el servidor
npm run dev

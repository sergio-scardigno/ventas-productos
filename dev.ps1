# Script para ejecutar el servidor de desarrollo con soporte para OpenSSL legacy
# Este script resuelve el problema de compatibilidad de OpenSSL en Windows

Write-Host "🚀 Iniciando servidor de desarrollo con soporte para OpenSSL legacy..." -ForegroundColor Green
Write-Host "💡 Esto resuelve el error: error:1E08010C:DECODER routines::unsupported" -ForegroundColor Yellow

# Establecer la variable de entorno para OpenSSL legacy provider
$env:NODE_OPTIONS = "--openssl-legacy-provider"

Write-Host "✅ NODE_OPTIONS configurado: $env:NODE_OPTIONS" -ForegroundColor Green

# Ejecutar el servidor de desarrollo
Write-Host "🌐 Iniciando Next.js con Turbopack..." -ForegroundColor Cyan
npm run dev

@echo off
REM Script para ejecutar el servidor de desarrollo con soporte para OpenSSL legacy
REM Este script resuelve el problema de compatibilidad de OpenSSL en Windows

echo 🚀 Iniciando servidor de desarrollo con soporte para OpenSSL legacy...
echo 💡 Esto resuelve el error: error:1E08010C:DECODER routines::unsupported

REM Establecer la variable de entorno para OpenSSL legacy provider
set NODE_OPTIONS=--openssl-legacy-provider

echo ✅ NODE_OPTIONS configurado: %NODE_OPTIONS%

REM Ejecutar el servidor de desarrollo
echo 🌐 Iniciando Next.js con Turbopack...
npm run dev

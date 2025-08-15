# Configuración de MercadoPago - Guía Completa

## Problemas Comunes y Soluciones

### 1. Error "No pudimos procesar tu pago"

Este error puede ocurrir por varias razones:

#### A. Configuración de Variables de Entorno
```bash
# Crear archivo .env.local en la raíz del proyecto
MERCADO_PAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### B. Verificar Token de Acceso
- El token debe comenzar con `TEST-` para sandbox
- El token debe ser válido y no estar expirado
- Verificar permisos en la cuenta de MercadoPago

### 2. Configuración de MercadoPago

#### A. Crear Cuenta de Desarrollador
1. Ir a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Crear cuenta de desarrollador
3. Obtener credenciales de prueba

#### B. Configurar Webhooks
1. En el panel de desarrollador, configurar la URL del webhook:
   ```
   https://tu-dominio.com/api/webhooks/mercadopago
   ```
2. Para desarrollo local, usar ngrok o similar

#### C. Configurar URLs de Retorno
Las siguientes URLs deben estar configuradas:
- **Success**: `/success`
- **Failure**: `/failure`  
- **Pending**: `/pending`

### 3. Pruebas y Debugging

#### A. Endpoint de Prueba
```bash
GET /api/test-mercadopago
```
Este endpoint verifica:
- Configuración del token
- Conexión con la API
- Creación de preferencias de prueba

#### B. Logs del Webhook
Revisar los logs del servidor para ver:
- Notificaciones recibidas
- Errores de procesamiento
- Estado de los pagos

#### C. Verificar en MercadoPago
1. Ir al [Panel de Desarrollador](https://www.mercadopago.com.ar/developers/panel)
2. Revisar la sección de "Notificaciones"
3. Verificar que los webhooks se envíen correctamente

### 4. Flujo de Pago Correcto

#### A. Creación de Preferencia
1. Usuario selecciona productos
2. Se crea preferencia con `back_urls`
3. Se redirige a MercadoPago

#### B. Procesamiento del Pago
1. Usuario completa el pago en MercadoPago
2. MercadoPago redirige según el resultado
3. Webhook notifica el estado del pago

#### C. Confirmación
1. Pago aprobado → Página de éxito
2. Pago rechazado → Página de fallo
3. Pago pendiente → Página de pendiente

### 5. Solución de Problemas

#### A. Pago No Se Procesa
- Verificar que el token sea válido
- Revisar logs del servidor
- Verificar configuración de webhooks

#### B. Usuario No Retorna Después del Pago
- Verificar `back_urls` en la preferencia
- Asegurar que las URLs sean accesibles
- Verificar configuración de `auto_return`

#### C. Webhook No Recibe Notificaciones
- Verificar URL del webhook en MercadoPago
- Revisar logs del servidor
- Verificar que el endpoint responda correctamente

### 6. Configuración de Producción

#### A. Cambiar a Token de Producción
```bash
MERCADO_PAGO_ACCESS_TOKEN=APP-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### B. Configurar URLs de Producción
```bash
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

#### C. Verificar SSL
- El webhook debe ser HTTPS en producción
- Las URLs de retorno deben ser HTTPS

### 7. Monitoreo y Mantenimiento

#### A. Logs Importantes
- Creación de preferencias
- Notificaciones de webhook
- Errores de procesamiento
- Estados de pagos

#### B. Métricas a Seguir
- Tasa de éxito de pagos
- Tiempo de procesamiento
- Errores por método de pago
- Estado de webhooks

### 8. Contacto y Soporte

#### A. MercadoPago
- [Documentación Oficial](https://www.mercadopago.com.ar/developers)
- [Soporte Técnico](https://www.mercadopago.com.ar/developers/support)

#### B. Logs del Sistema
Revisar siempre los logs del servidor para identificar problemas específicos.

---

**Nota**: Esta guía asume que estás usando el sandbox de MercadoPago para pruebas. Para producción, cambiar a las credenciales de producción y configurar HTTPS.

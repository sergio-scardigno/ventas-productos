# Configuración de Google Sheets para Órdenes

## Estructura de Columnas

Tu hoja de Google Sheets debe tener las siguientes columnas en este orden:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| A | payment_id | ID único del pago |
| B | external_reference | Referencia externa |
| C | payer_email | Email del pagador |
| D | payer_name | Nombre del pagador |
| E | amount | Monto del pago |
| F | currency | Moneda (ARS/USD) |
| G | payment_method | Método de pago |
| H | installments | Cuotas |
| I | status | Estado del pago |
| J | created_at | Fecha de creación |
| K | approved_at | Fecha de aprobación |
| L | items | Productos comprados |
| M | payment_status | Estado del pago |
| N | payment_date | Fecha del pago |
| O | total_items | Total de items |
| **P** | **payment_source** | **Fuente del pago** |
| Q | timestamp | Fecha de guardado en Sheets |

## Nueva Columna: payment_source

La columna **P** es nueva y contiene la fuente del pago:

- **`mercadopago`** - Para pagos procesados por Mercado Pago
- **`paypal`** - Para pagos procesados por PayPal

## Configuración en Google Sheets

1. **Crear una nueva hoja llamada "Orders"** (si no existe)
2. **Agregar los encabezados** en la primera fila
3. **Asegurarte de que tienes 17 columnas** (A hasta Q)

### Encabezados de ejemplo:

```
payment_id | external_reference | payer_email | payer_name | amount | currency | payment_method | installments | status | created_at | approved_at | items | payment_status | payment_date | total_items | payment_source | timestamp
```

## Verificación

Para verificar que todo funciona:

1. **Hacer un pago con Mercado Pago** - Debería aparecer `mercadopago` en la columna P
2. **Hacer un pago con PayPal** - Debería aparecer `paypal` en la columna P
3. **Revisar que los datos se guarden correctamente** en todas las columnas

## Notas Importantes

- **La columna payment_source es obligatoria** para el funcionamiento correcto
- **Los pagos de PayPal** se guardan automáticamente cuando se completa el pago
- **Los pagos de Mercado Pago** se guardan a través de webhooks
- **Si cambias el orden de las columnas**, actualiza el código en `src/app/api/save-order/route.ts`

## Solución de Problemas

### Error: "Range Orders!A:Q is out of bounds"

- Verifica que tu hoja tenga exactamente 17 columnas (A hasta Q)
- Asegúrate de que la hoja se llame "Orders"

### Error: "Invalid range"

- El rango debe ser `Orders!A:Q` (no `Orders!A:P`)
- Verifica que no haya espacios extra en el nombre de la hoja

### Datos no se guardan

- Revisa los logs del servidor para ver errores específicos
- Verifica que las variables de entorno de Google Sheets estén configuradas
- Asegúrate de que la cuenta de servicio tenga permisos de escritura

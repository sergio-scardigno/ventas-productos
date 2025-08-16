import { NextRequest, NextResponse } from 'next/server';
import { saveOrderToSheet } from '@/lib/googleSheets';
import { sendPaymentConfirmationEmail, sendOrderNotificationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔔 Webhook de Mercado Pago recibido:', JSON.stringify(body, null, 2));

    // Extraer información del webhook
    const { 
      type, 
      data
    } = body;

    // Procesar según el tipo de notificación
    if (type === 'payment' && data?.id) {
      const paymentId = data.id;
      console.log(`💰 Procesando pago: ${paymentId}`);

      try {
        // Obtener detalles del pago desde Mercado Pago
        const paymentDetails = await getPaymentDetails(paymentId);
        console.log('📋 Detalles del pago:', paymentDetails);

        // Validar que el pago tenga la información necesaria
        if (!paymentDetails || !paymentDetails.id) {
          console.error('❌ Pago sin información válida:', paymentDetails);
          return NextResponse.json(
            { success: false, error: 'Información de pago inválida' },
            { status: 400 }
          );
        }

        if (paymentDetails.status === 'approved') {
          // Pago aprobado - guardar en Google Sheets y enviar email
          console.log('✅ Pago aprobado, procesando...');
          await processApprovedPayment(paymentDetails);
        } else if (paymentDetails.status === 'rejected') {
          // Pago rechazado - solo log
          console.log(`❌ Pago rechazado: ${paymentId} - Motivo: ${paymentDetails.status_detail}`);
        } else if (paymentDetails.status === 'pending') {
          // Pago pendiente - solo log
          console.log(`⏳ Pago pendiente: ${paymentId} - Estado: ${paymentDetails.status_detail}`);
        } else if (paymentDetails.status === 'in_process') {
          // Pago en proceso
          console.log(`🔄 Pago en proceso: ${paymentId} - Estado: ${paymentDetails.status_detail}`);
        } else {
          // Otros estados
          console.log(`ℹ️ Pago con estado desconocido: ${paymentId} - Estado: ${paymentDetails.status}`);
        }

      } catch (error) {
        console.error('❌ Error al procesar pago:', error);
        // No fallar el webhook por errores de procesamiento
      }
    } else if (type === 'merchant_order' && data?.id) {
      // Procesar órdenes de comerciante
      console.log(`📦 Procesando orden de comerciante: ${data.id}`);
      
      try {
        // Obtener detalles de la orden desde Mercado Pago
        const orderDetails = await getMerchantOrderDetails(data.id);
        console.log('📋 Detalles de la orden:', orderDetails);
        
        // Procesar la orden si tiene pagos aprobados
        if (orderDetails && orderDetails.payments && orderDetails.payments.length > 0) {
          for (const payment of orderDetails.payments) {
            if (payment.status === 'approved') {
              console.log(`✅ Pago aprobado encontrado en orden: ${payment.id}`);
              await processApprovedPayment(payment);
            }
          }
        }
      } catch (error) {
        console.error('❌ Error al procesar orden de comerciante:', error);
      }
    } else {
      console.log(`ℹ️ Webhook de tipo no manejado: ${type}`);
      console.log('📋 Datos del webhook:', JSON.stringify(body, null, 2));
    }

    // Responder exitosamente al webhook
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook procesado correctamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en webhook de Mercado Pago:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para obtener detalles del pago desde Mercado Pago
async function getPaymentDetails(paymentId: string) {
  try {
    console.log(`🔍 Obteniendo detalles del pago ${paymentId}...`);
    
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error HTTP ${response.status}:`, errorText);
      throw new Error(`Error al obtener pago: ${response.status} - ${errorText}`);
    }

    const paymentData = await response.json();
    console.log(`✅ Detalles del pago ${paymentId} obtenidos:`, {
      id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      amount: paymentData.transaction_amount,
      currency: paymentData.currency_id,
      payer: paymentData.payer,
      payment_method: paymentData.payment_method,
      items: paymentData.items,
      description: paymentData.description
    });

    return paymentData;
  } catch (error) {
    console.error('❌ Error al obtener detalles del pago:', error);
    throw error;
  }
}

// Función para obtener detalles de la orden de comerciante
async function getMerchantOrderDetails(orderId: string) {
  try {
    console.log(`🔍 Obteniendo detalles de la orden ${orderId}...`);
    
    const response = await fetch(
      `https://api.mercadopago.com/merchant_orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error HTTP ${response.status}:`, errorText);
      throw new Error(`Error al obtener orden: ${response.status} - ${errorText}`);
    }

    const orderData = await response.json();
    console.log(`✅ Detalles de la orden ${orderId} obtenidos:`, {
      id: orderData.id,
      status: orderData.status,
      payments: orderData.payments?.length || 0,
      items: orderData.items,
      total_amount: orderData.total_amount
    });

    return orderData;
  } catch (error) {
    console.error('❌ Error al obtener detalles de la orden:', error);
    throw error;
  }
}

// Función para procesar pago aprobado
async function processApprovedPayment(paymentDetails: Record<string, unknown>) {
  try {
    console.log('✅ Procesando pago aprobado:', paymentDetails.id);

    // Preparar datos para Google Sheets
    const orderData = {
      payment_id: (paymentDetails.id as string) || '',
      external_reference: (paymentDetails.external_reference as string) || `MP-${paymentDetails.id}`,
      payer_email: (paymentDetails.payer as Record<string, unknown>)?.email as string || 'No especificado',
      payer_name: (paymentDetails.payer as Record<string, unknown>)?.name as string || 
                  (paymentDetails.payer as Record<string, unknown>)?.first_name as string || 'No especificado',
      amount: (paymentDetails.transaction_amount as number) || 0,
      currency: (paymentDetails.currency_id as string) || 'ARS',
      payment_method: (paymentDetails.payment_method as Record<string, unknown>)?.type as string || 
                     (paymentDetails.payment_method as Record<string, unknown>)?.id as string || 'No especificado',
      installments: (paymentDetails.installments as number) || 1,
      status: (paymentDetails.status as string) || '',
      created_at: (paymentDetails.date_created as string) || new Date().toISOString(),
      approved_at: (paymentDetails.date_approved as string) || new Date().toISOString(),
      items: (paymentDetails.description as string) || 
             (paymentDetails.items as Array<Record<string, unknown>>)?.map((item: Record<string, unknown>) => item.title as string).join(', ') || 'Productos',
      payment_status: 'completed',
      payment_date: (paymentDetails.date_approved as string) || new Date().toISOString(),
      total_items: (paymentDetails.items as Array<Record<string, unknown>>)?.length || 1,
      payment_source: 'mercadopago', // Identificar que viene de Mercado Pago
    };

    console.log('📊 Datos de orden preparados:', orderData);

    // Guardar en Google Sheets
    await saveOrderToSheet(orderData);
    console.log('💾 Orden guardada en Google Sheets');

    // Enviar email de confirmación al cliente
    await sendPaymentConfirmationEmail(orderData);
    console.log('📧 Email de confirmación enviado al cliente');

    // Enviar email de notificación al administrador
    await sendOrderNotificationEmail(orderData);
    console.log('📧 Email de notificación enviado al administrador');

  } catch (error) {
    console.error('❌ Error al procesar pago aprobado:', error);
    // Re-lanzar el error para que se maneje en el nivel superior
    throw error;
  }
}

// Endpoint GET para probar el webhook
export async function GET() {
  return NextResponse.json({
    message: 'Webhook de Mercado Pago funcionando',
    timestamp: new Date().toISOString(),
    status: 'active',
    environment: process.env.NODE_ENV || 'development'
  });
} 
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar que existe el token de acceso
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      console.error('MERCADO_PAGO_ACCESS_TOKEN no está configurado');
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 });
    }

    // Configurar Mercado Pago
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN 
    });

    // Procesar diferentes tipos de notificaciones
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Obtener detalles del pago
      const paymentClient = new Payment(client);
      const payment = await paymentClient.get({ id: paymentId });
      
      // Procesar el pago según su estado
      switch (payment.status) {
        case 'approved':
          await handleApprovedPayment(payment);
          break;
        case 'pending':
          await handlePendingPayment(payment);
          break;
        case 'rejected':
          await handleRejectedPayment(payment);
          break;
        default:
          console.log(`Estado de pago no manejado: ${payment.status}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

async function handleApprovedPayment(payment: any) {
  console.log('Pago aprobado:', {
    id: payment.id,
    external_reference: payment.external_reference,
    amount: payment.transaction_amount,
    payer: payment.payer,
    items: payment.additional_info?.items,
    created_at: payment.date_created,
  });

  // Aquí puedes guardar los datos en tu base de datos
  // Por ejemplo, en Google Sheets, una base de datos, etc.
  
  // Ejemplo de datos que puedes capturar:
  const orderData = {
    payment_id: payment.id,
    external_reference: payment.external_reference,
    status: payment.status,
    amount: payment.transaction_amount,
    currency: payment.currency_id,
    payer_email: payment.payer.email,
    payer_name: `${payment.payer.first_name} ${payment.payer.last_name}`,
    payment_method: payment.payment_method_id,
    installments: payment.installments,
    items: payment.additional_info?.items || [],
    created_at: payment.date_created,
    approved_at: payment.date_approved,
  };

  // Guardar en Google Sheets (si tienes configurado)
  await saveOrderToGoogleSheets(orderData);
}

async function handlePendingPayment(payment: any) {
  console.log('Pago pendiente:', payment.id);
  // Manejar pagos pendientes
}

async function handleRejectedPayment(payment: any) {
  console.log('Pago rechazado:', payment.id);
  // Manejar pagos rechazados
}

async function saveOrderToGoogleSheets(orderData: any) {
  try {
    const { saveOrderToSheet } = await import('@/lib/googleSheets');
    await saveOrderToSheet(orderData);
    console.log('Orden guardada exitosamente en Google Sheets');
  } catch (error) {
    console.error('Error guardando en Google Sheets:', error);
  }
} 
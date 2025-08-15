import nodemailer from 'nodemailer';

// Configuración del transportador de email con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu email de Gmail
    pass: process.env.EMAIL_PASSWORD, // Tu contraseña de aplicación
  },
});

interface OrderData {
  payment_id: string;
  external_reference: string;
  payer_email: string;
  payer_name: string;
  amount: number;
  currency: string;
  payment_method: string;
  installments: number;
  status: string;
  created_at: string;
  approved_at: string;
  items: string;
  payment_status: string;
  payment_date: string;
  total_items: number;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function sendPaymentConfirmationEmail(orderData: OrderData): Promise<EmailResponse> {
  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">¡Pago Confirmado!</h2>
        <p>Hola ${orderData.payer_name},</p>
        <p>Tu pago ha sido procesado exitosamente. Aquí están los detalles:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Detalles del Pago</h3>
          <p><strong>ID de Pago:</strong> ${orderData.payment_id}</p>
          <p><strong>Referencia:</strong> ${orderData.external_reference}</p>
          <p><strong>Monto:</strong> ${orderData.amount} ${orderData.currency}</p>
          <p><strong>Método de Pago:</strong> ${orderData.payment_method}</p>
          <p><strong>Cuotas:</strong> ${orderData.installments}</p>
          <p><strong>Estado:</strong> ${orderData.status}</p>
          <p><strong>Fecha:</strong> ${new Date(orderData.payment_date).toLocaleDateString('es-AR')}</p>
        </div>
        
        <p>Gracias por tu compra. Si tienes alguna pregunta, no dudes en contactarnos.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d;">
          <p>Este es un email automático, por favor no respondas a este mensaje.</p>
        </div>
      </div>
    `;

    const emailData: EmailData = {
      to: orderData.payer_email,
      subject: 'Confirmación de Pago - Ventas Productos',
      html: emailContent
    };

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al enviar email');
    }

    return {
      success: true,
      message: 'Email de confirmación enviado exitosamente'
    };

  } catch (error) {
    console.error('Error al enviar email de confirmación:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

export async function sendOrderNotificationEmail(orderData: OrderData): Promise<EmailResponse> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007bff;">Nueva Orden Recibida</h2>
        <p>Se ha recibido una nueva orden de pago:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Detalles de la Orden</h3>
          <p><strong>ID de Pago:</strong> ${orderData.payment_id}</p>
          <p><strong>Referencia:</strong> ${orderData.external_reference}</p>
          <p><strong>Cliente:</strong> ${orderData.payer_name}</p>
          <p><strong>Email:</strong> ${orderData.payer_email}</p>
          <p><strong>Monto:</strong> ${orderData.amount} ${orderData.currency}</p>
          <p><strong>Método de Pago:</strong> ${orderData.payment_method}</p>
          <p><strong>Estado:</strong> ${orderData.status}</p>
          <p><strong>Fecha:</strong> ${new Date(orderData.payment_date).toLocaleDateString('es-AR')}</p>
        </div>
        
        <p>La orden ha sido procesada y guardada en el sistema.</p>
      </div>
    `;

    const emailData: EmailData = {
      to: adminEmail,
      subject: 'Nueva Orden - Ventas Productos',
      html: emailContent
    };

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al enviar email');
    }

    return {
      success: true,
      message: 'Email de notificación enviado exitosamente'
    };

  } catch (error) {
    console.error('Error al enviar email de notificación:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// Función para probar la conexión de email
export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✓ Conexión de email verificada exitosamente');
    return true;
  } catch (error) {
    console.error('✗ Error en la conexión de email:', error);
    return false;
  }
}

import nodemailer from 'nodemailer';

// Configuración del transportador de email con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu email de Gmail
    pass: process.env.EMAIL_PASSWORD, // Tu contraseña de aplicación
  },
});

// Función para enviar email de confirmación de pago
export async function sendPaymentConfirmationEmail(orderData: any): Promise<void> {
  try {
    // Email para el administrador
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendAdminNotification(orderData, adminEmail);
    }

    // Email para el cliente (si se proporciona)
    if (orderData.payer_email && orderData.payer_email !== 'No especificado') {
      await sendCustomerConfirmation(orderData);
    }

    console.log('✓ Emails de confirmación enviados exitosamente');
  } catch (error) {
    console.error('Error al enviar emails de confirmación:', error);
    // No lanzamos el error para no interrumpir el flujo principal
  }
}

// Función para enviar notificación al administrador
async function sendAdminNotification(orderData: any, adminEmail: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `🛒 Nueva orden recibida - ${orderData.payment_id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🛒 Nueva Orden Recibida</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9fafb;">
          <h2 style="color: #374151;">Detalles de la Orden</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">ID de Pago:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${orderData.payment_id}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Cliente:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${orderData.payer_name}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${orderData.payer_email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Monto:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">$${(orderData.amount / 100).toFixed(2)} ${orderData.currency}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Método:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${orderData.payment_method}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Estado:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db; color: #059669;">${orderData.status}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Fecha:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${new Date(orderData.created_at).toLocaleString('es-ES')}</td>
            </tr>
          </table>
          
          <h3 style="color: #374151;">Productos Comprados</h3>
          <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
            ${orderData.items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                <span>${item.name} x${item.quantity}</span>
                <span style="font-weight: bold;">$${(item.price / 100).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #10B981; color: white; border-radius: 8px; text-align: center;">
            <strong>Total: $${(orderData.amount / 100).toFixed(2)} ${orderData.currency}</strong>
          </div>
        </div>
        
        <div style="background-color: #6B7280; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">Este email fue enviado automáticamente por tu sistema de ventas</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log('✓ Notificación enviada al administrador:', adminEmail);
}

// Función para enviar confirmación al cliente
async function sendCustomerConfirmation(orderData: any): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: orderData.payer_email,
    subject: `✅ Confirmación de tu compra - ${orderData.payment_id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10B981; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">✅ ¡Gracias por tu compra!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9fafb;">
          <p style="color: #374151; font-size: 16px;">Hola <strong>${orderData.payer_name}</strong>,</p>
          
          <p style="color: #6B7280;">Tu pedido ha sido procesado exitosamente. Aquí tienes los detalles:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Resumen de la Orden</h3>
            <p style="margin: 5px 0;"><strong>ID de Orden:</strong> ${orderData.payment_id}</p>
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(orderData.created_at).toLocaleString('es-ES')}</p>
            <p style="margin: 5px 0;"><strong>Total:</strong> $${(orderData.amount / 100).toFixed(2)} ${orderData.currency}</p>
          </div>
          
          <h3 style="color: #374151;">Productos Comprados</h3>
          <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
            ${orderData.items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                <span>${item.name} x${item.quantity}</span>
                <span style="font-weight: bold;">$${(item.price / 100).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #3B82F6; color: white; border-radius: 8px; text-align: center;">
            <strong>Total: $${(orderData.amount / 100).toFixed(2)} ${orderData.currency}</strong>
          </div>
          
          <p style="color: #6B7280; margin-top: 20px;">
            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
          </p>
        </div>
        
        <div style="background-color: #6B7280; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">Gracias por confiar en nosotros</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log('✓ Confirmación enviada al cliente:', orderData.payer_email);
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

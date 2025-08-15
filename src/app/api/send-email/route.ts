import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Iniciando envío de email...');
    
    // Verificar variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Variables de entorno de email no configuradas');
      return NextResponse.json(
        { error: 'Configuración de email incompleta' },
        { status: 500 }
      );
    }

    // Obtener datos del email
    const emailData: EmailData = await request.json();
    console.log('📨 Datos del email:', {
      to: emailData.to,
      subject: emailData.subject
    });

    // Configurar transportador de email
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Contraseña de aplicación de Gmail
      },
    });

    // Configurar opciones del email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Email enviado exitosamente',
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    
    let errorMessage = 'Error interno del servidor';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Endpoint GET para probar la conexión de email
export async function GET() {
  try {
    console.log('🔍 Probando conexión de email...');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json(
        { error: 'Variables de entorno no configuradas' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verificar conexión
    await transporter.verify();
    
    return NextResponse.json({
      success: true,
      message: 'Conexión de email exitosa',
      email: process.env.EMAIL_USER,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Error al probar conexión de email:', error);
    return NextResponse.json(
      { error: 'Error de conexión de email' },
      { status: 500 }
    );
  }
}

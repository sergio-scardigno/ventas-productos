import { NextResponse } from 'next/server';

// Datos de ejemplo para desarrollo
const mockProducts = [
  {
    id: '1',
    name: 'Laptop Gaming',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
    description: 'Laptop gaming de alto rendimiento con gráficos dedicados',
    stock: 10,
  },
  {
    id: '2',
    name: 'Smartphone Pro',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    description: 'Smartphone de última generación con cámara profesional',
    stock: 15,
  },
  {
    id: '3',
    name: 'Auriculares Wireless',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    description: 'Auriculares bluetooth con cancelación de ruido',
    stock: 20,
  },
  {
    id: '4',
    name: 'Tablet Pro',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    description: 'Tablet profesional para trabajo y entretenimiento',
    stock: 8,
  },
  {
    id: '5',
    name: 'Smartwatch',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description: 'Reloj inteligente con monitoreo de salud',
    stock: 12,
  },
  {
    id: '6',
    name: 'Cámara DSLR',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    description: 'Cámara réflex digital profesional',
    stock: 5,
  },
];

export async function GET() {
  try {
    // Por ahora, devolvemos productos de ejemplo
    // En producción, esto se conectaría con Google Sheets
    return NextResponse.json(mockProducts);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
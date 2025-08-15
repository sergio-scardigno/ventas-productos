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

interface ProductData {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
}

// Función para guardar orden en Google Sheets
export async function saveOrderToSheet(orderData: OrderData): Promise<void> {
  try {
    console.log('💾 Guardando orden en Google Sheets:', orderData);

    // Usar URL absoluta para evitar problemas en el servidor
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/save-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al guardar orden');
    }

    console.log('✅ Orden guardada exitosamente en Google Sheets');
  } catch (error) {
    console.error('❌ Error al guardar orden en Google Sheets:', error);
    throw error;
  }
}

// Función para obtener productos desde Google Sheets
export async function getProductsFromSheet(): Promise<ProductData[]> {
  try {
    console.log('📋 Obteniendo productos desde Google Sheets...');

    const response = await fetch('/api/products');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener productos');
    }

    const products: ProductData[] = await response.json();
    console.log(`✅ ${products.length} productos obtenidos desde Google Sheets`);
    
    return products;
  } catch (error) {
    console.error('❌ Error al obtener productos desde Google Sheets:', error);
    throw error;
  }
}

// Función para guardar producto en Google Sheets
export async function saveProductToSheet(productData: ProductData): Promise<void> {
  try {
    console.log('💾 Guardando producto en Google Sheets:', productData);

    const response = await fetch('/api/save-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al guardar producto');
    }

    console.log('✅ Producto guardado exitosamente en Google Sheets');
  } catch (error) {
    console.error('❌ Error al guardar producto en Google Sheets:', error);
    throw error;
  }
}

// Función para actualizar producto en Google Sheets
export async function updateProductInSheet(productId: string, updates: Partial<ProductData>): Promise<void> {
  try {
    console.log('🔄 Actualizando producto en Google Sheets:', { productId, updates });

    const response = await fetch('/api/update-product', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, updates }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar producto');
    }

    console.log('✅ Producto actualizado exitosamente en Google Sheets');
  } catch (error) {
    console.error('❌ Error al actualizar producto en Google Sheets:', error);
    throw error;
  }
}

// Función para eliminar producto de Google Sheets
export async function deleteProductFromSheet(productId: string): Promise<void> {
  try {
    console.log('🗑️ Eliminando producto de Google Sheets:', productId);

    const response = await fetch('/api/delete-product', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar producto');
    }

    console.log('✅ Producto eliminado exitosamente de Google Sheets');
  } catch (error) {
    console.error('❌ Error al eliminar producto de Google Sheets:', error);
    throw error;
  }
}

import { google } from 'googleapis';
import { Product } from '@/types';

// Configuración de Google Sheets API
// Configuración de Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: "sergio@just-glow-468123-v4.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5XPs/cqIwMEXl\ndAHqrYlNt6S2Ax0Iv7vg/bf5G5qdxSP1I2U2QV/GV757rJQeg62/FlFCTdSgJffv\nyAlSSJz254BHeKArKaIB6OmrXNdP8FOD5NpSN9gZtAwUL54gUv+lHgYtrLKpV3KG\nQFiSgtYlhp9GonmTwKWpI6Au/Yq9KV+3f/z9gXqMg58+jIUgYQSDFNdDaBWLVZ/y\nc5ErHqpO72jPhdySE9IXzJWcL0Ls4bYx+kLeOwvwn6UmtvVoYFp5R3gjSvpVD83X\nEslLJtO0r5KcuDzWniZW/DGgU2NLQ81qfaQ/UxklG1yOZsehh5S9ObOYe1RnN9Sg\nBqVd/eNTAgMBAAECggEAHvny4r99ayAmDho818L4VwyBcglDKNshwo+j1vVN+V+g\niq7HkzGJl9PB+Vj1x8OpnW1VVwc6qSivLlr3c9C+qmQ1g7wcyBnFARyzL/fr42f+\nDOSJt4OtkV4NRrJOcohsQGOsFKXvlW0Prm/CXXmP3+WHaH5uYsqm5IUXl8K3FLUz\n/p3jH93AEYhyU7x+Stfy7i6ODZW6lghL0j5B6m5zXpkf6Q1abHVkOeagBtNXQaAJ\n14JZw3U5miO3L2rj9Icp58w1Ptd9Kl7lgLkq90oggo3e+N7aTiexULtxKbm7WzaJ\nBouYxxP2HLeT65ci3od1Zs4jla2QzLvqhK7zvvNmAQKBgQD1ZKe3Q3A6B3Gl4ltv\n0nsZnb0OFFRql8PglUN3/Yre9JAdRM9fP9HuCcbwzKAgFiwPk11OlzPD7gPuSRRN\nlW2vHaWLuWX3836Xm5T8CnkszHfzakMlqV9dQinKdVxQtpAv61q4oUuCZZG65Sbt\nKRB8Wc4g6kZ0Rcz+cE0cf9KkMwKBgQDBYBPiS+e9c3r6AqW48WAURB23skLJh/ps\nRxLUWMPneL9yYvI/YfgynEK/PK/n0X14cRMbaUXOqdjU5jBSMU8VORT/Csn86irt\nT+e+SDnnr5hDmPunm+a4zXbqsYkvow5lpwu/nDxjTtT6CXtazj4n8yOF4BuqmGy5\nX++RJQ+kYQKBgQCq2NVb5nvwKtaZI6t9gxFpmETT1JuhSuB5L/K1S7Sv3Z2ogwvN\nyOUj0XLMm+qv7D/o6DSCTwsfUksyT3bvPSYMUZu8V+wCYWi1rQBhKfmLkx/APS9a\nvT1D9Jib+HG5UCG6+yVCfinQM17uvDQJ0hlEOlIk4HcE5MQAMbe+K9A/uQKBgA6P\ntI+a1aV/d6gx4NbPXkPIaVB23O6eDa5vn6xbzsy0W/46EzHQp8bv21rZMAnNzZvv\nL9glkjsgsRI/Dy5xRho8BSe7YUBpRbg/Bx1eBPY8U8PrVi/l3nbWCflcSw9KQQBI\nlurj0exMeF8nraFF3IpXlbo0CQFMnwtKfRi56LahAoGAXLQ4VlSfuGsuaZJGyDPy\nPGcqgbwK9xL/bmMo9quj00hijIkjFGjeAUDb4URiBaszN57L2fJM02e8M4XPPQRc\nTCHK1jWEY2N9ncTeJ/ym+AUOL5zMD88HuJMeOf5cPwiytTobKtNoXFEERinxwLD+\n+DleaWeS+cS1TjMdTTFgl/c=\n-----END PRIVATE KEY-----\n",
  },
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/spreadsheets'
  ],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getProductsFromSheet(): Promise<Product[]> {
  try {
    const spreadsheetId = "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";
    const range = 'Productos!A2:F';

    console.log('Intentando conectar con Google Sheets:', spreadsheetId);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log('No se encontraron datos en la hoja');
      return [];
    }

    // Convertir filas a productos
    const products: Product[] = rows.map((row, index) => ({
      id: row[0] || `product-${index}`,
      name: row[1] || '',
      price: parseFloat(row[2]) || 0,
      image: row[3] || '',
      description: row[4] || '',
      stock: parseInt(row[5]) || 0,
    }));

    // Filtrar productos válidos (con nombre y precio)
    return products.filter(product => product.name && product.price > 0);

  } catch (error) {
    console.error('Error al leer Google Sheets:', error);
    throw new Error('Error al cargar productos desde Google Sheets');
  }
}

// Función para desarrollo con datos de ejemplo
export function getMockProducts(): Product[] {
  return [
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
}

// Función para guardar órdenes en Google Sheets
export async function saveOrderToSheet(orderData: any): Promise<void> {
  try {
    const spreadsheetId = "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";

    // Crear fila con los datos de la orden
    const orderRow = [
      orderData.payment_id,
      orderData.external_reference,
      orderData.payer_email,
      orderData.payer_name,
      orderData.amount,
      orderData.currency,
      orderData.payment_method,
      orderData.installments,
      orderData.status,
      orderData.created_at,
      orderData.approved_at,
      JSON.stringify(orderData.items), // Productos comprados
    ];

    // Agregar la fila al final de la hoja de órdenes
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Orders!A:L', // Asumiendo que tienes una hoja llamada "Orders"
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [orderRow],
      },
    });

    console.log('Orden guardada exitosamente en Google Sheets');
  } catch (error) {
    console.error('Error al guardar orden en Google Sheets:', error);
    throw error;
  }
}

// Función para obtener todas las órdenes
export async function getOrdersFromSheet(): Promise<any[]> {
  try {
    const spreadsheetId = "19_iMYzqcG9_aoYeFIIKGAG8u9PI61Oh78vcnP5a-4Zc";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Orders!A:L', // Asumiendo que tienes una hoja llamada "Orders"
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Convertir filas a objetos de orden
    const orders = rows.slice(1).map((row) => ({
      payment_id: row[0],
      external_reference: row[1],
      payer_email: row[2],
      payer_name: row[3],
      amount: parseFloat(row[4]),
      currency: row[5],
      payment_method: row[6],
      installments: parseInt(row[7]),
      status: row[8],
      created_at: row[9],
      approved_at: row[10],
      items: row[11] ? JSON.parse(row[11]) : [],
    }));

    return orders;
  } catch (error) {
    console.error('Error al leer órdenes desde Google Sheets:', error);
    throw error;
  }
} 
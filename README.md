# 🛍️ Tienda Online con Next.js

Una aplicación web completa de e-commerce construida con Next.js, que incluye integración con Google Sheets para gestión de productos y Mercado Pago para procesamiento de pagos.

## ✨ Características

- **📊 Gestión de Productos**: Lectura automática desde Google Sheets
- **🛒 Carrito de Compras**: Persistencia en localStorage con Zustand
- **💳 Pagos Seguros**: Integración completa con Mercado Pago
- **📱 Diseño Responsivo**: Interfaz moderna con Tailwind CSS
- **⚡ Performance**: Optimizado con Next.js 14 y App Router

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd ventas-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env.local
   ```

4. **Configurar Google Sheets API**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la Google Sheets API
   - Crea una cuenta de servicio y descarga el archivo JSON
   - Comparte tu hoja de Google Sheets con el email de la cuenta de servicio

5. **Configurar Mercado Pago**
   - Crea una cuenta en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
   - Obtén tu Access Token desde el panel de desarrolladores
   - Configura las URLs de retorno en tu aplicación

6. **Configurar PayPal**
   - Crea una cuenta en [PayPal Developer](https://developer.paypal.com/)
   - Crea una aplicación en el Developer Dashboard
   - Obtén tu Client ID para el entorno de sandbox o producción

7. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 📋 Configuración de Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu clave privada aquí\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=tu-google-sheet-id
GOOGLE_SHEET_RANGE=A2:F

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=tu-mercadopago-access-token

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu-paypal-client-id

# Configuración de la App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 📊 Estructura de Google Sheets

Tu hoja de Google Sheets debe tener la siguiente estructura:

| ID | Nombre | Precio | Imagen | Descripción | Stock |
|----|--------|--------|--------|-------------|-------|
| 1  | Laptop Gaming | 150000 | https://... | Descripción... | 10 |
| 2  | Smartphone | 80000 | https://... | Descripción... | 15 |

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── create-preference/    # API Mercado Pago
│   │   └── products/             # API Productos
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Cart.tsx                  # Carrito de compras
│   ├── Header.tsx                # Header de navegación
│   ├── ProductCard.tsx           # Tarjeta de producto
│   └── ProductGrid.tsx           # Grilla de productos
├── lib/
│   ├── googleSheets.ts           # Utilidades Google Sheets
│   └── utils.ts                  # Utilidades generales
├── store/
│   └── cartStore.ts              # Store Zustand
└── types/
    └── index.ts                  # Tipos TypeScript
```

## 🛒 Funcionalidades del Carrito

- ✅ Agregar productos con cantidad personalizable
- ✅ Persistencia en localStorage
- ✅ Actualizar cantidades
- ✅ Eliminar productos
- ✅ Cálculo automático del total
- ✅ Integración con Mercado Pago

## 💳 Integración de Pagos

### Mercado Pago
La aplicación utiliza el Checkout Pro de Mercado Pago:

1. **Creación de Preferencia**: Se crea una preferencia de pago con los items del carrito
2. **Redirección**: El usuario es redirigido al checkout de Mercado Pago
3. **Retorno**: Después del pago, el usuario regresa a la aplicación

### PayPal
Integración con PayPal Checkout:

1. **Selección de Método**: El usuario puede elegir entre Mercado Pago y PayPal
2. **Botón de PayPal**: Integración directa con el SDK de PayPal
3. **Procesamiento**: Pago seguro a través de la plataforma de PayPal

## 🎨 Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Zustand** - Gestión de estado
- **Google Sheets API** - Gestión de productos
- **Mercado Pago SDK** - Procesamiento de pagos
- **PayPal React SDK** - Integración con PayPal
- **Lucide React** - Iconos

## 📱 Características Responsivas

- Diseño mobile-first
- Grilla adaptativa (1-4 columnas según pantalla)
- Modal de carrito optimizado para móviles
- Navegación responsive

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción
npm run start        # Producción
npm run lint         # Linting
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. ¡Listo! Tu aplicación se desplegará automáticamente

### Otros Proveedores
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de las APIs:
   - [Google Sheets API](https://developers.google.com/sheets/api)
   - [Mercado Pago API](https://www.mercadopago.com.ar/developers/es/docs)
2. Abre un issue en el repositorio
3. Contacta al equipo de desarrollo

---

¡Gracias por usar nuestra tienda online! 🎉

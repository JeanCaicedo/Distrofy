# 🛍️ Distrofy - Marketplace de Productos Digitales

Un marketplace moderno para la venta de productos digitales, inspirado en plataformas como Gumroad.

## 🎯 Objetivo General

Desarrollar una aplicación web completa donde:

- **Vendedores** puedan registrarse, subir productos digitales y venderlos
- **Compradores** puedan descubrir, comprar y descargar productos digitales
- **Sistema** administre pagos, descargas seguras y panel de administración

## 🧱 Stack Tecnológico

| Área | Herramienta |
|------|-------------|
| **Frontend** | React + React Router + Context/Redux |
| **Backend** | Node.js + Express |
| **Base de datos** | MongoDB + Mongoose |
| **Almacenamiento** | Cloudinary o AWS S3 |
| **Pagos** | Stripe API (modo sandbox) |
| **Autenticación** | JWT + bcrypt |

## 📦 Funcionalidades Principales

### 👤 Gestión de Usuarios
- ✅ Registro y login con JWT
- ✅ Roles diferenciados: **vendedor** y **cliente**
- ✅ Panel de control personalizado para cada rol
- ✅ Visualización de productos subidos/comprados

### 📁 Productos Digitales
- ✅ Subida de archivos múltiples (PDFs, ZIPs, MP3s, etc.)
- ✅ Gestión completa: título, descripción, precio, categoría
- ✅ Almacenamiento seguro en la nube (Cloudinary/AWS S3)
- ✅ Categorización y búsqueda de productos

### 💳 Sistema de Compras
- ✅ Integración completa con Stripe Checkout (sandbox)
- ✅ Validación de pagos antes de permitir descarga
- ✅ Historial detallado de compras
- ✅ Gestión de transacciones fallidas

### 🔐 Descargas Seguras
- ✅ Acceso restringido solo a compradores verificados
- ✅ URLs con expiración temporal
- ✅ Tokens de descarga únicos
- ✅ Prevención de compartido no autorizado

### 🛠️ Panel de Administración
- ✅ Gestión de usuarios registrados
- ✅ Moderación de productos
- ✅ Herramientas de baneos y eliminación
- ✅ Estadísticas básicas de la plataforma

## 🗃️ Esquema de Base de Datos (MongoDB)

### Colección: Users
```javascript
User: {
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String,
  role: 'vendedor' | 'cliente',
  purchasedProducts: [ObjectId], // referencias a Product
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}
```

### Colección: Products
```javascript
Product: {
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  category: String,
  fileUrl: String, // URL del archivo en Cloudinary/S3
  thumbnailUrl: String, // imagen de vista previa
  sellerId: ObjectId, // referencia a User
  downloads: Number, // contador de descargas
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: Purchases
```javascript
Purchase: {
  _id: ObjectId,
  userId: ObjectId, // referencia a User
  productId: ObjectId, // referencia a Product
  paymentIntentId: String, // ID de Stripe
  amount: Number,
  paid: Boolean,
  downloadToken: String, // token único para descarga
  downloadExpiry: Date,
  purchasedAt: Date
}
```

## 🚀 Plan de Desarrollo (5 Semanas)

### 🧱 Semana 1 – Fundación del Proyecto
- [ ] **Setup del entorno de desarrollo**
  - Inicializar repositorio Git
  - Configurar estructura de carpetas (frontend/backend)
  - Setup de React con Vite/Create React App
  - Configuración de Express.js
  - Conexión inicial a MongoDB

- [ ] **Sistema de autenticación**
  - Modelo de usuarios con Mongoose
  - Endpoints de registro y login
  - Implementación de JWT
  - Middleware de autenticación
  - Páginas de registro/login en React

### 💾 Semana 2 – Gestión de Productos
- [ ] **Backend de productos**
  - Modelo de productos en MongoDB
  - CRUD completo de productos
  - Validaciones de servidor

- [ ] **Subida de archivos**
  - Integración con Cloudinary o AWS S3
  - Endpoint para subida de archivos
  - Validación de tipos de archivo
  - Optimización de imágenes de vista previa

- [ ] **Frontend de productos**
  - Formulario de creación de productos
  - Lista de productos del vendedor
  - Catálogo público de productos

### 💰 Semana 3 – Sistema de Pagos
- [ ] **Integración con Stripe**
  - Configuración de Stripe en modo sandbox
  - Creación de checkout sessions
  - Webhook para confirmación de pagos
  - Manejo de errores de pago

- [ ] **Base de datos de compras**
  - Modelo de compras
  - Guardado de transacciones exitosas
  - Actualización de estado de compras

### 📥 Semana 4 – Descargas y Perfiles de Usuario
- [ ] **Sistema de descargas seguras**
  - Generación de tokens temporales
  - Endpoint protegido de descarga
  - Validación de permisos de descarga
  - Expiración automática de enlaces

- [ ] **Perfiles de usuario**
  - Panel "Mis productos comprados"
  - Panel "Mis productos en venta"
  - Estadísticas básicas
  - Historial de transacciones

- [ ] **Páginas de detalle**
  - Vista detallada de productos
  - Proceso de compra optimizado
  - Reviews y valoraciones (opcional)

### 🎨 Semana 5 – Pulimiento y Deploy
- [ ] **Diseño y UX**
  - Implementación de diseño responsive
  - Mejora de la experiencia de usuario
  - Optimización de rendimiento
  - Testing de usabilidad

- [ ] **Panel de administración**
  - Dashboard básico de admin
  - Gestión de usuarios y productos
  - Herramientas de moderación

- [ ] **Deploy y producción**
  - Deploy del frontend en Vercel/Netlify
  - Deploy del backend en Render/Railway
  - Configuración de variables de entorno
  - Testing en producción
  - Documentación final

## 🔧 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo frontend
npm run dev:frontend

# Desarrollo backend
npm run dev:backend

# Desarrollo completo (concurrente)
npm run dev

# Build para producción
npm run build

# Tests
npm run test
```

## 📝 Variables de Entorno Requeridas

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/distrofy

# JWT
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Almacenamiento (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

## 🤝 Contribución

Este proyecto está en desarrollo activo. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para la comunidad de creadores digitales** 
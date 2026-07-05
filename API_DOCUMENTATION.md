# 📚 Documentación de la API - Distrofy Backend

## 🚀 Endpoints Implementados

### Autenticación

#### 1. Health Check
```
GET /api/auth/health
```
**Descripción:** Verifica que el servicio de autenticación esté funcionando.

**Respuesta:**
```json
"Auth service is running!"
```

#### 2. Registro de Usuario
```
POST /api/auth/register
```
**Descripción:** Registra un nuevo usuario en el sistema.

**Body:**
```json
{
  "name": "Nombre del Usuario",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "role": "CLIENT"
}
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "usuario@ejemplo.com",
  "role": "CLIENT",
  "name": "Nombre del Usuario"
}
```

#### 3. Login de Usuario
```
POST /api/auth/login
```
**Descripción:** Autentica un usuario existente.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "usuario@ejemplo.com",
  "role": "CLIENT",
  "name": "Nombre del Usuario"
}
```

### Productos

#### 4. Catálogo público
```
GET /api/products/public            (query opcional: ?category=ebooks)
GET /api/products/public/{id}
```
**Descripción:** Lista los productos activos / detalle de un producto. No requiere autenticación. La respuesta nunca incluye `fileUrl` (solo se obtiene con un token de descarga).

**Respuesta (elemento):**
```json
{
  "id": 1,
  "title": "Plantilla de CV",
  "description": "...",
  "price": 9.99,
  "category": "plantillas",
  "thumbnailUrl": "https://...",
  "sellerId": 2,
  "sellerName": "Ana",
  "downloads": 14,
  "createdAt": "2026-07-04T10:00:00"
}
```

#### 5. Gestión del vendedor (requiere JWT, rol VENDOR o ADMIN)
```
GET    /api/products/mine        → mis productos
POST   /api/products             → publicar producto
PUT    /api/products/{id}        → editar (solo dueño o ADMIN)
DELETE /api/products/{id}        → retirar (baja lógica, solo dueño o ADMIN)
```

**Body de POST/PUT:**
```json
{
  "title": "Plantilla de CV",
  "description": "Plantilla editable en Figma",
  "price": 9.99,
  "category": "plantillas",
  "fileUrl": "https://storage/archivo.zip",
  "thumbnailUrl": "https://storage/miniatura.png"
}
```

### Compras y descargas

#### 6. Checkout (requiere JWT)
```
POST /api/purchases
```
**Body:** `{ "productId": 1 }`

**Descripción:** Checkout **simulado**: registra la compra como pagada y genera un token de descarga válido por 7 días. Cuando se integre Stripe, este endpoint creará un PaymentIntent y el webhook marcará el pago. Si ya compraste el producto y el token sigue vigente, devuelve la compra existente.

**Respuesta:**
```json
{
  "id": 10,
  "productId": 1,
  "productTitle": "Plantilla de CV",
  "amount": 9.99,
  "paid": true,
  "downloadToken": "3f6c1a...",
  "downloadExpiry": "2026-07-11T10:00:00",
  "purchasedAt": "2026-07-04T10:00:00"
}
```

#### 7. Historial de compras (requiere JWT)
```
GET /api/purchases
```

#### 8. Canjear descarga (público: el token es el secreto)
```
GET /api/downloads/{token}
```
**Respuesta:** `{ "title": "...", "fileUrl": "https://..." }` — incrementa el contador de descargas. Errores: `404` token inválido, `402` compra no pagada, `410` token expirado.

## 🔧 Configuración

### Base de Datos
- **Tipo:** PostgreSQL
- **URL:** `jdbc:postgresql://localhost:5432/distrofy` (variable `DB_URL`)
- **Usuario:** variable `DB_USERNAME` (default dev: `distrofy_user`)
- **Contraseña:** variable `DB_PASSWORD`

### JWT
- **Algoritmo:** HS512
- **Expiración:** 24 horas (86400000 ms)
- **Secret:** Configurado en `application.properties`

## 🛡️ Seguridad

### Rutas Públicas
- `/api/auth/**` - Endpoints de autenticación
- `/api/health` - Health check
- `/api/products/public/**` - Catálogo público
- `/api/downloads/**` - Canje de tokens de descarga

### Rutas Protegidas
- Todas las demás rutas requieren autenticación JWT

### Headers Requeridos
Para endpoints protegidos:
```
Authorization: Bearer <jwt_token>
```

## 🚀 Cómo Ejecutar

### 1. Configurar Base de Datos
```sql
CREATE DATABASE distrofy;
CREATE USER distrofy_user WITH PASSWORD 'jeanjean123';
GRANT ALL PRIVILEGES ON DATABASE distrofy TO distrofy_user;
```

### 2. Ejecutar Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Probar Endpoints
```bash
curl http://localhost:8080/api/auth/health

curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'

curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

## 📝 Códigos de Error

### 400 - Bad Request
- Validación de campos fallida
- Email ya registrado
- Datos de entrada inválidos

### 401 - Unauthorized
- Credenciales inválidas
- Token JWT inválido o expirado

### 500 - Internal Server Error
- Error interno del servidor

## 🔄 Próximos Pasos

1. **Integrar Stripe** (PaymentIntent + webhook; hoy el checkout es simulado)
2. **Subida real de archivos** (hoy los productos referencian URLs externas)
3. **Implementar panel de administración**
4. **Implementar refresh tokens**
5. **Agregar logging y monitoreo**

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contacta al equipo de desarrollo. 
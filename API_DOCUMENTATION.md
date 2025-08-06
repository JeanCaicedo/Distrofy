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

## 🔧 Configuración

### Base de Datos
- **Tipo:** PostgreSQL
- **URL:** `jdbc:postgresql://localhost:5432/distrofy`
- **Usuario:** `distrofy_user`
- **Contraseña:** `jeanjean123`

### JWT
- **Algoritmo:** HS512
- **Expiración:** 24 horas (86400000 ms)
- **Secret:** Configurado en `application.properties`

## 🛡️ Seguridad

### Rutas Públicas
- `/api/auth/**` - Endpoints de autenticación
- `/api/health` - Health check
- `/api/products/public/**` - Productos públicos (futuro)

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

1. **Implementar controladores para productos**
2. **Agregar gestión de archivos**
3. **Integrar sistema de pagos**
4. **Implementar panel de administración**
5. **Agregar validaciones adicionales**
6. **Implementar refresh tokens**
7. **Agregar logging y monitoreo**

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contacta al equipo de desarrollo. 
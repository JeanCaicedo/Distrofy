# Distrofy

Marketplace de productos digitales inspirado en Gumroad, construido con Spring Boot y Angular. Permite a creadores publicar productos digitales y a compradores adquirirlos mediante pasarela de pagos.

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## Descripción

Distrofy es una aplicación web orientada a la venta de productos digitales (PDFs, ZIPs, audio, etc.) con un modelo similar al de Gumroad. El proyecto plantea dos roles diferenciados (vendedor y comprador), autenticación basada en JWT, integración con Stripe en modo sandbox para pagos y descargas seguras mediante URLs con expiración.

El repositorio está organizado como monorepo con backend Spring Boot y frontend Angular independientes, orquestados mediante `docker-compose`. La base de datos relacional es PostgreSQL.

> Nota sobre el nombre: a pesar de la similitud con "Spotify", Distrofy no es un clon de servicios de streaming musical, sino una plataforma de venta de productos digitales.

## Stack tecnológico

- **Backend:** Java 17, Spring Boot 3.5.4, Spring Security, Spring Data JPA, Hibernate 6, JJWT 0.11.5, Lombok, Bean Validation
- **Frontend:** Angular 20, TypeScript 5.8, Angular Material, Angular CDK, NgRx (Store, Effects, Entity), RxJS, SSR con Express
- **Base de datos:** PostgreSQL 15
- **Pagos:** Stripe (modo sandbox, planificado)
- **Autenticación:** JWT firmado con HS256
- **Contenedores:** Docker, Docker Compose (configuraciones dev, local y prod)
- **Testing:** JUnit 5, Spring Security Test, Jasmine, Karma

## Arquitectura

```
Distrofy/
├── backend/                     Spring Boot (Java 17, Maven)
│   ├── src/main/java/com/distrofy/backend/
│   │   ├── config/              SecurityConfig
│   │   ├── controller/          AuthController
│   │   ├── dto/                 AuthRequest, AuthResponse, RegisterRequest
│   │   ├── exception/           GlobalExceptionHandler
│   │   ├── model/               User, Product, Purchase, UserRole
│   │   ├── repository/          UserRepository, ProductRepository, PurchaseRepository
│   │   ├── security/            JwtTokenUtil, JwtAuthenticationFilter, CustomUserDetailsService
│   │   └── service/             AuthService
│   └── pom.xml
├── distrofy-frontend/           Angular 20 (TypeScript, SSR)
│   ├── src/
│   ├── angular.json
│   └── package.json
├── scripts/                     Scripts de setup Docker (ps1 / sh)
├── docker-compose.yml           Producción
├── docker-compose.dev.yml       Desarrollo con hot reload
├── docker-compose.local.yml     Ejecución local
├── database_setup.sql           Inicialización de esquema PostgreSQL
├── env.example                  Plantilla de variables de entorno
├── API_DOCUMENTATION.md         Documentación de endpoints
└── DOCKER_README.md             Guía detallada de Docker
```

## Requisitos previos

- Java 17 (JDK)
- Maven 3.9+ (o usar el `mvnw` incluido)
- Node.js 18+ y npm
- Angular CLI 20 (`npm install -g @angular/cli`)
- Docker 24+ y Docker Compose v2
- PostgreSQL 15 si se prefiere instalación local en lugar del contenedor
- Cuenta de Stripe con API keys de prueba (para cuando se habilite el flujo de pagos)

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/JeanCaicedo/Distrofy.git
cd Distrofy
```

Copiar la plantilla de variables de entorno:

```bash
cp env.example .env
```

Construir y levantar todo el stack con Docker Compose:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

O, alternativamente, usando los scripts incluidos:

```bash
# Windows (PowerShell)
.\scripts\docker-setup.ps1 dev

# Linux / macOS
./scripts/docker-setup.sh dev
```

## Variables de entorno

Configurar `.env` en la raíz del proyecto. Valores mínimos:

```env
# Base de datos
POSTGRES_DB=distrofy
POSTGRES_USER=distrofy_user
POSTGRES_PASSWORD=<password_postgres>

# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/distrofy
SPRING_DATASOURCE_USERNAME=distrofy_user
SPRING_DATASOURCE_PASSWORD=<password_postgres>
SPRING_JPA_HIBERNATE_DDL_AUTO=update

# JWT (HS512 requiere una clave de al menos 64 bytes; genera una con: openssl rand -base64 64)
JWT_SECRET=<clave_secreta_larga_y_aleatoria>
JWT_EXPIRATION=86400000

# Servidor
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api

# Stripe (cuando se habilite el flujo de pagos)
STRIPE_API_KEY=sk_test_<tu_clave_sandbox>
STRIPE_WEBHOOK_SECRET=whsec_<tu_webhook_secret>
STRIPE_PUBLIC_KEY=pk_test_<tu_clave_publica>
```

No comitear el archivo `.env`. Mantener únicamente `env.example` con placeholders en el repositorio.

## Ejecución

### Todo el stack con Docker

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Servicios disponibles:
- Frontend Angular: http://localhost:4200
- Backend Spring Boot: http://localhost:8080/api
- PostgreSQL: localhost:5432

### Backend de forma independiente

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend de forma independiente

```bash
cd distrofy-frontend
npm install
npm start
```

### Tests

```bash
# Backend
cd backend && ./mvnw test

# Frontend
cd distrofy-frontend && npm test
```

## Endpoints principales

Endpoints implementados actualmente en el backend:

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario (nombre, email, password, rol) |
| POST | `/api/auth/login` | Login, devuelve JWT |
| GET | `/api/auth/health` | Healthcheck del servicio de autenticación |
| GET | `/api/products/public` | Catálogo público (filtro opcional `?category=`) |
| GET | `/api/products/public/{id}` | Detalle de producto |
| GET | `/api/products/mine` | Productos del vendedor autenticado |
| POST/PUT/DELETE | `/api/products` | Publicar / editar / retirar producto (VENDOR) |
| POST | `/api/purchases` | Checkout (simulado, genera token de descarga) |
| GET | `/api/purchases` | Historial de compras del usuario |
| GET | `/api/downloads/{token}` | Canjear token de descarga |

Endpoints planificados:
- Checkout real y webhooks Stripe (`/api/payments`, `/api/webhooks/stripe`)
- Subida de archivos (hoy los productos referencian URLs externas)

Para el detalle completo de contratos y payloads, ver `API_DOCUMENTATION.md`.

## Estado del proyecto

Proyecto en desarrollo activo y **no apto para producción**. El flujo completo del marketplace ya funciona end-to-end: registro/login con JWT, publicación de productos (rol VENDOR), catálogo público, detalle, carrito, checkout **simulado** (sin pasarela real) e historial de compras con descargas por token temporal (7 días). El frontend Angular 20 usa componentes standalone con signals, guards por rol e interceptor JWT.

Pendiente: integración real de Stripe (el checkout actual marca las compras como pagadas directamente), subida de archivos a storage propio y tests.

La integración con Stripe está prevista en modo sandbox únicamente; no hay credenciales de producción configuradas ni planificadas en esta etapa.

## Autor

Jean Caicedo — [@JeanCaicedo](https://github.com/JeanCaicedo)

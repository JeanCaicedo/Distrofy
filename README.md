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
| **Frontend** | Angular 17+ + NgRx (state management) |
| **Backend** | Spring Boot 3+ + Spring Security + Spring Data JPA |
| **Base de datos** | PostgreSQL |
| **Almacenamiento** | AWS S3 o Azure Blob Storage |
| **Pagos** | Stripe API (modo sandbox) |
| **Autenticación** | JWT + Spring Security |
| **Testing** | JUnit 5, Mockito, Jasmine/Karma |
| **Documentación API** | Swagger/OpenAPI |

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

## 🗃️ Esquema de Base de Datos (PostgreSQL con JPA)

### Entidad: User
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @ManyToMany
    @JoinTable(
        name = "user_purchased_products",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> purchasedProducts = new HashSet<>();

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private boolean active = true;
}
```

### Entidad: Product
```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private String category;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    private Integer downloads = 0;

    private boolean active = true;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Entidad: Purchase
```java
@Entity
@Table(name = "purchases")
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "payment_intent_id")
    private String paymentIntentId;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    private boolean paid;

    @Column(name = "download_token")
    private String downloadToken;

    @Column(name = "download_expiry")
    private LocalDateTime downloadExpiry;

    @Column(name = "purchased_at")
    private LocalDateTime purchasedAt;
}
```

## 🚀 Plan de Desarrollo (6 Semanas)

### 🧱 Semana 1 – Fundación del Proyecto
- [ ] **Setup del entorno de desarrollo**
  - Inicializar repositorio Git
  - Configurar estructura de carpetas (frontend/backend)
  - Inicializar proyecto Spring Boot con Spring Initializr
  - Configurar dependencias de Spring (Web, Security, Data JPA, etc.)
  - Inicializar proyecto Angular con Angular CLI
  - Configurar Angular Material y NgRx
  - Configuración de PostgreSQL y conexión desde Spring

- [ ] **Sistema de autenticación**
  - Implementar entidades JPA y repositorios
  - Configurar Spring Security y JWT
  - Crear servicios de autenticación
  - Implementar endpoints de registro y login (REST Controllers)
  - Crear interceptores y guardias en Angular
  - Desarrollar componentes de login/registro

### 💾 Semana 2 – Gestión de Productos
- [ ] **Backend de productos**
  - Implementar entidades y repositorios JPA para productos
  - Crear servicios de productos (Service Layer)
  - Desarrollar REST Controllers para operaciones CRUD
  - Implementar validaciones con Bean Validation
  - Manejo de excepciones centralizado (ControllerAdvice)

- [ ] **Subida de archivos**
  - Integración con AWS S3 o Azure Blob Storage
  - Desarrollar servicio para manejo de archivos
  - Implementar endpoint multipart para subida
  - Validación de tipos de archivo y seguridad
  - Generación de URLs firmadas para acceso temporal

- [ ] **Frontend de productos**
  - Crear módulo Angular para productos
  - Implementar servicios para comunicación con API
  - Desarrollar formularios reactivos con validación
  - Crear componentes para listado de productos
  - Implementar lazy loading para catálogo

### 💰 Semana 3 – Sistema de Pagos
- [ ] **Integración con Stripe**
  - Implementar cliente Stripe con RestTemplate/WebClient
  - Desarrollar servicio para crear checkout sessions
  - Implementar controlador para webhooks de Stripe
  - Manejo de errores y transacciones
  - Implementar idempotencia y compensación

- [ ] **Gestión de compras**
  - Implementar entidades y repositorios JPA para compras
  - Desarrollar servicio transaccional para procesar pagos
  - Implementar mecanismo de compensación para fallos
  - Crear endpoints para historial de compras
  - Desarrollar componentes Angular para proceso de pago

### 📥 Semana 4 – Descargas y Perfiles de Usuario
- [ ] **Sistema de descargas seguras**
  - Implementar servicio para generación de tokens JWT de descarga
  - Desarrollar sistema de permisos basado en roles (RBAC)
  - Crear filtro de seguridad personalizado
  - Implementar servicio para URLs presigned en S3/Azure
  - Programar tareas con @Scheduled para limpieza de tokens expirados

- [ ] **Perfiles de usuario**
  - Implementar DTOs para proyecciones personalizadas
  - Desarrollar endpoints para perfil de usuario
  - Crear servicios Angular para manejo de estado
  - Implementar componentes de panel de usuario
  - Desarrollar gráficos y estadísticas con ngx-charts

- [ ] **Páginas de detalle**
  - Crear componentes Angular para vistas detalladas
  - Implementar rutas parametrizadas
  - Desarrollar sistema de calificaciones y reviews
  - Optimizar flujo de compra con guards
  - Implementar carga diferida de recursos

### 🎨 Semana 5 – Testing y Admin
- [ ] **Testing exhaustivo**
  - Implementar tests unitarios con JUnit y Mockito
  - Desarrollar tests de integración con TestRestTemplate
  - Crear tests end-to-end con Cypress
  - Configurar cobertura de código con JaCoCo
  - Implementar tests de componentes Angular con Jasmine/Karma

- [ ] **Panel de administración**
  - Implementar módulo admin con lazy loading
  - Desarrollar dashboard con métricas
  - Crear componentes para gestión de usuarios/productos
  - Implementar herramientas de moderación y baneos
  - Desarrollar sistema de notificaciones admin

- [ ] **Diseño y UX**
  - Implementar diseño responsive con Angular Material
  - Optimizar experiencia de usuario con interceptores
  - Crear componentes de feedback y mensajes de error
  - Implementar animaciones y transiciones
  - Optimizar rendimiento con lazy loading y Virtual Scroll

### 🚀 Semana 6 – Despliegue y Documentación
- [ ] **Documentación de API**
  - Implementar Swagger/OpenAPI con SpringDoc
  - Documentar endpoints con anotaciones
  - Crear ejemplos de respuestas y peticiones
  - Generar documentación exportable
  - Implementar versionado de API

- [ ] **Configuración de CI/CD**
  - Configurar GitHub Actions o Jenkins
  - Implementar build automatizado
  - Configurar análisis estático de código (SonarQube)
  - Automatizar despliegue a entornos
  - Configurar monitoreo de calidad

- [ ] **Despliegue**
  - Dockerizar aplicaciones (frontend y backend)
  - Configurar Docker Compose para desarrollo
  - Desplegar backend en AWS/Azure/GCP
  - Configurar CDN para frontend
  - Implementar monitoreo y logging centralizado

## 🔧 Comandos de Desarrollo

### Backend (Spring Boot)
```bash
./mvnw spring-boot:run

./mvnw clean package

./mvnw test

./mvnw verify

./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend (Angular)
```bash
npm install

ng serve

ng build --prod

ng test

ng e2e

ng generate component mi-componente
```

### Docker
```bash
.\scripts\docker-setup.ps1 dev

.\scripts\docker-setup.ps1 prod

.\scripts\docker-setup.ps1 stop

./scripts/docker-setup.sh dev

./scripts/docker-setup.sh prod

./scripts/docker-setup.sh stop

docker-compose -f docker-compose.dev.yml up --build

docker-compose up --build

docker-compose down

docker-compose logs -f backend

docker-compose logs -f frontend

docker-compose logs -f postgres
```

## 🐳 Docker Setup

Para una configuración rápida con Docker, consulta la documentación completa en [DOCKER_README.md](DOCKER_README.md).

### Inicio Rápido con Docker

```bash
git clone <tu-repositorio>
cd Distrofy

.\scripts\docker-setup.ps1 dev

./scripts/docker-setup.sh dev
```

### Arquitectura Docker

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   (Angular)     │    │  (Spring Boot)  │    │   Database      │
│   Port: 4200    │◄──►│   Port: 8080    │◄──►│   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📝 Variables de Entorno Requeridas

### Docker (.env)
```env
POSTGRES_DB=distrofy
POSTGRES_USER=distrofy_user
POSTGRES_PASSWORD=jeanjean123
JWT_SECRET=tu_jwt_secret_muy_seguro
```

### Backend (application.properties/application.yml)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/distrofy
spring.datasource.username=postgres
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update

jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

stripe.api.key=sk_test_...
stripe.webhook.secret=whsec_...

aws.accessKey=your_aws_access_key
aws.secretKey=your_aws_secret_key
aws.region=us-east-1
aws.s3.bucket=distrofy-files

server.port=8080
server.servlet.context-path=/api
spring.servlet.multipart.max-file-size=10MB

app.frontend.url=http://localhost:4200
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  stripePublicKey: 'pk_test_...',
  fileMaxSize: 10485760,
};
```

### Docker (.env)
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=distrofy
JWT_SECRET=your_jwt_secret_key
STRIPE_API_KEY=sk_test_...
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
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
# 🐳 Docker Setup - Distrofy

Esta documentación explica cómo configurar y ejecutar Distrofy usando Docker.

## 📋 Prerrequisitos

- Docker Desktop instalado
- Docker Compose instalado
- Al menos 4GB de RAM disponible
- 10GB de espacio libre en disco

## 🚀 Inicio Rápido

### Opción 1: Usando el script automatizado (Recomendado)

```bash
# Dar permisos de ejecución al script
chmod +x scripts/docker-setup.sh

# Ejecutar en modo desarrollo
./scripts/docker-setup.sh dev

# Ejecutar en modo producción
./scripts/docker-setup.sh prod

# Detener servicios
./scripts/docker-setup.sh stop

# Ver logs
./scripts/docker-setup.sh logs
```

### Opción 2: Usando Docker Compose directamente

#### Modo Desarrollo (con hot reload)
```bash
# Construir y ejecutar
docker-compose -f docker-compose.dev.yml up --build

# Ejecutar en segundo plano
docker-compose -f docker-compose.dev.yml up -d --build

# Detener servicios
docker-compose -f docker-compose.dev.yml down
```

#### Modo Producción
```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build

# Detener servicios
docker-compose down
```

## 🏗️ Arquitectura de Contenedores

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   (Angular)     │    │  (Spring Boot)  │    │   Database      │
│   Port: 4200    │◄──►│   Port: 8080    │◄──►│   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Estructura de Archivos Docker

```
Distrofy/
├── Dockerfile                    # Backend production
├── Dockerfile.dev               # Backend development
├── docker-compose.yml           # Production services
├── docker-compose.dev.yml       # Development services
├── .dockerignore                # Global ignore rules
├── distrofy-frontend/
│   ├── Dockerfile               # Frontend production
│   ├── Dockerfile.dev          # Frontend development
│   └── .dockerignore           # Frontend ignore rules
└── scripts/
    └── docker-setup.sh         # Automation script
```

## 🔧 Configuración de Servicios

### Base de Datos (PostgreSQL)
- **Imagen:** `postgres:15-alpine`
- **Puerto:** `5432`
- **Base de datos:** `distrofy`
- **Usuario:** `distrofy_user`
- **Contraseña:** `jeanjean123`
- **Volumen:** `postgres_data` (persistencia)

### Backend (Spring Boot)
- **Puerto:** `8080`
- **Debug puerto:** `5005` (solo desarrollo)
- **Variables de entorno:**
  - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://postgres:5432/distrofy`
  - `SPRING_DATASOURCE_USERNAME`: `distrofy_user`
  - `SPRING_DATASOURCE_PASSWORD`: `jeanjean123`

### Frontend (Angular)
- **Puerto:** `4200`
- **Hot reload:** Habilitado en desarrollo
- **Build optimizado:** En producción

## 🛠️ Comandos Útiles

### Gestión de Contenedores
```bash
# Ver contenedores ejecutándose
docker ps

# Ver logs de un contenedor específico
docker logs distrofy-backend
docker logs distrofy-frontend
docker logs distrofy-postgres

# Entrar a un contenedor
docker exec -it distrofy-backend bash
docker exec -it distrofy-frontend sh
docker exec -it distrofy-postgres psql -U distrofy_user -d distrofy

# Reiniciar un servicio específico
docker-compose restart backend
docker-compose restart frontend
```

### Gestión de Imágenes
```bash
# Ver imágenes
docker images

# Eliminar imágenes no utilizadas
docker image prune

# Reconstruir una imagen específica
docker-compose build backend
docker-compose build frontend
```

### Gestión de Volúmenes
```bash
# Ver volúmenes
docker volume ls

# Eliminar volúmenes no utilizados
docker volume prune

# Eliminar volumen de base de datos (¡CUIDADO!)
docker volume rm distrofy_postgres_data
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Verificar qué está usando el puerto
netstat -tulpn | grep :8080
netstat -tulpn | grep :4200
netstat -tulpn | grep :5432

# Detener servicios que usen esos puertos
sudo lsof -ti:8080 | xargs kill -9
```

#### 2. Problemas de permisos
```bash
# Dar permisos al script
chmod +x scripts/docker-setup.sh

# En Linux/Mac, puede necesitar sudo
sudo ./scripts/docker-setup.sh dev
```

#### 3. Problemas de memoria
```bash
# Verificar uso de memoria
docker stats

# Limpiar recursos
docker system prune -a
```

#### 4. Problemas de red
```bash
# Verificar redes de Docker
docker network ls

# Eliminar red si hay conflictos
docker network rm distrofy_distrofy-network
```

### Logs de Debug

#### Backend
```bash
# Ver logs detallados del backend
docker logs distrofy-backend -f

# Ver logs de Spring Boot
docker exec -it distrofy-backend tail -f /app/target/spring.log
```

#### Frontend
```bash
# Ver logs del frontend
docker logs distrofy-frontend -f

# Ver logs de Angular
docker exec -it distrofy-frontend tail -f /app/angular.log
```

#### Base de Datos
```bash
# Ver logs de PostgreSQL
docker logs distrofy-postgres -f

# Conectar a la base de datos
docker exec -it distrofy-postgres psql -U distrofy_user -d distrofy
```

## 🚀 Despliegue en Producción

### Variables de Entorno
Para producción, crea un archivo `.env`:

```env
# Base de datos
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_USER=distrofy_user
POSTGRES_DB=distrofy

# Backend
JWT_SECRET=tu_jwt_secret_muy_seguro
SPRING_PROFILES_ACTIVE=production

# Frontend
NODE_ENV=production
```

### Comandos de Producción
```bash
# Construir para producción
docker-compose -f docker-compose.yml build --no-cache

# Ejecutar en producción
docker-compose -f docker-compose.yml up -d

# Verificar estado
docker-compose -f docker-compose.yml ps

# Ver logs de producción
docker-compose -f docker-compose.yml logs -f
```

## 📊 Monitoreo

### Health Checks
```bash
# Backend health check
curl http://localhost:8080/api/auth/health

# Frontend (verificar que responde)
curl http://localhost:4200

# Base de datos
docker exec -it distrofy-postgres pg_isready -U distrofy_user
```

### Métricas
```bash
# Ver estadísticas de contenedores
docker stats

# Ver uso de recursos
docker system df
```

## 🔒 Seguridad

### Buenas Prácticas
1. **Nunca** usar contraseñas por defecto en producción
2. Cambiar el JWT secret en producción
3. Usar volúmenes nombrados para persistencia
4. Configurar límites de recursos
5. Usar imágenes oficiales y actualizadas

### Configuración de Seguridad
```yaml
# En docker-compose.yml
services:
  backend:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/tmp
```

## 📝 Notas de Desarrollo

### Hot Reload
- **Backend:** Los cambios en el código se reflejan automáticamente
- **Frontend:** Los cambios en Angular se reflejan en tiempo real
- **Base de datos:** Los datos persisten entre reinicios

### Debugging
- **Backend:** Puerto 5005 abierto para debugging remoto
- **Frontend:** DevTools disponibles en el navegador
- **Base de datos:** Acceso directo con `psql`

### Performance
- **Backend:** Optimizado para producción con JVM tuning
- **Frontend:** Build optimizado con Angular CLI
- **Base de datos:** Configuración optimizada para desarrollo

## 🤝 Contribución

Para contribuir al proyecto:

1. Usa el modo desarrollo: `./scripts/docker-setup.sh dev`
2. Haz tus cambios en el código
3. Los cambios se reflejarán automáticamente
4. Ejecuta tests: `docker exec -it distrofy-backend mvn test`
5. Commit y push tus cambios

## 📞 Soporte

Si tienes problemas con Docker:

1. Revisa los logs: `./scripts/docker-setup.sh logs-dev`
2. Limpia recursos: `./scripts/docker-setup.sh cleanup`
3. Reconstruye: `docker-compose -f docker-compose.dev.yml build --no-cache`
4. Consulta la documentación oficial de Docker
5. Abre un issue en el repositorio

---

**¡Disfruta desarrollando con Distrofy! 🚀** 
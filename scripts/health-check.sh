#!/bin/bash

# Health check script para el backend de Distrofy
# Este script verifica que el backend esté funcionando correctamente

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Variables
BACKEND_URL="http://localhost:8080/api"
HEALTH_ENDPOINT="$BACKEND_URL/auth/health"
TIMEOUT=10

echo "🔍 Verificando estado del backend de Distrofy..."

# Verificar si el puerto está abierto
if ! nc -z localhost 8080 2>/dev/null; then
    print_error "El puerto 8080 no está abierto. El backend no está ejecutándose."
    exit 1
fi

print_success "Puerto 8080 está abierto"

# Verificar health endpoint
echo "📡 Verificando health endpoint..."
if curl -f -s --max-time $TIMEOUT "$HEALTH_ENDPOINT" > /dev/null; then
    print_success "Health endpoint responde correctamente"
else
    print_error "Health endpoint no responde"
    exit 1
fi

# Verificar respuesta del health endpoint
RESPONSE=$(curl -s --max-time $TIMEOUT "$HEALTH_ENDPOINT")
if [[ "$RESPONSE" == *"Auth service is running"* ]]; then
    print_success "Respuesta del health endpoint es correcta"
else
    print_warning "Respuesta inesperada del health endpoint: $RESPONSE"
fi

# Verificar tiempo de respuesta
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" "$HEALTH_ENDPOINT")
if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
    print_success "Tiempo de respuesta: ${RESPONSE_TIME}s (excelente)"
elif (( $(echo "$RESPONSE_TIME < 3.0" | bc -l) )); then
    print_warning "Tiempo de respuesta: ${RESPONSE_TIME}s (aceptable)"
else
    print_error "Tiempo de respuesta: ${RESPONSE_TIME}s (lento)"
fi

# Verificar base de datos (si está disponible)
echo "🗄️  Verificando conexión a base de datos..."
if docker ps | grep -q "distrofy-postgres"; then
    print_success "Contenedor de PostgreSQL está ejecutándose"
    
    # Verificar si la base de datos está respondiendo
    if docker exec distrofy-postgres pg_isready -U distrofy_user -d distrofy > /dev/null 2>&1; then
        print_success "Base de datos PostgreSQL está respondiendo"
    else
        print_warning "Base de datos PostgreSQL no responde"
    fi
else
    print_warning "Contenedor de PostgreSQL no encontrado"
fi

# Verificar memoria y CPU del contenedor backend
if docker ps | grep -q "distrofy-backend"; then
    echo "📊 Estadísticas del contenedor backend:"
    docker stats distrofy-backend --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
else
    print_warning "Contenedor backend no encontrado"
fi

echo ""
print_success "✅ Verificación completada. El backend está funcionando correctamente." 
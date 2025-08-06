#!/bin/bash

# Script para configurar y ejecutar Distrofy con Docker
# Autor: Equipo Distrofy
# Fecha: $(date)

echo "🐳 Configurando Distrofy con Docker..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor, instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose no está instalado. Por favor, instala Docker Compose primero."
        exit 1
    fi
    
    print_message "Docker y Docker Compose están instalados."
}

# Función para construir y ejecutar en producción
production_setup() {
    print_message "Construyendo y ejecutando Distrofy en modo PRODUCCIÓN..."
    
    # Detener contenedores existentes
    docker-compose down
    
    # Construir imágenes
    docker-compose build --no-cache
    
    # Ejecutar servicios
    docker-compose up -d
    
    print_message "✅ Distrofy está ejecutándose en modo producción!"
    print_message "🌐 Frontend: http://localhost:4200"
    print_message "🔧 Backend API: http://localhost:8080/api"
    print_message "🗄️  Base de datos: localhost:5432"
}

# Función para construir y ejecutar en desarrollo
development_setup() {
    print_message "Construyendo y ejecutando Distrofy en modo DESARROLLO..."
    
    # Detener contenedores existentes
    docker-compose -f docker-compose.dev.yml down
    
    # Construir imágenes
    docker-compose -f docker-compose.dev.yml build --no-cache
    
    # Ejecutar servicios
    docker-compose -f docker-compose.dev.yml up -d
    
    print_message "✅ Distrofy está ejecutándose en modo desarrollo!"
    print_message "🌐 Frontend: http://localhost:4200"
    print_message "🔧 Backend API: http://localhost:8080/api"
    print_message "🗄️  Base de datos: localhost:5432"
    print_message "🐛 Debug backend: localhost:5005"
}

# Función para detener servicios
stop_services() {
    print_message "Deteniendo servicios de Distrofy..."
    
    if [ "$1" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml down
        print_message "✅ Servicios de desarrollo detenidos."
    else
        docker-compose down
        print_message "✅ Servicios de producción detenidos."
    fi
}

# Función para ver logs
show_logs() {
    if [ "$1" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Función para limpiar Docker
cleanup() {
    print_warning "Limpiando recursos de Docker..."
    
    # Detener y eliminar contenedores
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    
    # Eliminar imágenes no utilizadas
    docker image prune -f
    
    # Eliminar volúmenes no utilizados
    docker volume prune -f
    
    print_message "✅ Limpieza completada."
}

# Función para mostrar ayuda
show_help() {
    echo "🐳 Distrofy Docker Setup Script"
    echo ""
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Opciones:"
    echo "  prod          Ejecutar en modo PRODUCCIÓN"
    echo "  dev           Ejecutar en modo DESARROLLO"
    echo "  stop          Detener servicios de producción"
    echo "  stop-dev      Detener servicios de desarrollo"
    echo "  logs          Mostrar logs de producción"
    echo "  logs-dev      Mostrar logs de desarrollo"
    echo "  cleanup       Limpiar recursos de Docker"
    echo "  help          Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 dev        # Ejecutar en modo desarrollo"
    echo "  $0 prod       # Ejecutar en modo producción"
    echo "  $0 stop       # Detener servicios"
}

# Verificar Docker
check_docker

# Procesar argumentos
case "$1" in
    "prod")
        production_setup
        ;;
    "dev")
        development_setup
        ;;
    "stop")
        stop_services
        ;;
    "stop-dev")
        stop_services "dev"
        ;;
    "logs")
        show_logs
        ;;
    "logs-dev")
        show_logs "dev"
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Opción no válida. Usa '$0 help' para ver las opciones disponibles."
        exit 1
        ;;
esac 
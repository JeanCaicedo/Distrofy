# Script para configurar y ejecutar Distrofy con Docker (Windows PowerShell)
# Autor: Equipo Distrofy
# Fecha: $(Get-Date)

Write-Host "🐳 Configurando Distrofy con Docker..." -ForegroundColor Green

# Función para imprimir mensajes
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Verificar si Docker está instalado
function Test-Docker {
    try {
        $dockerVersion = docker --version
        Write-Info "Docker está instalado: $dockerVersion"
    }
    catch {
        Write-Error "Docker no está instalado. Por favor, instala Docker Desktop primero."
        exit 1
    }
    
    try {
        $composeVersion = docker-compose --version
        Write-Info "Docker Compose está instalado: $composeVersion"
    }
    catch {
        Write-Error "Docker Compose no está instalado. Por favor, instala Docker Compose primero."
        exit 1
    }
}

# Función para construir y ejecutar en producción
function Start-Production {
    Write-Info "Construyendo y ejecutando Distrofy en modo PRODUCCIÓN..."
    
    # Detener contenedores existentes
    docker-compose down
    
    # Construir imágenes
    docker-compose build --no-cache
    
    # Ejecutar servicios
    docker-compose up -d
    
    Write-Info "✅ Distrofy está ejecutándose en modo producción!"
    Write-Info "🌐 Frontend: http://localhost:4200"
    Write-Info "🔧 Backend API: http://localhost:8080/api"
    Write-Info "🗄️  Base de datos: localhost:5432"
}

# Función para construir y ejecutar en desarrollo
function Start-Development {
    Write-Info "Construyendo y ejecutando Distrofy en modo DESARROLLO..."
    
    # Detener contenedores existentes
    docker-compose -f docker-compose.dev.yml down
    
    # Construir imágenes
    docker-compose -f docker-compose.dev.yml build --no-cache
    
    # Ejecutar servicios
    docker-compose -f docker-compose.dev.yml up -d
    
    Write-Info "✅ Distrofy está ejecutándose en modo desarrollo!"
    Write-Info "🌐 Frontend: http://localhost:4200"
    Write-Info "🔧 Backend API: http://localhost:8080/api"
    Write-Info "🗄️  Base de datos: localhost:5432"
    Write-Info "🐛 Debug backend: localhost:5005"
}

# Función para detener servicios
function Stop-Services {
    param([string]$Mode = "prod")
    
    Write-Info "Deteniendo servicios de Distrofy..."
    
    if ($Mode -eq "dev") {
        docker-compose -f docker-compose.dev.yml down
        Write-Info "✅ Servicios de desarrollo detenidos."
    }
    else {
        docker-compose down
        Write-Info "✅ Servicios de producción detenidos."
    }
}

# Función para ver logs
function Show-Logs {
    param([string]$Mode = "prod")
    
    if ($Mode -eq "dev") {
        docker-compose -f docker-compose.dev.yml logs -f
    }
    else {
        docker-compose logs -f
    }
}

# Función para limpiar Docker
function Clear-DockerResources {
    Write-Warning "Limpiando recursos de Docker..."
    
    # Detener y eliminar contenedores
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    
    # Eliminar imágenes no utilizadas
    docker image prune -f
    
    # Eliminar volúmenes no utilizados
    docker volume prune -f
    
    Write-Info "✅ Limpieza completada."
}

# Función para mostrar ayuda
function Show-Help {
    Write-Host "🐳 Distrofy Docker Setup Script (PowerShell)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\scripts\docker-setup.ps1 [OPCIÓN]" -ForegroundColor White
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor White
    Write-Host "  prod          Ejecutar en modo PRODUCCIÓN" -ForegroundColor Yellow
    Write-Host "  dev           Ejecutar en modo DESARROLLO" -ForegroundColor Yellow
    Write-Host "  stop          Detener servicios de producción" -ForegroundColor Yellow
    Write-Host "  stop-dev      Detener servicios de desarrollo" -ForegroundColor Yellow
    Write-Host "  logs          Mostrar logs de producción" -ForegroundColor Yellow
    Write-Host "  logs-dev      Mostrar logs de desarrollo" -ForegroundColor Yellow
    Write-Host "  cleanup       Limpiar recursos de Docker" -ForegroundColor Yellow
    Write-Host "  help          Mostrar esta ayuda" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ejemplos:" -ForegroundColor White
    Write-Host "  .\scripts\docker-setup.ps1 dev        # Ejecutar en modo desarrollo" -ForegroundColor Gray
    Write-Host "  .\scripts\docker-setup.ps1 prod       # Ejecutar en modo producción" -ForegroundColor Gray
    Write-Host "  .\scripts\docker-setup.ps1 stop       # Detener servicios" -ForegroundColor Gray
}

# Verificar Docker
Test-Docker

# Procesar argumentos
$action = $args[0]

switch ($action) {
    "prod" {
        Start-Production
    }
    "dev" {
        Start-Development
    }
    "stop" {
        Stop-Services
    }
    "stop-dev" {
        Stop-Services "dev"
    }
    "logs" {
        Show-Logs
    }
    "logs-dev" {
        Show-Logs "dev"
    }
    "cleanup" {
        Clear-DockerResources
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error "Opción no válida. Usa '.\scripts\docker-setup.ps1 help' para ver las opciones disponibles."
        exit 1
    }
} 
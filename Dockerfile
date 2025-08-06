# Dockerfile para el backend de Spring Boot
FROM openjdk:17-jdk-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar Maven
RUN apt-get update && apt-get install -y maven

# Copiar el archivo pom.xml primero para aprovechar el cache de Docker
COPY backend/pom.xml .

# Descargar dependencias (esto se cachea si pom.xml no cambia)
RUN mvn dependency:go-offline -B

# Copiar el código fuente
COPY backend/src ./src

# Construir la aplicación
RUN mvn clean package -DskipTests

# Crear usuario no-root para seguridad
RUN groupadd -r spring && useradd -r -g spring spring

# Cambiar permisos
RUN chown -R spring:spring /app
USER spring

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/auth/health || exit 1

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"] 
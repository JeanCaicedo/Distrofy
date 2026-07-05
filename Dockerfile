# Dockerfile para el backend de Spring Boot (build multi-stage)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar el archivo pom.xml primero para aprovechar el cache de Docker
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente y construir
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Imagen final: solo el JRE, sin Maven
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Crear usuario no-root para seguridad
RUN groupadd -r spring && useradd -r -g spring spring

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
RUN chown -R spring:spring /app
USER spring

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/auth/health || exit 1

CMD ["java", "-jar", "app.jar"]

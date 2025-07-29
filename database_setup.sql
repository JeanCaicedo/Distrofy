-- Crear base de datos
CREATE DATABASE distrofy;

-- Crear usuario
CREATE USER distrofy_user WITH PASSWORD 'jeanjean123';

-- Dar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE distrofy TO distrofy_user;

-- Conectar a la base de datos distrofy
\c distrofy;

-- Dar permisos en el esquema público
GRANT ALL ON SCHEMA public TO distrofy_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO distrofy_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO distrofy_user; 
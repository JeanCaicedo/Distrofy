CREATE DATABASE distrofy;

CREATE USER distrofy_user WITH PASSWORD 'jeanjean123';

GRANT ALL PRIVILEGES ON DATABASE distrofy TO distrofy_user;

\c distrofy;

GRANT ALL ON SCHEMA public TO distrofy_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO distrofy_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO distrofy_user; 
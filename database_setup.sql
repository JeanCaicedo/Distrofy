-- La imagen oficial de postgres ya crea la base de datos y el usuario
-- usando las variables POSTGRES_DB / POSTGRES_USER / POSTGRES_PASSWORD,
-- y los conecta como dueño de la base. Este script solo refuerza permisos
-- (es seguro volver a ejecutarlo).

GRANT ALL ON SCHEMA public TO CURRENT_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO CURRENT_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO CURRENT_USER;

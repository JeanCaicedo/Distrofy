@echo off
echo ========================================
echo Probando endpoints de Distrofy Backend
echo ========================================

echo.
echo 1. Probando health check...
curl -X GET http://localhost:8080/api/auth/health

echo.
echo 2. Probando registro de usuario...
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"123456\"}"

echo.
echo 3. Probando login...
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"123456\"}"

echo.
echo ========================================
echo Pruebas completadas
echo ======================================== 
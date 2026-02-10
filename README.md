# E-commerce Backend - Sistema de Autenticación

## Requisitos Implementados

1. **Modelo de Usuario**
   - first_name, last_name, email (único), age, password (hash), cart (referencia), role (default: 'user')

2. **Encriptación de Contraseña**
   - bcrypt con hashSync (10 rondas de salt)

3. **Estrategias de Passport**
   - Local Register: Crea usuarios con contraseña encriptada
   - Local Login: Valida credenciales
   - JWT: Valida tokens Bearer

4. **Sistema de Login con JWT**
   - Token con duración de 24 horas
   - Retorna token y datos del usuario

5. **Ruta de Validación /current**
   - GET /api/sessions/current
   - Valida JWT y retorna datos del usuario autenticado

---

## Cómo Probar

### Instalación
```bash
npm install
```

### Iniciar Servidor
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Servidor
npm start
```

### Pruebas con Postman

**1. Registrar Usuario**
```
POST http://localhost:8080/api/sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123"
}
```

**2. Login**
```
POST http://localhost:8080/api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```
Respuesta: Retorna `token` (copiar para siguiente paso)

**3. Validar Usuario Actual**
```
GET http://localhost:8080/api/sessions/current
Authorization: Bearer <TOKEN_OBTENIDO>
```
Respuesta: Retorna datos del usuario autenticado

### Paso 1: Instalar Dependencias
```bash
npm install
```

### Paso 2: Iniciar MongoDB
Abre una terminal y ejecuta:
```bash
mongod
```
Deberías ver: `"Waiting for connections on port 27017"`

### Paso 3: Iniciar el Servidor
En otra terminal, ejecuta:
```bash
npm start
```
Deberías ver: `"Start server in PORT 8080"`

---

## Pruebas con Postman

### 1. Registrar un Nuevo Usuario

**Método:** `POST`  
**URL:** `http://localhost:8080/api/sessions/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "micontraseña123"
}
```
**Respuesta Esperada (201):**
```json
{
  "message": "Registro exitoso",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user"
  }
}
```

---

### 2. Login (Obtener JWT)

**Método:** `POST`  
**URL:** `http://localhost:8080/api/sessions/login`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "micontraseña123"
}
```
**Respuesta Esperada (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoianVhbkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMTAwMDAwMCwiZXhwIjoxNzAxMDg2NDAwfQ.abc123...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user"
  }
}
```

[IMPORTANTE] Copia el valor de `token` para usarlo en el siguiente paso.

---

### 3. Validar Usuario Autenticado (/current)

**Método:** `GET`  
**URL:** `http://localhost:8080/api/sessions/current`  
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoianVhbkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMTAwMDAwMCwiZXhwIjoxNzAxMDg2NDAwfQ.abc123...
```

**Respuesta Esperada (200):**
```json
{
  "message": "Datos del usuario actual",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": null
  }
}
```

---

## Pruebas con cURL

### Registrar usuario:
```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "María",
    "last_name": "García",
    "email": "maria@test.com",
    "age": 28,
    "password": "pass123456"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@test.com",
    "password": "pass123456"
  }'
```

### Validar usuario actual:
```bash
curl -X GET http://localhost:8080/api/sessions/current \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## Casos de Prueba

| Caso | Resultado |
|------|-----------|
| Registrar usuario con email único | OK (201) |
| Registrar con email duplicado | Falla |
| Login con credenciales correctas | Retorna JWT (200) |
| Login con contraseña incorrecta | Falla |
| Acceder a /current sin token | No autorizado |
| Acceder a /current con token válido | Retorna usuario (200) |
| Acceder a /current con token inválido | No autorizado |

---

## Seguridad

- Contraseñas encriptadas con bcrypt (10 rondas de salt)
- JWT con expiración de 24 horas
- Email único por usuario
- Validación de credenciales en login
- Estrategias de Passport separadas para Register, Login y JWT

---

## Dependencias Utilizadas

```json
{
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.1.2",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "passport-local": "^1.0.0",
  "mongoose": "^7.5.3"
}
```

---

## Notas

- MongoDB debe estar ejecutándose en `mongodb://127.0.0.1:27017/entrega-final`
- El JWT expira en **24 horas**
- La clave secreta es `jwt-secret-key` (cambiar en producción)
- Los tokens se incluyen en el header como `Authorization: Bearer <token>`

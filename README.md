# E-commerce Backend - Sistema de Autenticación

Proyecto de e-commerce backend con sistema completo de autenticación usando **Passport.js** y **JWT (JSON Web Tokens)**.

## 📋 Funcionalidades Implementadas

### 1. Modelo de Usuario
- **first_name**: Nombre del usuario (String)
- **last_name**: Apellido del usuario (String)
- **email**: Email único (String)
- **age**: Edad del usuario (Number)
- **password**: Contraseña encriptada con bcrypt (String)
- **cart**: Referencia a carrito de compras (ObjectId)
- **role**: Rol del usuario, por defecto 'user' (String)

### 2. Encriptación de Contraseña
- Implementado con **bcrypt** usando el método `hashSync`
- 10 rondas de salt para máxima seguridad
- Validación de contraseña con `compareSync`

### 3. Estrategias de Passport
#### Estrategia Local Register
- Crea nuevos usuarios
- Valida que el email sea único
- Encripta la contraseña automáticamente

#### Estrategia Local Login
- Valida credenciales (email y contraseña)
- Retorna el usuario si las credenciales son válidas

#### Estrategia JWT
- Valida tokens Bearer en los headers
- Extrae el token del header `Authorization: Bearer <token>`
- Renueva la sesión del usuario desde el token

### 4. Sistema de Login con JWT
- Genera tokens con duración de **24 horas**
- Incluye id y email del usuario en el payload
- Retorna token y datos del usuario en el login

### 5. Ruta de Validación
- Endpoint `/api/sessions/current`
- Valida que el usuario esté logueado con JWT válido
- Retorna los datos completos del usuario autenticado

---

## 🚀 Guía de Instalación y Prueba

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

## 🧪 Pruebas con Postman

### 1️⃣ Registrar un Nuevo Usuario

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

### 2️⃣ Login (Obtener JWT)

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

**⚠️ Importante:** Copia el valor de `token` para usarlo en el siguiente paso.

---

### 3️⃣ Validar Usuario Autenticado (/current)

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

## 📱 Pruebas con cURL

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

## 🔍 Casos de Prueba

| Caso | Resultado |
|------|-----------|
| Registrar usuario con email único | ✅ Éxito (201) |
| Registrar con email duplicado | ❌ Falla |
| Login con credenciales correctas | ✅ Retorna JWT (200) |
| Login con contraseña incorrecta | ❌ Falla |
| Acceder a /current sin token | ❌ No autorizado |
| Acceder a /current con token válido | ✅ Retorna usuario (200) |
| Acceder a /current con token inválido | ❌ No autorizado |

---

## 📁 Estructura de Archivos Creados

```
src/
├── config/
│   └── passportConfig.js          # Configuración de Passport y JWT
├── dao/
│   └── models/
│       └── userModel.js            # Modelo de Usuario
├── routes/
│   └── sessionRouter.js            # Rutas de autenticación
├── utils/
│   └── passwordUtil.js             # Funciones de encriptación
└── app.js                          # Actualizado con Passport
```

---

## 🔐 Seguridad

- ✅ Contraseñas encriptadas con bcrypt (10 rondas de salt)
- ✅ JWT con expiración de 24 horas
- ✅ Email único por usuario
- ✅ Validación de credenciales en login
- ✅ Estrategias de Passport separadas para Register, Login y JWT

---

## 📦 Dependencias Utilizadas

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

## ⚡ Próximos Pasos Opcionales

- [ ] Agregar validación de email
- [ ] Implementar refresh tokens
- [ ] Agregar rol "admin" con permisos especiales
- [ ] Implementar cambio de contraseña
- [ ] Agregar recuperación de contraseña por email
- [ ] Implementar 2FA (Two-Factor Authentication)

---

## 📝 Notas

- MongoDB debe estar ejecutándose en `mongodb://127.0.0.1:27017/entrega-final`
- El JWT expira en **24 horas**
- La clave secreta es `jwt-secret-key` (cambiar en producción)
- Los tokens se incluyen en el header como `Authorization: Bearer <token>`

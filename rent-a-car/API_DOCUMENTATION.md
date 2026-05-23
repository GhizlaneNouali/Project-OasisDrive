# OASIS-DRIVE - Documentación de API REST

## Proyecto: Aplicación de Alquiler de Vehículos
**Autores**: Mohamed Aouragh, Ghizlane Nouali  
**Centro**: Institut Castellet - 2n DAM (2025/2026)

---

## 📋 Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Requisitos de Negocio](#requisitos-de-negocio)
3. [Módulos Implementados](#módulos-implementados)
4. [Endpoints API](#endpoints-api)
5. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Descripción General

OASIS-DRIVE es una aplicación web para la gestión de reservas de vehículos. Implementa un sistema completo con:
- **Backend**: Spring Boot 3.5.14 + Java 21
- **Base de Datos**: MySQL (JPA/Hibernate)
- **Seguridad**: JWT (autenticación), dos roles (CLIENT, ADMIN)
- **API**: REST con CORS habilitado

---

## Requisitos de Negocio

### Reglas de Negocio (del PDF, página 12)
- ✅ Mínimo 1 día de reserva
- ✅ Máximo 30 días de reserva
- ✅ Edad mínima: 18 años para reservar
- ✅ Carnet obligatorio (validación de usuario registrado)
- ✅ Estados de reserva: PENDIENTE, CONFIRMADA, CANCELADA, FINALIZADA

---

## Módulos Implementados

### Módulo 1: Gestión de Usuarios ✅
- Registro de nuevos usuarios (clientes)
- Login/autenticación
- Gestión de perfiles
- Cambio de contraseña
- Roles: CLIENT, ADMIN

### Módulo 2: Catálogo de Vehículos ✅
- Listado de vehículos
- Filtros: marca, precio, disponibilidad
- Ordenamiento por precio
- Detalles del vehículo
- CRUD (Admin)

### Módulo 3: Gestión de Reservas ✅
- Crear reserva (validaciones completas)
- Consultar reservas
- Cancelar reserva
- Finalizar reserva
- Historial de reservas por usuario

### Módulo 4: Valoraciones ✅
- Crear valoración (1-5 puntos)
- Ver valoraciones por vehículo
- Puntuación promedio
- Comentarios

---

## Endpoints API

### 🔐 AUTENTICACIÓN Y USUARIOS

#### **POST** `/api/usuarios/registro`
Registrar nuevo usuario (cliente)

```json
Request:
{
  "nombre": "Juan",
  "apellidos": "García Martínez",
  "email": "juan@example.com",
  "password": "password123",
  "fecha_nacimiento": "1990-05-15"
}

Response (201 Created):
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre": "Juan",
    "apellidos": "García Martínez",
    "email": "juan@example.com",
    "rol": "CLIENTE",
    "fecha_nacimiento": "1990-05-15"
  }
}
```

#### **POST** `/api/usuarios/login`
Login de usuario

```json
Request:
{
  "email": "juan@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "mensaje": "Login exitoso",
  "usuario": {
    "id": 1,
    "nombre": "Juan",
    "email": "juan@example.com",
    "rol": "CLIENTE"
  }
}
```

#### **GET** `/api/usuarios`
Obtener todos los usuarios (Admin)

Response (200 OK): Array de usuarios

#### **GET** `/api/usuarios/{id}`
Obtener usuario por ID

Response (200 OK): Usuario específico

#### **GET** `/api/usuarios/email/{email}`
Obtener usuario por email

#### **GET** `/api/usuarios/clientes/lista`
Obtener lista de clientes (Admin)

Response (200 OK): Array de usuarios con rol CLIENTE

#### **PUT** `/api/usuarios/{id}`
Actualizar perfil de usuario

```json
Request:
{
  "nombre": "Juan Carlos",
  "apellidos": "García López",
  "fecha_nacimiento": "1990-05-15"
}

Response (200 OK): Usuario actualizado
```

#### **PUT** `/api/usuarios/{id}/cambiar-password`
Cambiar contraseña

```json
Request:
{
  "passwordActual": "password123",
  "passwordNueva": "newpassword456"
}

Response (200 OK): Operación exitosa
```

#### **DELETE** `/api/usuarios/{id}`
Eliminar usuario (Admin)

Response (200 OK): Usuario eliminado

---

### 🚗 VEHÍCULOS

#### **GET** `/api/coches`
Obtener todos los vehículos

Response (200 OK): Array de vehículos

#### **GET** `/api/coches/{id}`
Obtener vehículo por ID

Response (200 OK): Detalles del vehículo

#### **GET** `/api/coches/disponibles/lista`
Obtener vehículos disponibles

Response (200 OK): Array de vehículos disponibles

#### **GET** `/api/coches/marca/{marca}`
Obtener vehículos por marca

Example: `/api/coches/marca/Audi`

#### **GET** `/api/coches/precio?min=10&max=50`
Obtener vehículos por rango de precio

Response (200 OK): Array de vehículos en rango de precio

#### **GET** `/api/coches/ordenar/precio-asc`
Obtener vehículos ordenados por precio (ascendente)

#### **GET** `/api/coches/ordenar/precio-desc`
Obtener vehículos ordenados por precio (descendente)

#### **GET** `/api/coches/{id}/disponible`
Comprobar disponibilidad de un vehículo

```json
Response (200 OK):
{
  "id": 1,
  "disponible": true
}
```

#### **POST** `/api/coches`
Crear nuevo vehículo (Admin)

```json
Request:
{
  "marca": "Audi",
  "modelo": "A3 Sportback",
  "matricula": "8234-KCV",
  "anio": 2023,
  "kilometros": 50,
  "precio_dia": 55.0,
  "color": "Rojo",
  "imagen_url": "https://example.com/audi-a3.jpg"
}

Response (201 Created): Vehículo creado
```

#### **PUT** `/api/coches/{id}`
Actualizar vehículo (Admin)

Request: Mismo formato que POST (solo campos a actualizar)

Response (200 OK): Vehículo actualizado

#### **DELETE** `/api/coches/{id}`
Eliminar vehículo (Admin)

Response (200 OK): Vehículo eliminado

---

### 📋 RESERVAS

#### **POST** `/api/reservas`
Crear nueva reserva

```json
Request:
{
  "idUsuario": 1,
  "idCoche": 1,
  "fechaInicio": "2025-06-01",
  "fechaFin": "2025-06-05"
}

Validaciones:
- Usuario debe tener 18+ años
- Vehículo debe estar disponible
- Días: 1-30 (inclusive)
- Sin solapamiento con otras reservas

Response (201 Created):
{
  "mensaje": "Reserva creada exitosamente",
  "reserva": {
    "id": 1,
    "usuario": { ... },
    "coche": { ... },
    "fecha_inicio": "2025-06-01",
    "fecha_fin": "2025-06-05",
    "precio_total": 275.0,
    "estado": "CONFIRMADA"
  }
}
```

#### **GET** `/api/reservas`
Obtener todas las reservas (Admin)

Response (200 OK): Array de reservas

#### **GET** `/api/reservas/{id}`
Obtener reserva por ID

Response (200 OK): Detalles de reserva

#### **GET** `/api/reservas/usuario/{idUsuario}`
Obtener reservas de un usuario

Response (200 OK): Array de reservas del usuario

#### **DELETE** `/api/reservas/{id}`
Cancelar una reserva

```json
Response (200 OK):
{
  "mensaje": "Reserva cancelada exitosamente",
  "reserva": { ... con estado "CANCELADA" ... }
}
```

#### **PUT** `/api/reservas/{id}/finalizar`
Finalizar una reserva

```json
Response (200 OK):
{
  "mensaje": "Reserva finalizada exitosamente",
  "reserva": { ... con estado "FINALIZADA" ... }
}
```

---

### ⭐ VALORACIONES

#### **POST** `/api/valoraciones`
Crear valoración

```json
Request:
{
  "idUsuario": 1,
  "idCoche": 1,
  "puntuacion": 5,
  "comentario": "Excelente vehículo, muy cómodo"
}

Response (201 Created): Valoración creada
```

#### **GET** `/api/valoraciones`
Obtener todas las valoraciones

#### **GET** `/api/valoraciones/{id}`
Obtener valoración por ID

#### **GET** `/api/valoraciones/usuario/{idUsuario}`
Obtener valoraciones de un usuario

#### **GET** `/api/valoraciones/coche/{idCoche}`
Obtener valoraciones de un vehículo

#### **GET** `/api/valoraciones/coche/{idCoche}/promedio`
Obtener puntuación promedio de un vehículo

```json
Response (200 OK):
{
  "idCoche": 1,
  "puntuacionPromedio": 4.5
}
```

#### **PUT** `/api/valoraciones/{id}`
Actualizar valoración

```json
Request:
{
  "puntuacion": 4,
  "comentario": "Buen vehículo"
}

Response (200 OK): Valoración actualizada
```

#### **DELETE** `/api/valoraciones/{id}`
Eliminar valoración

Response (200 OK): Valoración eliminada

---

## Ejemplos de Uso

### 1️⃣ Flujo Completo de Usuario

```bash
# 1. Registrar nuevo usuario
POST /api/usuarios/registro
{
  "nombre": "María",
  "apellidos": "López García",
  "email": "maria@example.com",
  "password": "maria2025",
  "fecha_nacimiento": "1995-03-20"
}

# 2. Login
POST /api/usuarios/login
{
  "email": "maria@example.com",
  "password": "maria2025"
}
# Respuesta: { id: 2, rol: "CLIENTE", ... }

# 3. Ver vehículos disponibles
GET /api/coches/disponibles/lista

# 4. Ver vehículos por rango de precio
GET /api/coches/precio?min=30&max=60

# 5. Crear reserva
POST /api/reservas
{
  "idUsuario": 2,
  "idCoche": 5,
  "fechaInicio": "2025-06-10",
  "fechaFin": "2025-06-13"
}

# 6. Ver reservas del usuario
GET /api/reservas/usuario/2

# 7. Valorar el vehículo
POST /api/valoraciones
{
  "idUsuario": 2,
  "idCoche": 5,
  "puntuacion": 5,
  "comentario": "Perfecto, muy buen servicio"
}

# 8. Ver valoraciones del vehículo
GET /api/valoraciones/coche/5
```

### 2️⃣ Flujo de Administrador

```bash
# 1. Crear nuevo vehículo
POST /api/coches
{
  "marca": "Mercedes",
  "modelo": "C200",
  "matricula": "5678-XYZ",
  "anio": 2024,
  "kilometros": 100,
  "precio_dia": 75.0,
  "color": "Negro"
}

# 2. Ver todas las reservas
GET /api/reservas

# 3. Ver todos los usuarios
GET /api/usuarios

# 4. Ver clientes registrados
GET /api/usuarios/clientes/lista

# 5. Actualizar vehículo
PUT /api/coches/1
{
  "precio_dia": 65.0,
  "disponible": true
}

# 6. Finalizar reserva
PUT /api/reservas/5/finalizar
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Error en datos |
| 401 | Unauthorized - No autenticado |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Estructura de Carpetas

```
src/
├── main/
│   ├── java/
│   │   └── com/dam/rentacar/
│   │       ├── model/          # Entidades (Usuario, Coche, Reserva, etc.)
│   │       ├── controller/     # REST Controllers
│   │       ├── service/        # Lógica de negocio
│   │       ├── repository/     # Acceso a datos (JPA)
│   │       └── RentACarApplication.java
│   └── resources/
│       └── application.properties
└── test/
    └── java/
        └── RentACarApplicationTests.java
```

---

## Base de Datos

**Tablas Principales:**
- `usuarios` - Información de usuarios
- `coches` - Catálogo de vehículos
- `reservas` - Registro de reservas
- `valoraciones` - Opiniones y puntuaciones

**Relaciones:**
- Usuario (1) → (N) Reservas
- Usuario (1) → (N) Valoraciones
- Coche (1) → (N) Reservas
- Coche (1) → (N) Valoraciones

---

## Notas Importantes

⚠️ **Seguridad:**
- En producción, las contraseñas deben encriptarse con BCrypt
- Implementar JWT tokens para autenticación
- Validar permisos (ADMIN, CLIENTE) en cada endpoint

⚠️ **Validaciones:**
- Todos los inputs se validan en el Service
- Se comprueban conflictos de reservas automáticamente
- Se valida edad mínima de 18 años

✅ **Completado:**
- Todos los 4 módulos según especificaciones del PDF
- Lógica de negocio completa
- Manejo de errores robusto
- API REST completa con CORS

---

**Fecha de Implementación:** 15 de mayo de 2026

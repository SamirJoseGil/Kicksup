# API Documentation - KicksUp 📚

Documentación completa de la API REST del sistema KicksUp.

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Products](#products)
  - [Orders](#orders)
  - [Users](#users)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Estado](#códigos-de-estado)
- [Ejemplos de Uso](#ejemplos-de-uso)

## 🌐 Información General

### Base URL

```
Development: http://localhost:5047/api
Production:  https://your-domain.com/api
```

### Formato de Datos

- **Content-Type**: `application/json`
- **Accept**: `application/json`
- **Encoding**: UTF-8

### Versionado

Versión actual: **v1.0**

### Swagger UI

La API incluye documentación interactiva Swagger disponible en:

```
http://localhost:5047/swagger
```

## 🔐 Autenticación

La API usa **JWT Bearer Token** para autenticación.

### Obtener Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin123!"
}
```

**Respuesta exitosa (200 OK)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "Administrator",
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "username": "admin",
    "profileImageUrl": null
  }
}
```

### Usar Token en Requests

Incluye el token en el header `Authorization`:

```http
GET /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles

- **Client**: Usuario regular (puede comprar, ver órdenes propias)
- **Administrator**: Usuario administrador (gestión completa)

## 📡 Endpoints

### Auth

#### POST /api/auth/register

Registra un nuevo usuario.

**Request**:

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "username": "juanperez",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "age": 25,
  "country": "Colombia",
  "state": "Antioquia",
  "city": "Medellín",
  "phone": "+57 300 123 4567",
  "address": "Calle 10 #20-30"
}
```

**Validaciones**:
- Username único
- Password mínimo 6 caracteres
- Password y confirmPassword deben coincidir
- Age debe ser >= 18

**Response (200 OK)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "Client",
  "user": {
    "id": 5,
    "firstName": "Juan",
    "lastName": "Pérez",
    "username": "juanperez",
    "role": "Client"
  }
}
```

**Errores**:
- `400 Bad Request`: Username ya existe o validación fallida
- `500 Internal Server Error`: Error del servidor

---

#### POST /api/auth/login

Autentica un usuario existente.

**Request**:

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin123!"
}
```

**Response (200 OK)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "Administrator",
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "username": "admin"
  }
}
```

**Errores**:
- `401 Unauthorized`: Credenciales incorrectas

---

#### GET /api/auth/profile

Obtiene el perfil del usuario autenticado.

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:

```json
{
  "id": 1,
  "firstName": "Admin",
  "lastName": "User",
  "username": "admin",
  "age": 30,
  "country": "Colombia",
  "state": "Antioquia",
  "city": "Medellín",
  "phone": "+57 300 111 2222",
  "address": "Calle 1 #2-3",
  "role": "Administrator",
  "profileImageUrl": "https://example.com/avatar.jpg",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

#### PUT /api/auth/profile

Actualiza el perfil del usuario autenticado.

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:

```http
PUT /api/auth/profile
Content-Type: application/json
Authorization: Bearer {token}

{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "age": 26,
  "country": "Colombia",
  "state": "Antioquia",
  "city": "Envigado",
  "phone": "+57 301 999 8888",
  "address": "Carrera 43A #34-56",
  "profileImageUrl": "https://example.com/new-avatar.jpg"
}
```

**Response (200 OK)**:

```json
{
  "message": "Perfil actualizado exitosamente"
}
```

---

### Products

#### GET /api/products

Lista todos los productos con filtros opcionales.

**Query Parameters**:
- `searchTerm` (string, opcional): Buscar por nombre
- `size` (string, opcional): Filtrar por talla (ej: "42")
- `color` (string, opcional): Filtrar por color (ej: "Negro")

**Request**:

```http
GET /api/products?searchTerm=Nike&size=42&color=Negro
```

**Response (200 OK)**:

```json
[
  {
    "id": 1,
    "name": "Nike Air Max 90",
    "description": "Zapatillas deportivas clásicas",
    "price": 450000.00,
    "stock": 15,
    "sizes": ["38", "39", "40", "41", "42", "43"],
    "colors": ["Negro", "Blanco", "Rojo"],
    "imageUrl": "https://example.com/nike-air-max-90.jpg",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

#### GET /api/products/{id}

Obtiene un producto específico por ID.

**Request**:

```http
GET /api/products/1
```

**Response (200 OK)**:

```json
{
  "id": 1,
  "name": "Nike Air Max 90",
  "description": "Zapatillas deportivas clásicas con diseño icónico",
  "price": 450000.00,
  "stock": 15,
  "sizes": ["38", "39", "40", "41", "42", "43"],
  "colors": ["Negro", "Blanco", "Rojo"],
  "imageUrl": "https://example.com/nike-air-max-90.jpg",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

**Errores**:
- `404 Not Found`: Producto no existe

---

#### POST /api/products

Crea un nuevo producto. **Requiere rol Administrator**.

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:

```http
POST /api/products
Content-Type: application/json
Authorization: Bearer {admin-token}

{
  "name": "Adidas Ultraboost 22",
  "description": "Running shoes with Boost technology",
  "price": 520000.00,
  "stock": 20,
  "sizes": ["38", "39", "40", "41", "42", "43", "44"],
  "colors": ["Negro", "Azul"],
  "imageUrl": "https://example.com/adidas-ultraboost.jpg"
}
```

**Validaciones**:
- Name requerido
- Price > 0
- Stock >= 0
- Sizes debe tener al menos una talla
- Colors debe tener al menos un color

**Response (201 Created)**:

```json
{
  "id": 11,
  "name": "Adidas Ultraboost 22",
  "description": "Running shoes with Boost technology",
  "price": 520000.00,
  "stock": 20,
  "sizes": ["38", "39", "40", "41", "42", "43", "44"],
  "colors": ["Negro", "Azul"],
  "imageUrl": "https://example.com/adidas-ultraboost.jpg",
  "createdAt": "2026-01-15T10:30:00Z"
}
```

**Errores**:
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No es administrador
- `400 Bad Request`: Validación fallida

---

#### PUT /api/products/{id}

Actualiza un producto existente. **Requiere rol Administrator**.

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:

```http
PUT /api/products/11
Content-Type: application/json
Authorization: Bearer {admin-token}

{
  "name": "Adidas Ultraboost 22 - Edition 2026",
  "description": "Updated description",
  "price": 550000.00,
  "stock": 18,
  "sizes": ["38", "39", "40", "41", "42", "43", "44", "45"],
  "colors": ["Negro", "Azul", "Blanco"],
  "imageUrl": "https://example.com/adidas-ultraboost-updated.jpg"
}
```

**Response (200 OK)**:

```json
{
  "id": 11,
  "name": "Adidas Ultraboost 22 - Edition 2026",
  "price": 550000.00,
  "stock": 18
}
```

**Errores**:
- `404 Not Found`: Producto no existe

---

#### DELETE /api/products/{id}

Elimina un producto. **Requiere rol Administrator**.

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:

```http
DELETE /api/products/11
Authorization: Bearer {admin-token}
```

**Response (200 OK)**:

```json
{
  "message": "Producto eliminado exitosamente"
}
```

**Errores**:
- `404 Not Found`: Producto no existe
- `400 Bad Request`: Producto tiene órdenes asociadas (integridad referencial)

---

### Orders

#### GET /api/orders

Obtiene las órdenes del usuario autenticado.

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:

```http
GET /api/orders
Authorization: Bearer {token}
```

**Response (200 OK)**:

```json
[
  {
    "id": 5,
    "userId": 3,
    "userName": "juanperez",
    "total": 900000.00,
    "status": "Paid",
    "createdAt": "2026-01-15T08:30:00Z",
    "items": [
      {
        "id": 10,
        "productId": 1,
        "productName": "Nike Air Max 90",
        "quantity": 2,
        "selectedSize": "42",
        "selectedColor": "Negro",
        "priceAtPurchase": 450000.00
      }
    ]
  }
]
```

---

#### GET /api/orders/all

Obtiene TODAS las órdenes del sistema. **Requiere rol Administrator**.

**Headers**:
```
Authorization: Bearer {admin-token}
```

**Query Parameters**:
- `status` (string, opcional): Filtrar por estado ("InProgress", "Paid", "Shipped", "Delivered")

**Request**:

```http
GET /api/orders/all?status=Paid
Authorization: Bearer {admin-token}
```

**Response (200 OK)**:

```json
[
  {
    "id": 1,
    "userId": 2,
    "userName": "cliente",
    "total": 450000.00,
    "status": "Paid",
    "createdAt": "2026-01-10T10:00:00Z",
    "items": [...]
  },
  {
    "id": 5,
    "userId": 3,
    "userName": "juanperez",
    "total": 900000.00,
    "status": "Paid",
    "createdAt": "2026-01-15T08:30:00Z",
    "items": [...]
  }
]
```

---

#### GET /api/orders/{id}

Obtiene detalle de una orden específica.

**Headers**:
```
Authorization: Bearer {token}
```

**Autorización**:
- Clientes: Solo pueden ver sus propias órdenes
- Administradores: Pueden ver cualquier orden

**Request**:

```http
GET /api/orders/5
Authorization: Bearer {token}
```

**Response (200 OK)**:

```json
{
  "id": 5,
  "userId": 3,
  "userName": "juanperez",
  "total": 900000.00,
  "status": "Paid",
  "createdAt": "2026-01-15T08:30:00Z",
  "items": [
    {
      "id": 10,
      "productId": 1,
      "productName": "Nike Air Max 90",
      "quantity": 2,
      "selectedSize": "42",
      "selectedColor": "Negro",
      "priceAtPurchase": 450000.00
    }
  ]
}
```

**Errores**:
- `404 Not Found`: Orden no existe
- `403 Forbidden`: Cliente intentando ver orden de otro usuario

---

#### POST /api/orders

Crea una nueva orden (checkout del carrito).

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:

```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "selectedSize": "42",
      "selectedColor": "Negro"
    },
    {
      "productId": 3,
      "quantity": 1,
      "selectedSize": "40",
      "selectedColor": "Blanco"
    }
  ]
}
```

**Validaciones**:
- Items no puede estar vacío
- Quantity > 0
- Producto debe existir
- Stock suficiente

**Proceso**:
1. Valida stock de cada producto
2. Crea orden con status "InProgress"
3. Crea items con precio actual del producto
4. Reduce stock de productos
5. Calcula total

**Response (201 Created)**:

```json
{
  "id": 6,
  "userId": 3,
  "total": 1150000.00,
  "status": "InProgress",
  "createdAt": "2026-01-15T12:00:00Z",
  "items": [
    {
      "productId": 1,
      "productName": "Nike Air Max 90",
      "quantity": 2,
      "priceAtPurchase": 450000.00
    },
    {
      "productId": 3,
      "productName": "Puma RS-X",
      "quantity": 1,
      "priceAtPurchase": 250000.00
    }
  ]
}
```

**Errores**:
- `400 Bad Request`: Stock insuficiente, producto no existe, validación fallida

---

#### PUT /api/orders/{id}/status

Cambia el estado de una orden. **Requiere rol Administrator**.

**Headers**:
```
Authorization: Bearer {admin-token}
```

**Request**:

```http
PUT /api/orders/5/status
Content-Type: application/json
Authorization: Bearer {admin-token}

{
  "status": "Shipped"
}
```

**Estados válidos**:
- `InProgress`: En proceso (inicial)
- `Paid`: Pagado
- `Shipped`: Enviado
- `Delivered`: Entregado

**Response (200 OK)**:

```json
{
  "message": "Estado de la orden actualizado exitosamente"
}
```

**Errores**:
- `404 Not Found`: Orden no existe
- `400 Bad Request`: Estado inválido

---

### Users

#### GET /api/users

Lista todos los usuarios del sistema. **Requiere rol Administrator**.

**Headers**:
```
Authorization: Bearer {admin-token}
```

**Request**:

```http
GET /api/users
Authorization: Bearer {admin-token}
```

**Response (200 OK)**:

```json
[
  {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "username": "admin",
    "age": 30,
    "country": "Colombia",
    "state": "Antioquia",
    "city": "Medellín",
    "phone": "+57 300 111 2222",
    "address": "Calle 1 #2-3",
    "role": "Administrator",
    "profileImageUrl": null,
    "createdAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "firstName": "Cliente",
    "lastName": "Prueba",
    "username": "cliente",
    "role": "Client",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

#### DELETE /api/users/{id}

Elimina un usuario. **Requiere rol Administrator**.

**Headers**:
```
Authorization: Bearer {admin-token}
```

**Validaciones**:
- No se puede eliminar si tiene órdenes asociadas (integridad referencial)

**Request**:

```http
DELETE /api/users/5
Authorization: Bearer {admin-token}
```

**Response (200 OK)**:

```json
{
  "message": "Usuario eliminado exitosamente"
}
```

**Errores**:
- `404 Not Found`: Usuario no existe
- `400 Bad Request`: Usuario tiene pedidos asociados

---

#### PUT /api/users/{id}/role

Cambia el rol de un usuario (promover a admin o degradar a cliente). **Requiere rol Administrator**.

**Headers**:
```
Authorization: Bearer {admin-token}
```

**Request**:

```http
PUT /api/users/3/role
Content-Type: application/json
Authorization: Bearer {admin-token}

{
  "role": "Administrator"
}
```

**Roles válidos**:
- `Client` (valor numérico: 1)
- `Administrator` (valor numérico: 2)

**Response (200 OK)**:

```json
{
  "message": "Rol de usuario actualizado exitosamente"
}
```

**Errores**:
- `404 Not Found`: Usuario no existe
- `400 Bad Request`: Rol inválido

---

## 📦 Modelos de Datos

### UserDto

```json
{
  "id": 1,
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "age": 25,
  "country": "string",
  "state": "string",
  "city": "string",
  "phone": "string",
  "address": "string",
  "role": "Client | Administrator",
  "profileImageUrl": "string | null",
  "createdAt": "2026-01-15T00:00:00Z"
}
```

### ProductDto

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "price": 450000.00,
  "stock": 15,
  "sizes": ["38", "39", "40"],
  "colors": ["Negro", "Blanco"],
  "imageUrl": "string",
  "createdAt": "2026-01-15T00:00:00Z"
}
```

### OrderDto

```json
{
  "id": 1,
  "userId": 2,
  "userName": "string",
  "total": 900000.00,
  "status": "InProgress | Paid | Shipped | Delivered",
  "createdAt": "2026-01-15T00:00:00Z",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "string",
      "quantity": 2,
      "selectedSize": "42",
      "selectedColor": "Negro",
      "priceAtPurchase": 450000.00
    }
  ]
}
```

### LoginRequest

```json
{
  "username": "string",
  "password": "string"
}
```

### RegisterRequest

```json
{
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "password": "string",
  "confirmPassword": "string",
  "age": 25,
  "country": "string",
  "state": "string",
  "city": "string",
  "phone": "string",
  "address": "string"
}
```

### CreateOrderRequest

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "selectedSize": "42",
      "selectedColor": "Negro"
    }
  ]
}
```

## 🚦 Códigos de Estado

### Exitosos (2xx)

- **200 OK**: Request exitoso
- **201 Created**: Recurso creado exitosamente

### Errores del Cliente (4xx)

- **400 Bad Request**: Validación fallida o request inválido
- **401 Unauthorized**: No autenticado (falta token o token inválido)
- **403 Forbidden**: Autenticado pero sin permisos suficientes
- **404 Not Found**: Recurso no encontrado

### Errores del Servidor (5xx)

- **500 Internal Server Error**: Error interno del servidor

### Estructura de Error

```json
{
  "message": "Descripción del error",
  "details": "Detalles adicionales (opcional)"
}
```

## 💡 Ejemplos de Uso

### Ejemplo 1: Flujo completo de compra

```bash
# 1. Login
curl -X POST http://localhost:5047/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"cliente","password":"Client123!"}'

# Response: { "token": "eyJ...", "role": "Client", ... }

# 2. Ver productos
curl http://localhost:5047/api/products \
  -H "Authorization: Bearer eyJ..."

# 3. Crear orden
curl -X POST http://localhost:5047/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "selectedSize": "42",
        "selectedColor": "Negro"
      }
    ]
  }'

# 4. Ver mis órdenes
curl http://localhost:5047/api/orders \
  -H "Authorization: Bearer eyJ..."
```

### Ejemplo 2: Gestión de productos (Admin)

```bash
# 1. Login como admin
curl -X POST http://localhost:5047/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

# 2. Crear producto
curl -X POST http://localhost:5047/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{
    "name": "New Sneakers",
    "description": "Amazing shoes",
    "price": 300000,
    "stock": 50,
    "sizes": ["38","39","40"],
    "colors": ["Negro"],
    "imageUrl": "https://example.com/img.jpg"
  }'

# 3. Actualizar producto
curl -X PUT http://localhost:5047/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{
    "name": "Updated Name",
    "price": 350000,
    ...
  }'

# 4. Cambiar estado de orden
curl -X PUT http://localhost:5047/api/orders/5/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{"status":"Shipped"}'
```

### Ejemplo 3: Gestión de usuarios (Admin)

```bash
# 1. Listar todos los usuarios
curl http://localhost:5047/api/users \
  -H "Authorization: Bearer eyJ..."

# 2. Promover usuario a administrador
curl -X PUT http://localhost:5047/api/users/3/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{"role":"Administrator"}'

# 3. Eliminar usuario
curl -X DELETE http://localhost:5047/api/users/5 \
  -H "Authorization: Bearer eyJ..."
```

## 📝 Notas Adicionales

### Rate Limiting

Actualmente no hay rate limiting implementado. Se recomienda para producción.

### Paginación

La paginación no está implementada en v1.0. Todos los endpoints devuelven todos los resultados.

### CORS

CORS está configurado y puede ajustarse mediante variables de entorno:

```bash
CORS_ALLOWED_ORIGINS=http://localhost:4200,https://yourdomain.com
```

### Swagger

Para testing interactivo, visita `/swagger` en tu navegador después de iniciar el backend.

---

**Última actualización**: Enero 15, 2026
**Versión**: 1.0.0

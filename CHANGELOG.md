# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-01-15

### 🎉 Release Inicial

Primera versión completa de KicksUp - Sistema de e-commerce para tenis deportivos.

### ✨ Agregado

#### Backend
- Arquitectura limpia (Clean Architecture) con CQRS usando MediatR
- API REST completa con .NET 9.0
- Autenticación JWT con roles (Administrator/Client)
- Gestión completa de productos (CRUD)
- Sistema de órdenes con estados (En proceso, Pagado, Enviado, Entregado)
- Gestión de usuarios (crear, eliminar, cambiar roles)
- Base de datos PostgreSQL con Entity Framework Core
- Migraciones automáticas en startup
- Seed de datos iniciales (usuario admin, productos de ejemplo)
- Swagger/OpenAPI con autenticación JWT
- Manejo global de errores
- Validaciones con FluentValidation
- Hash de contraseñas con BCrypt
- CORS configurable por ambiente

**Entidades del dominio:**
- `User` - Usuarios del sistema con roles
- `Product` - Productos del catálogo
- `Order` - Órdenes de compra
- `OrderItem` - Items individuales de cada orden

**Comandos (CQRS):**
- `RegisterUserCommand` - Registro de nuevos usuarios
- `LoginCommand` - Autenticación de usuarios
- `CreateProductCommand` - Crear productos (Admin)
- `UpdateProductCommand` - Actualizar productos (Admin)
- `DeleteProductCommand` - Eliminar productos (Admin)
- `CreateOrderCommand` - Crear nueva orden
- `UpdateOrderStatusCommand` - Cambiar estado de orden (Admin)
- `UpdateUserProfileCommand` - Actualizar perfil de usuario
- `UpdateUserRoleCommand` - Cambiar rol de usuario (Admin)
- `DeleteUserCommand` - Eliminar usuario (Admin)

**Queries (CQRS):**
- `GetAllProductsQuery` - Listar productos con filtros
- `GetProductByIdQuery` - Obtener producto específico
- `GetUserOrdersQuery` - Órdenes del usuario actual
- `GetAllOrdersQuery` - Todas las órdenes (Admin)
- `GetOrderByIdQuery` - Detalle de orden específica
- `GetUserProfileQuery` - Perfil del usuario actual
- `GetAllUsersQuery` - Listar todos los usuarios (Admin)

**Endpoints:**
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Autenticación
- `GET /api/auth/profile` - Perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `GET /api/products` - Listar productos
- `GET /api/products/{id}` - Detalle de producto
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/{id}` - Actualizar producto (Admin)
- `DELETE /api/products/{id}` - Eliminar producto (Admin)
- `GET /api/orders` - Órdenes del usuario
- `GET /api/orders/all` - Todas las órdenes (Admin)
- `GET /api/orders/{id}` - Detalle de orden
- `POST /api/orders` - Crear orden
- `PUT /api/orders/{id}/status` - Cambiar estado (Admin)
- `GET /api/users` - Listar usuarios (Admin)
- `DELETE /api/users/{id}` - Eliminar usuario (Admin)
- `PUT /api/users/{id}/role` - Cambiar rol (Admin)

#### Frontend
- Aplicación Angular 18 con arquitectura modular
- Componentes standalone (sin módulos)
- Signals para manejo de estado reactivo
- Autenticación con guards y interceptores JWT
- Diseño responsive con SCSS
- Layouts separados (público/cliente/admin)

**Features del Cliente:**
- Catálogo de productos con filtros (búsqueda, talla, color, precio)
- Detalle de producto con selección de cantidad
- Carrito de compras persistente (LocalStorage)
- Gestión del carrito (agregar, editar cantidad, eliminar)
- Finalizar compra (pago contra entrega)
- Historial de órdenes
- Perfil de usuario editable
- Upload de foto de perfil

**Features del Administrador:**
- Dashboard con estadísticas (productos, órdenes, usuarios)
- Gestión completa de productos (crear, editar, eliminar)
- Gestión de órdenes (ver todas, cambiar estados)
- Gestión de usuarios (listar, promover/degradar roles, eliminar)
- Validaciones de integridad referencial
- Panel responsive

**Componentes principales:**
- `LoginComponent` - Autenticación
- `RegisterComponent` - Registro con confirmación de contraseña
- `ProductListComponent` - Catálogo con filtros
- `ProductDetailComponent` - Detalle de producto
- `CartComponent` - Carrito de compras
- `OrdersComponent` - Historial de órdenes del usuario
- `ProfileComponent` - Perfil con upload de imagen
- `AdminDashboardComponent` - Dashboard administrativo
- `AdminProductsComponent` - Gestión de productos
- `AdminOrdersComponent` - Gestión de órdenes
- `AdminUsersComponent` - Gestión de usuarios

**Servicios:**
- `AuthService` - Autenticación y autorización
- `ProductService` - Gestión de productos
- `OrderService` - Gestión de órdenes
- `UserService` - Gestión de usuarios
- `CartService` - Carrito de compras con LocalStorage

**Guards:**
- `AuthGuard` - Protección de rutas autenticadas
- `AdminGuard` - Protección de rutas administrativas

**Interceptors:**
- `AuthInterceptor` - Inyección automática de JWT

#### DevOps & Deployment
- Sistema de variables de entorno para ambos stacks
- Docker Compose con 3 servicios (postgres, backend, frontend)
- Dockerfile multi-stage para .NET
- Nginx como servidor web y proxy reverso
- Scripts de deployment (PowerShell y Bash)
- Configuración de ambientes (development/production)
- Health checks en Docker Compose
- Documentación completa de deployment

**Archivos de configuración:**
- `appsettings.json` / `appsettings.Development.json` / `appsettings.Production.json`
- `.env.development` / `.env.production` / `.env.example` (backend y frontend)
- `environment.ts` / `environment.development.ts` / `environment.production.ts`
- `docker-compose.yml`
- `Dockerfile`
- `nginx.conf`
- `deploy.ps1` / `deploy.sh`

#### Documentación
- README.md completo con instalación y uso
- DEPLOYMENT.md con instrucciones para múltiples plataformas
- CONTRIBUTING.md con guías de contribución
- CODE_OF_CONDUCT.md
- CHANGELOG.md (este archivo)
- LICENSE (MIT)
- SECURITY.md con políticas de seguridad
- ARCHITECTURE.md con documentación técnica
- API.md con documentación de endpoints
- roadmap.md con plan de desarrollo

### 🔒 Seguridad
- Passwords hasheados con BCrypt (costo factor 12)
- JWT con expiración configurable
- Autorización basada en roles
- CORS configurable por ambiente
- Validación de entrada en backend
- Protection contra SQL injection (EF Core parametrizado)
- Validación de integridad referencial

### 🎨 UI/UX
- Diseño moderno y responsivo
- Tema oscuro consistente
- Iconos SVG personalizados
- Animaciones y transiciones suaves
- Feedback visual en acciones
- Estados de carga
- Mensajes de error claros
- Confirmaciones para acciones destructivas

### 📊 Base de Datos
- PostgreSQL 14+
- Migraciones con EF Core
- Índices en columnas frecuentemente consultadas
- Relaciones con cascadas configuradas
- Timestamps UTC en todas las entidades
- Seed de datos de ejemplo

**Tablas:**
- `Users` - Usuarios del sistema
- `Products` - Catálogo de productos
- `Orders` - Órdenes de compra
- `OrderItems` - Items de cada orden

### 🧪 Testing
- Proyecto configurado para tests unitarios
- Tests de integración preparados
- Swagger para testing manual de API

### ⚡ Performance
- Queries optimizadas con EF Core
- Lazy loading deshabilitado
- Paginación preparada (no implementada en v1.0)
- Índices en base de datos
- Compresión gzip en nginx
- Cache de assets estáticos
- Build optimizado para producción

### 🌐 Internacionalización
- Mensajes en español
- Preparado para i18n futuro

## [Unreleased]

### 🚧 Planeado para versiones futuras

- Paginación en listados
- Búsqueda avanzada de productos
- Filtros adicionales (marca, categoría)
- Wishlist de productos
- Reviews y ratings de productos
- Notificaciones por email
- Panel de reportes con gráficas
- Exportación de datos (CSV, PDF)
- Sistema de cupones/descuentos
- Integración con pasarelas de pago
- Tracking de envíos
- Sistema de devoluciones
- Multi-idioma (i18n)
- Dark/Light theme toggle
- PWA (Progressive Web App)
- Tests automatizados completos
- CI/CD pipeline
- Logs estructurados
- Monitoreo y métricas
- Cache distribuido
- WebSockets para notificaciones en tiempo real

---

## Tipos de Cambios

- `✨ Agregado` - Para nuevas funcionalidades
- `🔄 Cambiado` - Para cambios en funcionalidades existentes
- `🗑️ Deprecado` - Para funcionalidades que serán removidas
- `🗿 Removido` - Para funcionalidades removidas
- `🐛 Corregido` - Para correcciones de bugs
- `🔒 Seguridad` - Para cambios de seguridad

## Versionado

Este proyecto usa [Semantic Versioning](https://semver.org/):

- **MAJOR** version para cambios incompatibles en la API
- **MINOR** version para nueva funcionalidad compatible con versiones anteriores
- **PATCH** version para correcciones de bugs compatibles

---

**Última actualización**: Enero 15, 2026

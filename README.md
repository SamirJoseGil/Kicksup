# KicksUp 👟

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-18-DD0031)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791)](https://www.postgresql.org/)

Sistema de e-commerce completo para la venta de tenis deportivos con panel de administración, construido con Clean Architecture y CQRS.

**🎓 Proyecto desarrollado como prueba técnica - Universidad EAFIT**

---

## ✨ Características

### 🛍️ Cliente
- ✅ Catálogo de productos con filtros (talla, color, búsqueda)
- ✅ Carrito de compras persistente
- ✅ Gestión de pedidos
- ✅ Perfil de usuario con foto
- ✅ Autenticación JWT
- ✅ Historial de compras

### 👨‍💼 Administrador
- ✅ Dashboard con estadísticas
- ✅ Gestión completa de productos (CRUD)
- ✅ Gestión de pedidos y cambio de estado
- ✅ Gestión de usuarios (promover/degradar roles, eliminar)
- ✅ Validaciones de integridad referencial
- ✅ Panel responsive

---

## 🧱 Arquitectura General

El proyecto sigue **Clean Architecture** con **CQRS** usando MediatR.

### Backend (.NET 9.0)
- **Domain**: Entidades y enums
- **Application**: Comandos, queries y validaciones
- **Infrastructure**: PostgreSQL, EF Core, JWT
- **API**: Controllers, Swagger, CORS

### Frontend (Angular 18)
- Arquitectura modular por features
- Standalone components
- Signals para reactividad
- Guards para protección de rutas
- Servicios con HttpClient

---

## 🗂️ Estructura del Proyecto

```

kicksup/
│
├── backend/
│   ├── KicksUp.Api
│   ├── KicksUp.Application
│   ├── KicksUp.Domain
│   └── KicksUp.Infrastructure
│
├── frontend/
│   └── src
│
└── README.md

```

---

## 🚀 Tecnologías Utilizadas

### Backend
- .NET 9.0
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Swagger/OpenAPI
- MediatR (CQRS)
- BCrypt.NET
- JWT Authentication

### Frontend
- Angular 18
- TypeScript 5
- SCSS
- RxJS
- Signals
- Standalone Components
- Guards & Interceptors

---

## 📦 Instalación y Ejecución

### ⚙️ Requisitos Previos

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/) y npm
- [PostgreSQL 14+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)
- IDE recomendado: [Visual Studio Code](https://code.visualstudio.com/)

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/samirjosegil/kicksup.git
cd kicksup
```

### 2️⃣ Configurar Backend

```bash
# Navegar al proyecto API
cd backend/KicksUp.Api

# Copiar archivo de variables de entorno
cp .env.development .env

# Editar .env con tu configuración de PostgreSQL
# DATABASE_URL, JWT_SECRET, etc.

# Restaurar dependencias
dotnet restore

# Ejecutar (las migraciones se aplican automáticamente)
dotnet run
```

✅ **Backend disponible en**: `http://localhost:5047`  
📘 **Swagger UI**: `http://localhost:5047/swagger`

### 3️⃣ Configurar Frontend

```bash
# Desde la raíz del proyecto
cd frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.development .env

# Ejecutar en modo desarrollo
npm start
```

✅ **Frontend disponible en**: `http://localhost:4200`

### 4️⃣ Usuarios de Prueba

El sistema incluye usuarios de prueba pre-configurados:

**👨‍💼 Administrador**
```
Usuario: admin
Contraseña: Admin123!
```

**👤 Cliente**
```
Usuario: cliente
Contraseña: Client123!
```

---

**Servicios disponibles**:
- 🌐 Frontend: `http://localhost`
- 🔌 Backend API: `http://localhost:5047`
- 📘 Swagger: `http://localhost:5047/swagger`
- 🗄️ PostgreSQL: `localhost:5432`

---

## 📚 Documentación Adicional

| Documento | Descripción |
|-----------|-------------|
| [📖 API.md](API.md) | Documentación completa de la API REST con ejemplos |
| [🏗️ ARCHITECTURE.md](ARCHITECTURE.md) | Arquitectura del sistema, patrones y flujos de datos |
| [📝 CHANGELOG.md](CHANGELOG.md) | Historial de cambios y versiones |
| [🔒 SECURITY.md](SECURITY.md) | Políticas de seguridad y reportes de vulnerabilidades |
| [📘 Swagger UI](http://localhost:5047/swagger) | Documentación interactiva de la API (servidor activo) |

---

## 🔐 Funcionalidades Principales

### Autenticación y Autorización
- JWT con roles (Administrator/Client)
- Guards en frontend
- Políticas de autorización en backend

### Gestión de Productos
- CRUD completo con validaciones
- Filtros: búsqueda, talla, color
- Control de stock
- Validación de integridad (pedidos asociados)

### Carrito de Compras
- Persistencia en LocalStorage
- Sincronización con stock
- Agregar, editar y eliminar productos
- Cálculo del total de la compra
- Compra contra entrega

### Órdenes
- Creación de órdenes
- Gestión de estados: En proceso, Pagado, Enviado, Entregado
- Visualización y filtrado de órdenes (admin)

---

## 🧪 Pruebas y Testing

### Swagger UI

Para probar la API interactivamente:

1. Inicia el backend: `dotnet run` en `backend/KicksUp.Api`
2. Abre tu navegador en: `http://localhost:5047/swagger`
3. Haz clic en "Authorize" y usa uno de los usuarios de prueba
4. Explora y prueba los endpoints

### Colección Postman

_(Próximamente: Colección de Postman para testing de API)_

---

## 📐 Buenas Prácticas Aplicadas

- ✅ **SOLID Principles** - Código mantenible y extensible
- ✅ **Clean Architecture** - Separación clara de responsabilidades
- ✅ **CQRS Pattern** - Comandos y queries separados con MediatR
- ✅ **Repository Pattern** - Abstracción del acceso a datos
- ✅ **Dependency Injection** - Inversión de control
- ✅ **Validations** - FluentValidation en backend, Reactive Forms en frontend
- ✅ **Error Handling** - Manejo centralizado de errores
- ✅ **Security** - JWT, BCrypt, CORS, Role-based authorization
- ✅ **Code Quality** - Código limpio, legible y documentado
- ✅ **Conventional Commits** - Commits semánticos y estructurados
- ✅ **Environment Variables** - Configuración por ambiente
- ✅ **Docker Support** - Containerización completa

---

## 🧠 Decisiones de Diseño

### Backend

- **PostgreSQL** en lugar de SQLite para escalabilidad y deployment real
- **CQRS con MediatR** para separar responsabilidades de lectura/escritura
- **Clean Architecture** para mantener el dominio independiente de frameworks
- **JWT** para autenticación stateless y facilitar escalado horizontal
- **BCrypt** con work factor 12 para hash seguro de contraseñas
- **UTC timestamps** para evitar problemas de zona horaria
- **Validación en múltiples capas**: FluentValidation + Data Annotations

### Frontend

- **Standalone Components** (Angular 18) para eliminar NgModules
- **Signals** para estado reactivo simple sin bibliotecas externas
- **LocalStorage** para carrito según requerimiento de persistencia
- **Guards + Interceptors** para seguridad declarativa
- **Lazy Loading** preparado para optimización futura
- **SCSS** para estilos mantenibles con variables y nesting

### DevOps

- **Docker Compose** para desarrollo y deployment simplificado
- **Multi-stage builds** para imágenes optimizadas
- **Environment variables** para configuración flexible
- **Nginx** como servidor web y reverse proxy para SPA
- **Health checks** para robustez en containers

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](CONTRIBUTING.md) para conocer:

- Cómo reportar bugs
- Cómo sugerir mejoras
- Proceso de desarrollo
- Guías de estilo (C#, TypeScript, SCSS)
- Estructura de commits (Conventional Commits)
- Proceso de Pull Requests

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License - Copyright (c) 2026 Samir Jose Osorio Gil
```

## 🔒 Seguridad

Si descubres una vulnerabilidad de seguridad, por favor sigue nuestra [Política de Seguridad](SECURITY.md) para reportarla de manera responsable.

**NO** abras issues públicos para problemas de seguridad.

---

## 👤 Autor

**Samir Jose Osorio Gil**

- 🎓 Universidad EAFIT
- 📅 Enero 2026
- 🎯 Prueba técnica - Sistema de E-commerce

### Contacto

- GitHub: [@samirjosegil](https://github.com/samirjosegil)

---

## 🙏 Agradecimientos

- Universidad EAFIT por la oportunidad
- Comunidad de .NET y Angular por la documentación
- Todos los contribuyentes de código abierto

---

<div align="center">

**⭐ Si este proyecto te resultó útil, considera darle una estrella ⭐**

[![GitHub stars](https://img.shields.io/github/stars/samirjosegil/kicksup?style=social)](https://github.com/samirjosegil/kicksup/stargazers)

**Hecho con ❤️ usando .NET 9.0 y Angular 18**

</div>
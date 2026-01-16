# Arquitectura de KicksUp 🏗️

Este documento describe la arquitectura técnica del sistema KicksUp, un e-commerce de tenis deportivos construido con .NET 9.0 y Angular 18.

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Arquitectura del Backend](#arquitectura-del-backend)
- [Arquitectura del Frontend](#arquitectura-del-frontend)
- [Modelo de Datos](#modelo-de-datos)
- [Patrones de Diseño](#patrones-de-diseño)
- [Flujos de Datos](#flujos-de-datos)
- [Seguridad](#seguridad)
- [Despliegue](#despliegue)

## 🎯 Visión General

KicksUp sigue una arquitectura de **microservicios simplificada** con separación completa entre frontend y backend, comunicándose mediante API REST.

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
         ┌──────────────┴───────────────┐
         │                              │
         ▼                              ▼
┌─────────────────┐            ┌─────────────────┐
│   FRONTEND      │   HTTP     │    BACKEND      │
│   Angular 18    │◄──────────►│   .NET 9.0      │
│   Port 4200     │   REST API │   Port 5047     │
└─────────────────┘            └────────┬────────┘
                                        │
                                        │ EF Core
                                        ▼
                               ┌─────────────────┐
                               │   PostgreSQL    │
                               │   Database      │
                               └─────────────────┘
```

### Tecnologías Principales

#### Backend
- **.NET 9.0**: Framework principal
- **ASP.NET Core Web API**: Servidor HTTP
- **Entity Framework Core 9.0**: ORM
- **PostgreSQL 14+**: Base de datos
- **MediatR**: Implementación de CQRS
- **FluentValidation**: Validación de comandos/queries
- **BCrypt.NET**: Hashing de contraseñas
- **JWT Bearer**: Autenticación

#### Frontend
- **Angular 18**: Framework SPA
- **TypeScript 5**: Lenguaje principal
- **RxJS**: Programación reactiva
- **Signals**: Manejo de estado
- **SCSS**: Estilos
- **Standalone Components**: Sin módulos

## 🏛️ Arquitectura del Backend

### Clean Architecture

El backend sigue los principios de **Clean Architecture** (Uncle Bob), organizando el código en capas concéntricas con dependencias unidireccionales hacia el centro.

```
┌───────────────────────────────────────────────────────┐
│                    KicksUp.Api                        │
│  (Controllers, Middleware, Startup Configuration)     │
└────────────────────┬──────────────────────────────────┘
                     │ depende de
         ┌───────────┴────────────┐
         │                        │
         ▼                        ▼
┌──────────────────┐    ┌──────────────────────┐
│   Application    │    │   Infrastructure     │
│ (Commands/Queries│    │  (DB, External Svcs) │
│   Validations)   │    │                      │
└────────┬─────────┘    └──────────┬───────────┘
         │                         │
         │       dependen de       │
         └───────────┬─────────────┘
                     ▼
            ┌─────────────────┐
            │     Domain      │
            │   (Entities,    │
            │    Enums)       │
            └─────────────────┘
```

### Capas del Backend

#### 1. Domain (Núcleo)

**Responsabilidad**: Entidades de negocio y lógica de dominio.

```
KicksUp.Domain/
├── Entities/
│   ├── BaseEntity.cs         # Clase base con Id, CreatedAt, UpdatedAt
│   ├── User.cs               # Usuario del sistema
│   ├── Product.cs            # Producto del catálogo
│   ├── Order.cs              # Orden de compra
│   └── OrderItem.cs          # Item de una orden
└── Enums/
    ├── UserRole.cs           # Client = 1, Administrator = 2
    └── OrderStatus.cs        # InProgress, Paid, Shipped, Delivered
```

**Entidades principales**:

```csharp
// BaseEntity - Clase base abstracta
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// User - Usuario con autenticación y roles
public class User : BaseEntity
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public int Age { get; set; }
    public string Country { get; set; }
    public string State { get; set; }
    public string City { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public UserRole Role { get; set; }
    public string? ProfileImageUrl { get; set; }
    public ICollection<Order> Orders { get; set; }
}

// Product - Producto del catálogo
public class Product : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string[] Sizes { get; set; }
    public string[] Colors { get; set; }
    public string ImageUrl { get; set; }
}

// Order - Orden de compra
public class Order : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; }
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; }
    public ICollection<OrderItem> Items { get; set; }
}

// OrderItem - Item individual de una orden
public class OrderItem : BaseEntity
{
    public int OrderId { get; set; }
    public Order Order { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; }
    public int Quantity { get; set; }
    public string? SelectedSize { get; set; }
    public string? SelectedColor { get; set; }
    public decimal PriceAtPurchase { get; set; }
}
```

#### 2. Application (Casos de Uso)

**Responsabilidad**: Lógica de aplicación usando CQRS.

```
KicksUp.Application/
├── Common/
│   ├── Interfaces/
│   │   └── IApplicationDbContext.cs  # Abstracción del DbContext
│   └── DTOs/
│       ├── UserDto.cs
│       ├── ProductDto.cs
│       └── OrderDto.cs
├── Auth/
│   ├── Commands/
│   │   ├── RegisterUserCommand.cs
│   │   ├── LoginCommand.cs
│   │   └── UpdateUserProfileCommand.cs
│   ├── Queries/
│   │   └── GetUserProfileQuery.cs
│   └── Validators/
│       └── RegisterUserCommandValidator.cs
├── Products/
│   ├── Commands/
│   │   ├── CreateProductCommand.cs
│   │   ├── UpdateProductCommand.cs
│   │   └── DeleteProductCommand.cs
│   ├── Queries/
│   │   ├── GetAllProductsQuery.cs
│   │   └── GetProductByIdQuery.cs
│   └── Validators/
├── Orders/
│   ├── Commands/
│   │   ├── CreateOrderCommand.cs
│   │   └── UpdateOrderStatusCommand.cs
│   ├── Queries/
│   │   ├── GetUserOrdersQuery.cs
│   │   ├── GetAllOrdersQuery.cs
│   │   └── GetOrderByIdQuery.cs
│   └── Validators/
└── Users/
    ├── Commands/
        ├── DeleteUserCommand.cs
    │   └── UpdateUserRoleCommand.cs
    └── Queries/
        └── GetAllUsersQuery.cs
```

**Patrón CQRS**:

```csharp
// Comando - Modifica estado
public class CreateProductCommand : IRequest<ProductDto>
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    // ... más propiedades
}

public class CreateProductCommandHandler 
    : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IApplicationDbContext _context;
    
    public async Task<ProductDto> Handle(
        CreateProductCommand request, 
        CancellationToken cancellationToken)
    {
        var product = new Product { Name = request.Name, ... };
        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);
        return MapToDto(product);
    }
}

// Query - Solo lectura
public class GetAllProductsQuery : IRequest<List<ProductDto>>
{
    public string? SearchTerm { get; set; }
    public string? Size { get; set; }
    public string? Color { get; set; }
}

public class GetAllProductsQueryHandler 
    : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
{
    private readonly IApplicationDbContext _context;
    
    public async Task<List<ProductDto>> Handle(
        GetAllProductsQuery request, 
        CancellationToken cancellationToken)
    {
        var query = _context.Products.AsQueryable();
        
        if (!string.IsNullOrEmpty(request.SearchTerm))
            query = query.Where(p => p.Name.Contains(request.SearchTerm));
            
        return await query.Select(p => MapToDto(p)).ToListAsync();
    }
}
```

#### 3. Infrastructure (Detalles de Implementación)

**Responsabilidad**: Acceso a datos y servicios externos.

```
KicksUp.Infrastructure/
├── Persistence/
│   ├── ApplicationDbContext.cs     # DbContext principal
│   ├── Configurations/             # Fluent API configs
│   │   ├── UserConfiguration.cs
│   │   ├── ProductConfiguration.cs
│   │   ├── OrderConfiguration.cs
│   │   └── OrderItemConfiguration.cs
│   └── Migrations/                 # Migraciones de EF Core
└── DependencyInjection.cs
```

**ApplicationDbContext**:

```csharp
public class ApplicationDbContext 
    : DbContext, IApplicationDbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Aplicar configuraciones
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(ApplicationDbContext).Assembly);
            
        // Seed de datos
        SeedData(modelBuilder);
    }
    
    public override Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        // Actualizar timestamps automáticamente
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = DateTime.UtcNow;
                
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        
        return base.SaveChangesAsync(cancellationToken);
    }
}
```

#### 4. API (Presentación)

**Responsabilidad**: Controllers, middleware, configuración.

```
KicksUp.Api/
├── Controllers/
│   ├── AuthController.cs
│   ├── ProductsController.cs
│   ├── OrdersController.cs
│   └── UsersController.cs
├── Middleware/
│   └── ExceptionHandlingMiddleware.cs
├── Program.cs
├── appsettings.json
└── appsettings.Development.json
```

**Controllers**:

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    
    // GET /api/products
    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetAll(
        [FromQuery] string? searchTerm,
        [FromQuery] string? size,
        [FromQuery] string? color)
    {
        var query = new GetAllProductsQuery 
        { 
            SearchTerm = searchTerm,
            Size = size,
            Color = color
        };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    // POST /api/products
    [Authorize(Roles = "Administrator")]
    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(
        CreateProductCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(
            nameof(GetById), 
            new { id = result.Id }, 
            result);
    }
}
```

## 🎨 Arquitectura del Frontend

### Estructura Modular por Features

```
src/
├── app/
│   ├── core/                    # Servicios singleton
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── product.service.ts
│   │       ├── order.service.ts
│   │       ├── user.service.ts
│   │       └── cart.service.ts
│   ├── features/               # Features modulares
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── client/
│   │   │   ├── products/
│   │   │   ├── product-detail/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   └── profile/
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── products/
│   │       ├── orders/
│   │       └── users/
│   ├── shared/                 # Componentes compartidos
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   └── footer/
│   │   ├── layouts/
│   │   │   ├── public-layout/
│   │   │   ├── client-layout/
│   │   │   └── admin-layout/
│   │   └── models/
│   │       ├── user.model.ts
│   │       ├── product.model.ts
│   │       └── order.model.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.ts
├── environments/
│   ├── environment.ts
│   ├── environment.development.ts
│   └── environment.production.ts
└── styles.scss
```

### Componentes Standalone

Todos los componentes son standalone (sin NgModules):

```typescript
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, /* ... */],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  // Signals para estado reactivo
  products = signal<Product[]>([]);
  filteredProducts = computed(() => 
    this.products().filter(/* filtros */)
  );
  
  constructor(private productService: ProductService) {
    this.loadProducts();
  }
  
  loadProducts() {
    this.productService.getAllProducts()
      .subscribe(products => this.products.set(products));
  }
}
```

### Gestión de Estado con Signals

```typescript
export class CartService {
  // Signal privado
  private cartItems = signal<CartItem[]>([]);
  
  // Signal público de solo lectura
  public items = this.cartItems.asReadonly();
  
  // Computed signals derivados
  public totalItems = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  public totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0)
  );
  
  // Métodos que actualizan el signal
  addToCart(product: Product, quantity: number) {
    this.cartItems.update(items => [...items, { product, quantity }]);
    this.saveToLocalStorage();
  }
  
  removeFromCart(productId: number) {
    this.cartItems.update(items => 
      items.filter(item => item.product.id !== productId)
    );
    this.saveToLocalStorage();
  }
}
```

### Routing con Guards

```typescript
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Rutas de cliente (requieren autenticación)
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'cart', component: CartComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  
  // Rutas de admin (requieren autenticación + rol)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'users', component: AdminUsersComponent }
    ]
  }
];
```

## 🗄️ Modelo de Datos

### Diagrama Entidad-Relación

```
┌─────────────────────────────────────────────────────────────┐
│                           User                               │
├─────────────────────────────────────────────────────────────┤
│ PK  Id: int                                                  │
│     FirstName: string                                        │
│     LastName: string                                         │
│ UK  Username: string                                         │
│     PasswordHash: string                                     │
│     Role: UserRole (enum: Client=1, Administrator=2)         │
│     Age: int                                                 │
│     Country, State, City: string                             │
│     Phone, Address: string                                   │
│     ProfileImageUrl: string?                                 │
│     CreatedAt, UpdatedAt: DateTime                           │
└─────────┬───────────────────────────────────────────────────┘
          │
          │ 1:N
          │
┌─────────▼───────────────────────────────────────────────────┐
│                          Order                               │
├─────────────────────────────────────────────────────────────┤
│ PK  Id: int                                                  │
│ FK  UserId: int                                              │
│     Total: decimal                                           │
│     Status: OrderStatus (InProgress, Paid, Shipped, ...)    │
│     CreatedAt, UpdatedAt: DateTime                           │
└─────────┬───────────────────────────────────────────────────┘
          │
          │ 1:N
          │
┌─────────▼───────────────────────────────────────────────────┐
│                       OrderItem                              │
├─────────────────────────────────────────────────────────────┤
│ PK  Id: int                                                  │
│ FK  OrderId: int                                             │
│ FK  ProductId: int                                           │
│     Quantity: int                                            │
│     SelectedSize: string?                                    │
│     SelectedColor: string?                                   │
│     PriceAtPurchase: decimal                                 │
│     CreatedAt, UpdatedAt: DateTime                           │
└─────────┬───────────────────────────────────────────────────┘
          │
          │ N:1
          │
┌─────────▼───────────────────────────────────────────────────┐
│                        Product                               │
├─────────────────────────────────────────────────────────────┤
│ PK  Id: int                                                  │
│     Name: string                                             │
│     Description: string                                      │
│     Price: decimal                                           │
│     Stock: int                                               │
│     Sizes: string[] (JSON)                                   │
│     Colors: string[] (JSON)                                  │
│     ImageUrl: string                                         │
│     CreatedAt, UpdatedAt: DateTime                           │
└─────────────────────────────────────────────────────────────┘
```

### Relaciones

- **User → Order**: 1:N (Un usuario puede tener múltiples órdenes)
- **Order → OrderItem**: 1:N (Una orden contiene múltiples items)
- **Product → OrderItem**: 1:N (Un producto puede estar en múltiples items)

### Índices

```sql
-- Índices para performance
CREATE INDEX idx_users_username ON Users(Username);
CREATE INDEX idx_orders_user_id ON Orders(UserId);
CREATE INDEX idx_orders_status ON Orders(Status);
CREATE INDEX idx_order_items_order_id ON OrderItems(OrderId);
CREATE INDEX idx_order_items_product_id ON OrderItems(ProductId);
CREATE INDEX idx_products_name ON Products(Name);
```

## 🎭 Patrones de Diseño

### Backend

#### 1. CQRS (Command Query Responsibility Segregation)

**Separación de comandos (escritura) y queries (lectura)**:

```csharp
// Comando: Modifica estado
public class CreateOrderCommand : IRequest<OrderDto> { }

// Query: Solo lectura
public class GetAllOrdersQuery : IRequest<List<OrderDto>> { }
```

**Ventajas**:
- Código más mantenible
- Escalabilidad (diferentes bases de datos para lectura/escritura en el futuro)
- Optimización independiente

#### 2. Mediator Pattern

**Desacopla controllers de handlers**:

```csharp
[HttpPost]
public async Task<ActionResult<OrderDto>> Create(CreateOrderCommand command)
{
    // Controller no conoce la implementación
    var result = await _mediator.Send(command);
    return Ok(result);
}
```

#### 3. Repository Pattern

**Abstracción del acceso a datos**:

```csharp
public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Product> Products { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
```

#### 4. Dependency Injection

**Inversión de control**:

```csharp
public class CreateProductCommandHandler
{
    private readonly IApplicationDbContext _context;
    
    // Inyección por constructor
    public CreateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }
}
```

### Frontend

#### 1. Service Pattern

**Centralización de lógica de negocio**:

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
```

#### 2. Guard Pattern

**Protección de rutas**:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return this.authService.isAuthenticated();
  }
}
```

#### 3. Interceptor Pattern

**Modificación de requests HTTP**:

```typescript
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}
```

## 🔄 Flujos de Datos

### Flujo de Autenticación

```
1. Usuario ingresa credenciales en LoginComponent
   │
   ▼
2. AuthService.login() → POST /api/auth/login
   │
   ▼
3. Backend:
   - LoginCommandHandler recibe el comando
   - Busca usuario por username
   - Valida password con BCrypt
   - Genera JWT token
   - Retorna { token, role, user }
   │
   ▼
4. Frontend:
   - Guarda token en localStorage
   - Guarda user data en signal
   - Navega según rol:
     * Client → /client/products
     * Administrator → /admin/dashboard
```

### Flujo de Compra

```
1. Usuario agrega productos al carrito (CartService)
   │
   ▼
2. Carrito se guarda en LocalStorage automáticamente
   │
   ▼
3. Usuario va a /client/cart y hace checkout
   │
   ▼
4. CartComponent → OrderService.createOrder()
   │
   ▼
5. Backend (CreateOrderCommand):
   - Valida stock de productos
   - Crea Order con Status = InProgress
   - Crea OrderItems con precio actual
   - Reduce stock de productos
   - Calcula total
   - Guarda en base de datos
   │
   ▼
6. Frontend:
   - Limpia carrito
   - Navega a /client/orders
   - Muestra mensaje de éxito
```

### Flujo de Gestión de Productos (Admin)

```
1. Admin crea/edita producto en AdminProductsComponent
   │
   ▼
2. ProductService → POST/PUT /api/products
   │
   ▼
3. Backend:
   - Valida autorización (Role = Administrator)
   - CreateProductCommandHandler procesa
   - Valida datos (precio > 0, stock >= 0, etc.)
   - Guarda en base de datos
   │
   ▼
4. Frontend actualiza lista de productos
```

## 🔒 Seguridad

### Autenticación JWT

```
┌──────────┐                          ┌──────────┐
│  Client  │                          │  Server  │
└────┬─────┘                          └────┬─────┘
     │                                     │
     │ 1. POST /api/auth/login             │
     │   { username, password }            │
     ├────────────────────────────────────►│
     │                                     │
     │                                     │ 2. Valida credenciales
     │                                     │    Hash password con BCrypt
     │                                     │
     │ 3. { token, role, user }            │
     │◄────────────────────────────────────┤
     │                                     │
     │ 4. Guarda token en localStorage     │
     │                                     │
     │ 5. GET /api/products                │
     │    Authorization: Bearer {token}    │
     ├────────────────────────────────────►│
     │                                     │
     │                                     │ 6. Valida JWT
     │                                     │    Extrae claims
     │                                     │    Verifica rol
     │                                     │
     │ 7. { products: [...] }              │
     │◄────────────────────────────────────┤
```

### Configuración JWT

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Jwt:Key"]))
        };
    });
```

### Hashing de Contraseñas

```csharp
// Al registrar usuario
user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(
    request.Password, 
    workFactor: 12
);

// Al validar login
bool isValid = BCrypt.Net.BCrypt.Verify(
    request.Password, 
    user.PasswordHash
);
```

### Autorización Basada en Roles

```csharp
// En controllers
[Authorize(Roles = "Administrator")]
[HttpPost]
public async Task<ActionResult> CreateProduct(...)
{
    // Solo administradores pueden acceder
}
```

```typescript
// En frontend
export class AdminGuard implements CanActivate {
  canActivate(): boolean {
    const user = this.authService.currentUser();
    return user?.role === 'Administrator';
  }
}
```

## 🚀 Despliegue

### Arquitectura de Deployment

```
┌───────────────────────────────────────────────────────┐
│                   CLOUD PROVIDER                       │
│  (Azure, AWS, DigitalOcean, etc.)                     │
├───────────────────────────────────────────────────────┤
│                                                        │
│  ┌────────────────────┐      ┌──────────────────┐    │
│  │  Frontend (nginx)  │      │   Backend (.NET) │    │
│  │  Port 80/443       │─────►│   Port 5047      │    │
│  │  Angular SPA       │      │   Web API        │    │
│  └────────────────────┘      └────────┬─────────┘    │
│                                        │               │
│                                        │               │
│                               ┌────────▼─────────┐    │
│                               │   PostgreSQL     │    │
│                               │   Port 5432      │    │
│                               └──────────────────┘    │
└───────────────────────────────────────────────────────┘
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: kicksup
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
    ports:
      - "5047:5047"

  frontend:
    image: nginx:alpine
    volumes:
      - ./frontend/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 📊 Escalabilidad Futura

### Optimizaciones Planeadas

1. **Caching**:
   - Redis para sesiones y datos frecuentes
   - Cache de consultas en memoria

2. **Base de Datos**:
   - Read replicas para queries
   - Particionamiento de tablas grandes

3. **CDN**:
   - Assets estáticos en CDN
   - Imágenes optimizadas

4. **Microservicios**:
   - Separar órdenes en servicio independiente
   - Event-driven architecture con RabbitMQ/Kafka

5. **Monitoreo**:
   - Application Insights / New Relic
   - Logs centralizados con ELK Stack

---

**Última actualización**: Enero 15, 2026

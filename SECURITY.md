# Security Policy - KicksUp 🔒

## Supported Versions

Versiones del proyecto que reciben actualizaciones de seguridad:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🛡️ Reporting a Vulnerability

Si descubres una vulnerabilidad de seguridad en KicksUp, por favor ayúdanos siguiendo estas pautas de divulgación responsable.

### Proceso de Reporte

1. **NO** abras un issue público en GitHub
2. **NO** divulgues la vulnerabilidad públicamente hasta que haya sido parcheada
3. Envía un reporte detallado usando uno de estos métodos:
   - Email: [Contacto privado del mantenedor]
   - GitHub Security Advisory (si está disponible)

### Información a Incluir

Para ayudarnos a entender y corregir el problema rápidamente, incluye:

```markdown
## Descripción de la Vulnerabilidad
[Descripción clara del problema]

## Tipo de Vulnerabilidad
- [ ] SQL Injection
- [ ] XSS (Cross-Site Scripting)
- [ ] CSRF (Cross-Site Request Forgery)
- [ ] Authentication/Authorization bypass
- [ ] Sensitive data exposure
- [ ] Security misconfiguration
- [ ] Otra: _______

## Severidad Estimada
- [ ] Crítica
- [ ] Alta
- [ ] Media
- [ ] Baja

## Pasos para Reproducir
1. 
2. 
3. 

## Impacto Potencial
[Describe qué puede hacer un atacante]

## Entorno
- Versión de KicksUp:
- Sistema Operativo:
- Navegador (si aplica):
- Configuración especial:

## Proof of Concept (opcional)
[Código, screenshots, logs, etc.]

## Sugerencias de Mitigación (opcional)
[Si tienes ideas de cómo arreglarlo]
```

### Timeline Esperado

- **24 horas**: Confirmación de recepción del reporte
- **7 días**: Evaluación inicial y severidad asignada
- **30 días**: Parche desarrollado y testeado (para severidad alta/crítica)
- **90 días**: Divulgación pública coordinada

## 🔐 Mejores Prácticas de Seguridad

### Para Usuarios

#### 1. Contraseñas

- ✅ Usa contraseñas fuertes (mínimo 8 caracteres)
- ✅ Combina mayúsculas, minúsculas, números y símbolos
- ✅ No reutilices contraseñas de otros sitios
- ❌ No compartas tu contraseña

#### 2. Tokens JWT

- ✅ Los tokens se almacenan en `localStorage`
- ✅ Cierra sesión al terminar en computadoras compartidas
- ⚠️ Los tokens expiran automáticamente (configurable)
- ❌ No compartas tu token

#### 3. Información Personal

- ✅ Revisa qué datos compartes en tu perfil
- ✅ Solo sube imágenes apropiadas como foto de perfil
- ⚠️ Los administradores pueden ver tu información

### Para Desarrolladores

#### 1. Variables de Entorno

```bash
# ❌ NO HACER - Commitear secretos
git add .env
git commit -m "Added config"

# ✅ HACER - Usar .env.example
cp .env.example .env
# Edita .env con valores reales
# .env está en .gitignore
```

#### 2. JWT Secret

```bash
# ❌ NO USAR EN PRODUCCIÓN
JWT_SECRET=mysecret123

# ✅ USAR - Secreto fuerte aleatorio
JWT_SECRET=$(openssl rand -base64 32)
# Ejemplo: 8vY2kL9xN3mP7qR4sT6uV1wX0zA5bC8dE2fG4hJ6kL9mN
```

#### 3. Base de Datos

```bash
# ❌ NO USAR - Credenciales débiles
DATABASE_URL=postgresql://postgres:password@localhost/kicksup

# ✅ USAR - Contraseña fuerte
DATABASE_URL=postgresql://kicksup_user:$(openssl rand -base64 24)@localhost/kicksup
```

#### 4. CORS

```bash
# ❌ NO HACER EN PRODUCCIÓN
CORS_ALLOWED_ORIGINS=*

# ✅ HACER - Orígenes específicos
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### 5. Swagger en Producción

```csharp
// ⚠️ CONSIDERAR - Desactivar Swagger en producción
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Si necesitas Swagger en producción, protégelo:
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "KicksUp API v1");
    // Considera autenticación adicional aquí
});
```

## 🔒 Características de Seguridad Implementadas

### Backend

#### 1. Autenticación JWT

```csharp
// Token con expiración
var token = new JwtSecurityToken(
    issuer: _config["Jwt:Issuer"],
    audience: _config["Jwt:Audience"],
    claims: claims,
    expires: DateTime.UtcNow.AddHours(24), // ✅ Expira en 24h
    signingCredentials: credentials
);
```

#### 2. Hash de Contraseñas

```csharp
// BCrypt con work factor 12
user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(
    request.Password,
    workFactor: 12 // ✅ Costo computacional alto
);
```

#### 3. Autorización por Roles

```csharp
// Solo administradores
[Authorize(Roles = "Administrator")]
[HttpPost]
public async Task<ActionResult> CreateProduct(...) { }
```

#### 4. Validación de Input

```csharp
// FluentValidation en comandos
public class RegisterUserCommandValidator 
    : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(50);
            
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6);
            
        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password);
    }
}
```

#### 5. Integridad Referencial

```csharp
// No permite eliminar usuarios con órdenes
var hasOrders = await _context.OrderItems
    .AnyAsync(oi => oi.Order.UserId == request.UserId);
    
if (hasOrders)
{
    return Error.Validation(
        "User.HasOrders",
        "No se puede eliminar el usuario porque tiene pedidos asociados"
    );
}
```

#### 6. Timestamps UTC

```csharp
// Evita problemas de zona horaria
public override Task<int> SaveChangesAsync(...)
{
    foreach (var entry in ChangeTracker.Entries<BaseEntity>())
    {
        if (entry.State == EntityState.Added)
            entry.Entity.CreatedAt = DateTime.UtcNow; // ✅ UTC
            
        if (entry.State == EntityState.Modified)
            entry.Entity.UpdatedAt = DateTime.UtcNow; // ✅ UTC
    }
    return base.SaveChangesAsync(cancellationToken);
}
```

### Frontend

#### 1. Guards de Ruta

```typescript
// Protección de rutas autenticadas
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

// Protección de rutas administrativas
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  canActivate(): boolean {
    const user = this.authService.currentUser();
    if (user?.role !== 'Administrator') {
      this.router.navigate(['/client/products']);
      return false;
    }
    return true;
  }
}
```

#### 2. HTTP Interceptor

```typescript
// Inyección automática de JWT
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

#### 3. Sanitización de HTML

```typescript
// Evita XSS en contenido dinámico
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

## ⚠️ Vulnerabilidades Conocidas

Actualmente no hay vulnerabilidades conocidas reportadas.

## 🔧 Configuración de Seguridad Recomendada

### Nginx (Producción)

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

# HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# SSL Configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # ... resto de configuración
}
```

### PostgreSQL

```sql
-- Crear usuario específico para la app (no usar postgres)
CREATE USER kicksup_user WITH PASSWORD 'strong_random_password';

-- Dar solo permisos necesarios
GRANT CONNECT ON DATABASE kicksup TO kicksup_user;
GRANT USAGE ON SCHEMA public TO kicksup_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO kicksup_user;

-- No dar DROP, CREATE, ALTER a la app en producción
```

### appsettings.Production.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning", // No "Debug" en producción
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "yourdomain.com", // Específico, no "*"
  "Jwt": {
    "Key": "${JWT_SECRET}", // 32+ caracteres aleatorios
    "Issuer": "https://yourdomain.com",
    "Audience": "https://yourdomain.com",
    "ExpirationHours": 24
  },
  "ConnectionStrings": {
    "DefaultConnection": "${DATABASE_URL}" // Desde variable de entorno
  },
  "CorsSettings": {
    "AllowedOrigins": "${CORS_ALLOWED_ORIGINS}" // Sin wildcard (*)
  }
}
```

## 📋 Security Checklist para Deployment

Antes de desplegar a producción:

### Backend

- [ ] JWT_SECRET es aleatorio y fuerte (32+ caracteres)
- [ ] DATABASE_URL usa credenciales fuertes
- [ ] CORS configurado con orígenes específicos (no wildcard)
- [ ] HTTPS habilitado (certificado SSL válido)
- [ ] Logging configurado apropiadamente (no Debug)
- [ ] Swagger deshabilitado o protegido
- [ ] Variables de entorno no commiteadas (.env en .gitignore)
- [ ] Migraciones de base de datos aplicadas
- [ ] Health checks configurados

### Frontend

- [ ] API URL apunta a HTTPS en producción
- [ ] Build de producción (`ng build --configuration=production`)
- [ ] Source maps deshabilitados en producción
- [ ] console.log eliminados
- [ ] Variables de entorno correctas
- [ ] Guards de autenticación activos
- [ ] Interceptors configurados

### Base de Datos

- [ ] Backups automáticos configurados
- [ ] Usuario de aplicación con permisos limitados
- [ ] Conexiones solo desde IPs permitidas
- [ ] SSL/TLS habilitado para conexiones
- [ ] Logs de auditoría activos

### Infraestructura

- [ ] Firewall configurado
- [ ] Rate limiting configurado
- [ ] Monitoreo y alertas activos
- [ ] Logs centralizados
- [ ] Actualizaciones automáticas de seguridad

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [ASP.NET Core Security Best Practices](https://docs.microsoft.com/aspnet/core/security/)
- [Angular Security Guide](https://angular.io/guide/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🏆 Security Hall of Fame

Agradecimientos a quienes han reportado vulnerabilidades responsablemente:

_(Actualmente vacío)_

---

**Última actualización**: Enero 15, 2026
**Política de seguridad versión**: 1.0

using KicksUp.Application;
using KicksUp.Infrastructure;
using KicksUp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "KicksUp API",
        Version = "v1",
        Description = "API para el sistema de e-commerce de tenis deportivos"
    });

    // Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando el esquema Bearer. Ejemplo: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add CORS
var corsOrigins = builder.Configuration["CorsSettings:AllowedOrigins"]?.Split(',') 
    ?? new[] { "http://localhost:4200" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secret = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
    };
});

builder.Services.AddAuthorization();

// Add Application and Infrastructure layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Aplicar migraciones y cargar datos iniciales automáticamente
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Connection string not found");
    
    try
    {
        logger.LogInformation("=== Iniciando configuración de base de datos ===");
        
        // Crear la base de datos si no existe
        logger.LogInformation("Verificando base de datos...");
        await DatabaseInitializer.EnsureDatabaseCreatedAsync(connectionString);
        
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Verificar si hay migraciones pendientes
        var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
        if (pendingMigrations.Any())
        {
            logger.LogInformation("Aplicando {Count} migraciones pendientes...", pendingMigrations.Count());
            await context.Database.MigrateAsync();
            logger.LogInformation("✓ Migraciones aplicadas correctamente");
        }
        else
        {
            logger.LogInformation("✓ Base de datos actualizada, sin migraciones pendientes");
        }
        
        // Cargar datos iniciales
        logger.LogInformation("Cargando datos iniciales...");
        await ApplicationDbContextSeed.SeedAsync(context);
        logger.LogInformation("✓ Datos iniciales cargados correctamente");
        
        logger.LogInformation("=== Configuración de base de datos completada ===");
        logger.LogInformation("");
        logger.LogInformation("Usuarios de prueba:");
        logger.LogInformation("  Admin: admin / Admin123!");
        logger.LogInformation("  Cliente: cliente / Client123!");
        logger.LogInformation("");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ Error al configurar la base de datos");
        logger.LogError("Verifica que PostgreSQL esté corriendo y accesible");
        logger.LogError("Cadena de conexión: {ConnectionString}", connectionString);
        throw;
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "KicksUp API v1");
        c.RoutePrefix = "swagger";
    });
}
else
{
    // Enable Swagger in production too (optional, can be removed for security)
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "KicksUp API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

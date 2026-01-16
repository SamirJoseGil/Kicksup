using KicksUp.Domain.Entities;
using KicksUp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Infrastructure.Persistence;

// Clase para inicializar datos en la base de datos
public static class ApplicationDbContextSeed
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Seed Admin User
        if (!await context.Users.AnyAsync())
        {
            var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!");
            var clientPasswordHash = BCrypt.Net.BCrypt.HashPassword("Client123!");
            
            var admin = new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Admin",
                LastName = "System",
                Age = 30,
                DateOfBirth = DateTime.SpecifyKind(new DateTime(1994, 1, 1), DateTimeKind.Utc),
                Country = "Colombia",
                State = "Antioquia",
                City = "Medellín",
                Phone = "3001234567",
                Address = "Calle 123 #45-67",
                Username = "admin",
                PasswordHash = adminPasswordHash,
                Role = UserRole.Administrator,
                CreatedAt = DateTime.UtcNow
            };
            
            var client = new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Cliente",
                LastName = "Demo",
                Age = 25,
                DateOfBirth = DateTime.SpecifyKind(new DateTime(1999, 5, 15), DateTimeKind.Utc),
                Country = "Colombia",
                State = "Antioquia",
                City = "Medellín",
                Phone = "3009876543",
                Address = "Carrera 50 #20-30",
                Username = "cliente",
                PasswordHash = clientPasswordHash,
                Role = UserRole.Client,
                CreatedAt = DateTime.UtcNow
            };
            
            context.Users.AddRange(admin, client);
            await context.SaveChangesAsync();
        }

        // Inicializar productos
        if (!await context.Products.AnyAsync())
        {
            var products = new List<Product>
            {
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "NK-AIR-001",
                    Name = "Nike Air Max 90",
                    Description = "Zapatillas deportivas con tecnología Air Max para máxima comodidad",
                    Size = ProductSize.Size9,
                    Color = ProductColor.White,
                    Price = 450000,
                    Stock = 15,
                    ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "AD-ULTRA-001",
                    Name = "Adidas Ultraboost 22",
                    Description = "Running shoes con suela Boost para máxima respuesta energética",
                    Size = ProductSize.Size8,
                    Color = ProductColor.Black,
                    Price = 520000,
                    Stock = 10,
                    ImageUrl = "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "NK-ZOOM-001",
                    Name = "Nike Zoom Pegasus 39",
                    Description = "Tenis de running ligeros con amortiguación reactiva",
                    Size = ProductSize.Size10,
                    Color = ProductColor.Gray,
                    Price = 380000,
                    Stock = 20,
                    ImageUrl = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "AD-STAN-001",
                    Name = "Adidas Stan Smith",
                    Description = "Clásico tenis casual de cuero premium",
                    Size = ProductSize.Size7,
                    Color = ProductColor.White,
                    Price = 320000,
                    Stock = 25,
                    ImageUrl = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "NK-JORDAN-001",
                    Name = "Air Jordan 1 Mid",
                    Description = "Icónico diseño de basketball con estilo urbano",
                    Size = ProductSize.Size9,
                    Color = ProductColor.Black,
                    Price = 680000,
                    Stock = 8,
                    ImageUrl = "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "NB-990-001",
                    Name = "New Balance 990v5",
                    Description = "Premium running shoes con tecnología ENCAP",
                    Size = ProductSize.Size8,
                    Color = ProductColor.Gray,
                    Price = 590000,
                    Stock = 12,
                    ImageUrl = "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "PU-SUEDE-001",
                    Name = "Puma Suede Classic",
                    Description = "Zapatillas retro de ante con suela de goma",
                    Size = ProductSize.Size10,
                    Color = ProductColor.Black,
                    Price = 280000,
                    Stock = 18,
                    ImageUrl = "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "RB-CLASSIC-001",
                    Name = "Reebok Classic Leather",
                    Description = "Tenis clásico de cuero suave y duradero",
                    Size = ProductSize.Size7,
                    Color = ProductColor.White,
                    Price = 310000,
                    Stock = 22,
                    ImageUrl = "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "VN-OLD-001",
                    Name = "Vans Old Skool",
                    Description = "Zapatillas de skate con diseño icónico lateral",
                    Size = ProductSize.Size9,
                    Color = ProductColor.Black,
                    Price = 250000,
                    Stock = 30,
                    ImageUrl = "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Code = "CV-ALLSTAR-001",
                    Name = "Converse All Star High",
                    Description = "Botín clásico de lona con estilo atemporal",
                    Size = ProductSize.Size8,
                    Color = ProductColor.White,
                    Price = 220000,
                    Stock = 35,
                    ImageUrl = "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500",
                    CreatedAt = DateTime.UtcNow
                }
            };
            
            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }
    }
}

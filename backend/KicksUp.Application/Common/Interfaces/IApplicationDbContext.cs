using KicksUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Product> Products { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

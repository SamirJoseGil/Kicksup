using KicksUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KicksUp.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.Code)
            .IsRequired()
            .HasMaxLength(50);
            
        builder.HasIndex(p => p.Code)
            .IsUnique();
            
        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(p => p.Description)
            .IsRequired()
            .HasMaxLength(1000);
            
        builder.Property(p => p.ImageUrl)
            .IsRequired()
            .HasColumnType("text");
            
        builder.Property(p => p.Price)
            .HasPrecision(18, 2);
            
        builder.Property(p => p.Size)
            .HasConversion<int>();
            
        builder.Property(p => p.Color)
            .HasConversion<int>();
        
        builder.HasMany(p => p.OrderItems)
            .WithOne(oi => oi.Product)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

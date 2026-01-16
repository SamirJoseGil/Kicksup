using KicksUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KicksUp.Infrastructure.Persistence.Configurations;

// Configuración de la entidad User
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        
        builder.HasKey(u => u.Id);
        
        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(50);
            
        builder.HasIndex(u => u.Username)
            .IsUnique();
            
        builder.Property(u => u.PasswordHash)
            .IsRequired();
            
        builder.Property(u => u.Phone)
            .HasMaxLength(20);
            
        builder.Property(u => u.Country)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(u => u.State)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(u => u.City)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(u => u.Address)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(u => u.ProfileImageUrl)
            .HasColumnType("text");
            
        builder.Property(u => u.Role)
            .HasConversion<int>();
        
        builder.HasMany(u => u.Orders)
            .WithOne(o => o.User)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

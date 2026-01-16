namespace KicksUp.Domain.Common;


// Clase base para todas las entidades del dominio
public abstract class BaseEntity
{
    
    // Identificador único de la entidad
    public Guid Id { get; set; } = Guid.NewGuid();
    
    
    // Fecha de creación del registro
    public DateTime CreatedAt { get; set; }
    
    
    // Fecha de última actualización del registro
    public DateTime? UpdatedAt { get; set; }
}

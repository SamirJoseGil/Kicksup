using KicksUp.Domain.Common;

namespace KicksUp.Domain.Entities;


// Entidad que representa un ítem dentro de una orden
public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
    
    // Propiedades de navegación
    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
}

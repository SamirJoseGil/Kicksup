using KicksUp.Domain.Common;
using KicksUp.Domain.Enums;

namespace KicksUp.Domain.Entities;


// Entidad que representa una orden de compra
public class Order : BaseEntity
{
    public Guid UserId { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.InProcess;
    public decimal TotalAmount { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    
    // Propiedades de navegación
    public User User { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

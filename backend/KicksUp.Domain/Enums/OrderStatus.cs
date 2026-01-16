namespace KicksUp.Domain.Enums;


// Estados posibles de una orden
public enum OrderStatus
{
    InProcess = 1,  // En proceso
    Paid = 2,       // Pagada
    Shipped = 3,    // Enviada
    Delivered = 4   // Entregada
}

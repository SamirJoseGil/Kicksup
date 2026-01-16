using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Domain.Entities;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Orders.Commands;

// Comando para crear una nueva orden de compra
public class CreateOrderCommand : IRequest<Result<OrderDto>>
{
    public Guid UserId { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public List<OrderItemRequest> Items { get; set; } = new();
}

// Detalles de un ítem en la orden
public class OrderItemRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}

// Manejador del comando para crear una orden
public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Result<OrderDto>>
{
    private readonly IApplicationDbContext _context;

    public CreateOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<OrderDto>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Validar que el usuario exista
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            return Result<OrderDto>.Failure("Usuario no encontrado");
        }

        if (request.Items == null || !request.Items.Any())
        {
            return Result<OrderDto>.Failure("La orden debe tener al menos un producto");
        }

        // Validar productos y stock
        var productIds = request.Items.Select(i => i.ProductId).ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        if (products.Count != productIds.Count)
        {
            return Result<OrderDto>.Failure("Uno o más productos no fueron encontrados");
        }

        var orderItems = new List<OrderItem>();
        decimal totalAmount = 0;

        foreach (var item in request.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);

            if (product.Stock < item.Quantity)
            {
                return Result<OrderDto>.Failure($"Stock insuficiente para el producto {product.Name}");
            }

            var subtotal = product.Price * item.Quantity;
            totalAmount += subtotal;

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                Subtotal = subtotal
            });

            // Actualizar stock
            product.Stock -= item.Quantity;
        }

        // Crear orden
        var order = new Order
        {
            UserId = request.UserId,
            Status = OrderStatus.InProcess,
            TotalAmount = totalAmount,
            DeliveryAddress = request.DeliveryAddress,
            OrderItems = orderItems
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        // Cargar la orden completa con relaciones
        var createdOrder = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstAsync(o => o.Id == order.Id, cancellationToken);

        return Result<OrderDto>.Success(new OrderDto
        {
            Id = createdOrder.Id,
            UserId = createdOrder.UserId,
            UserName = $"{createdOrder.User.FirstName} {createdOrder.User.LastName}",
            Status = createdOrder.Status,
            TotalAmount = createdOrder.TotalAmount,
            DeliveryAddress = createdOrder.DeliveryAddress,
            CreatedAt = createdOrder.CreatedAt,
            Items = createdOrder.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.Product.Name,
                ProductCode = oi.Product.Code,
                ProductImageUrl = oi.Product.ImageUrl,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                Subtotal = oi.Subtotal
            }).ToList()
        });
    }
}

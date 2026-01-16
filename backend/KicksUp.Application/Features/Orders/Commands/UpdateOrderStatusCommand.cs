using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Orders.Commands;

public class UpdateOrderStatusCommand : IRequest<Result<OrderDto>>
{
    public Guid Id { get; set; }
    public OrderStatus Status { get; set; }
}

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, Result<OrderDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdateOrderStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<OrderDto>> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (order == null)
        {
            return Result<OrderDto>.Failure("Orden no encontrada");
        }

        order.Status = request.Status;
        await _context.SaveChangesAsync(cancellationToken);

        return Result<OrderDto>.Success(new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            UserName = $"{order.User.FirstName} {order.User.LastName}",
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            DeliveryAddress = order.DeliveryAddress,
            CreatedAt = order.CreatedAt,
            Items = order.OrderItems.Select(oi => new OrderItemDto
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

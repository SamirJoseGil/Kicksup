using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Orders.Queries;

public class GetOrderByIdQuery : IRequest<Result<OrderDto>>
{
    public Guid Id { get; set; }
}

public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, Result<OrderDto>>
{
    private readonly IApplicationDbContext _context;

    public GetOrderByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<OrderDto>> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.Id == request.Id)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = $"{o.User.FirstName} {o.User.LastName}",
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                DeliveryAddress = o.DeliveryAddress,
                CreatedAt = o.CreatedAt,
                Items = o.OrderItems.Select(oi => new OrderItemDto
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
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (order == null)
        {
            return Result<OrderDto>.Failure("Orden no encontrada");
        }

        return Result<OrderDto>.Success(order);
    }
}

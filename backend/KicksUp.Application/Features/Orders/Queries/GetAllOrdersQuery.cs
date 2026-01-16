using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Orders.Queries;

public class GetAllOrdersQuery : IRequest<Result<List<OrderDto>>>
{
    public OrderStatus? Status { get; set; }
    public Guid? UserId { get; set; }
}

public class GetAllOrdersQueryHandler : IRequestHandler<GetAllOrdersQuery, Result<List<OrderDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAllOrdersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<OrderDto>>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .AsQueryable();

        if (request.Status.HasValue)
        {
            query = query.Where(o => o.Status == request.Status.Value);
        }

        if (request.UserId.HasValue)
        {
            query = query.Where(o => o.UserId == request.UserId.Value);
        }

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
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
            .ToListAsync(cancellationToken);

        return Result<List<OrderDto>>.Success(orders);
    }
}

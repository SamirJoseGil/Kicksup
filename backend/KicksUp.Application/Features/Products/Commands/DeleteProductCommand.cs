using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Products.Commands;

public class DeleteProductCommand : IRequest<Result<bool>>
{
    public Guid Id { get; set; }
}

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (product == null)
        {
            return Result<bool>.Failure("Producto no encontrado");
        }

        // Check if product has been ordered
        var hasOrders = await _context.OrderItems
            .AnyAsync(oi => oi.ProductId == request.Id, cancellationToken);

        if (hasOrders)
        {
            return Result<bool>.Failure("No se puede eliminar el producto porque tiene pedidos asociados. Puedes marcarlo como no disponible en su lugar.");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}

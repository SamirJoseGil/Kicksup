using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Products.Commands;

// Comando para eliminar un producto por su ID
public class DeleteProductCommand : IRequest<Result<bool>>
{
    public Guid Id { get; set; }
}

// Manejador del comando para eliminar un producto
public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    // Manejador del comando para eliminar un producto
    public async Task<Result<bool>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (product == null)
        {
            return Result<bool>.Failure("Producto no encontrado");
        }

        // Revisar si el producto está asociado a alguna orden
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

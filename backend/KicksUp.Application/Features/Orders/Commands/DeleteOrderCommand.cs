using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Orders.Commands;

// Comando para eliminar una orden de compra
public class DeleteOrderCommand : IRequest<Result<bool>>
{
    public Guid Id { get; set; }
}

// Manejador del comando para eliminar una orden
public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    // Manejador del comando para eliminar una orden
    public async Task<Result<bool>> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (order == null)
        {
            return Result<bool>.Failure("Orden no encontrada");
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}

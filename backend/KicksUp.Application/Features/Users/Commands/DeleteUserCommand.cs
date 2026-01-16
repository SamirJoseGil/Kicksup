using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Users.Commands;

// Comando para eliminar un usuario por su ID
public class DeleteUserCommand : IRequest<Result<bool>>
{
    public Guid Id { get; set; }
}

// Manejador del comando para eliminar un usuario
public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (user == null)
        {
            return Result<bool>.Failure("Usuario no encontrado");
        }

        // Check if user has orders
        var hasOrders = await _context.Orders
            .AnyAsync(o => o.UserId == request.Id, cancellationToken);

        if (hasOrders)
        {
            return Result<bool>.Failure("No se puede eliminar el usuario porque tiene pedidos asociados");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}

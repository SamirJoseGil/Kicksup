using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Users.Commands;

// Comando para actualizar el rol de un usuario
public class UpdateUserRoleCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public UserRole Role { get; set; }
}

// Manejador del comando para actualizar el rol de un usuario
public class UpdateUserRoleCommandHandler : IRequestHandler<UpdateUserRoleCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public UpdateUserRoleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    // Manejador del comando para actualizar el rol de un usuario
    public async Task<Result<bool>> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            return Result<bool>.Failure("Usuario no encontrado");
        }

        user.Role = request.Role;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}

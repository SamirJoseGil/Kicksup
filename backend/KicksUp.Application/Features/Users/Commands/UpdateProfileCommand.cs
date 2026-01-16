using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Users.Commands;

public class UpdateProfileCommand : IRequest<Result<UserProfileDto>>
{
    public Guid UserId { get; set; }
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? ProfileImageUrl { get; set; }
}

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ProfileImageUrl { get; set; } = string.Empty;
}

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, Result<UserProfileDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdateProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<UserProfileDto>> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            return Result<UserProfileDto>.Failure("Usuario no encontrado");
        }

        // Parse full name into first and last name
        if (!string.IsNullOrEmpty(request.FullName))
        {
            var nameParts = request.FullName.Trim().Split(' ', 2);
            user.FirstName = nameParts[0];
            user.LastName = nameParts.Length > 1 ? nameParts[1] : "";
        }

        if (request.Phone != null)
        {
            user.Phone = request.Phone;
        }

        if (request.Address != null)
        {
            user.Address = request.Address;
        }

        if (request.ProfileImageUrl != null)
        {
            user.ProfileImageUrl = request.ProfileImageUrl;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Result<UserProfileDto>.Success(new UserProfileDto
        {
            Id = user.Id,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Username = user.Username,
            Phone = user.Phone,
            Address = user.Address,
            ProfileImageUrl = user.ProfileImageUrl
        });
    }
}

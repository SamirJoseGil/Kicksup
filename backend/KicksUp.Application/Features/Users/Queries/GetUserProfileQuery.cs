using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Application.Features.Users.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Users.Queries;

public class GetUserProfileQuery : IRequest<Result<UserProfileDto>>
{
    public Guid UserId { get; set; }
}

public class GetUserProfileQueryHandler : IRequestHandler<GetUserProfileQuery, Result<UserProfileDto>>
{
    private readonly IApplicationDbContext _context;

    public GetUserProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<UserProfileDto>> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            return Result<UserProfileDto>.Failure("Usuario no encontrado");
        }

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

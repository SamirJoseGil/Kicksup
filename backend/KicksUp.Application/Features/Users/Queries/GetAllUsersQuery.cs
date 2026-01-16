using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Users.Queries;

public class GetAllUsersQuery : IRequest<Result<List<UserDto>>>
{
}

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, Result<List<UserDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAllUsersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<UserDto>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Username = u.Username,
                Age = u.Age,
                Country = u.Country,
                State = u.State,
                City = u.City,
                Phone = u.Phone,
                Address = u.Address,
                Role = u.Role.ToString(),
                ProfileImageUrl = u.ProfileImageUrl,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Result<List<UserDto>>.Success(users);
    }
}

public class UserDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Country { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string ProfileImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Domain.Entities;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Authentication.Commands;

public class RegisterCommand : IRequest<Result<AuthenticationResponse>>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int Age { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Country { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Client;
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<AuthenticationResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;

    public RegisterCommandHandler(IApplicationDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthenticationResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if username already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

        if (existingUser != null)
        {
            return Result<AuthenticationResponse>.Failure("El nombre de usuario ya existe");
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create user
        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Age = request.Age,
            DateOfBirth = DateTime.SpecifyKind(request.DateOfBirth, DateTimeKind.Utc),
            Country = request.Country,
            State = request.State,
            City = request.City,
            Phone = request.Phone,
            Address = request.Address,
            Username = request.Username,
            PasswordHash = passwordHash,
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Generate token
        var token = _tokenService.GenerateToken(user.Id, user.Username, user.Role.ToString());

        return Result<AuthenticationResponse>.Success(new AuthenticationResponse
        {
            Token = token,
            Username = user.Username,
            Role = user.Role.ToString(),
            UserId = user.Id
        });
    }
}

public class AuthenticationResponse
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid UserId { get; set; }
}

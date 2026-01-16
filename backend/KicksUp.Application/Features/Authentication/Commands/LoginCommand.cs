using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Application.Features.Authentication.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Authentication.Commands;

public class LoginCommand : IRequest<Result<AuthenticationResponse>>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthenticationResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;

    public LoginCommandHandler(IApplicationDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthenticationResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Find user
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

        if (user == null)
        {
            return Result<AuthenticationResponse>.Failure("Usuario o contraseña incorrectos");
        }

        // Verify password
        var isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isValidPassword)
        {
            return Result<AuthenticationResponse>.Failure("Usuario o contraseña incorrectos");
        }

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

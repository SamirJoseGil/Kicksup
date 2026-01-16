namespace KicksUp.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateToken(Guid userId, string username, string role);
}

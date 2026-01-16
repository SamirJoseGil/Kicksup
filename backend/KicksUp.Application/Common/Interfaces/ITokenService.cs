namespace KicksUp.Application.Common.Interfaces;

// Servicio para generación de tokens de autenticación
public interface ITokenService
{
    string GenerateToken(Guid userId, string username, string role);
}

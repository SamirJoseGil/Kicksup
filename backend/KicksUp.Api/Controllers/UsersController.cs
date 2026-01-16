using KicksUp.Application.Features.Users.Commands;
using KicksUp.Application.Features.Users.Queries;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KicksUp.Api.Controllers;

// Controlador para gestión de usuarios
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Obtiene el perfil del usuario autenticado
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized();
        }

        var query = new GetUserProfileQuery { UserId = userGuid };
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(new { error = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    // Actualiza el perfil del usuario autenticado
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized();
        }

        var command = new UpdateProfileCommand
        {
            UserId = userGuid,
            FullName = request.FullName,
            Phone = request.Phone,
            Address = request.Address,
            ProfileImageUrl = request.ProfileImageUrl
        };

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    // Obtiene todos los usuarios (solo administradores)
    [Authorize(Roles = "Administrator")]
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var query = new GetAllUsersQuery();
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    // Elimina un usuario por ID (solo administradores)
    [Authorize(Roles = "Administrator")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var command = new DeleteUserCommand { Id = id };
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.ErrorMessage });
        }

        return Ok(new { message = "Usuario eliminado exitosamente" });
    }

    // Actualiza el rol de un usuario (solo administradores)
    [Authorize(Roles = "Administrator")]
    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] UpdateUserRoleRequest request)
    {
        var command = new UpdateUserRoleCommand 
        { 
            UserId = id,
            Role = request.Role
        };
        
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.ErrorMessage });
        }

        return Ok(new { message = "Rol actualizado exitosamente" });
    }
}

public class UpdateProfileRequest
{
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? ProfileImageUrl { get; set; }
}

public class UpdateUserRoleRequest
{
    public UserRole Role { get; set; }
}

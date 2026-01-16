using KicksUp.Application.Features.Orders.Commands;
using KicksUp.Application.Features.Orders.Queries;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KicksUp.Api.Controllers;

// Controlador para gestión de órdenes
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Obtiene todas las órdenes con filtros opcionales
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] OrderStatus? status)
    {
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var query = new GetAllOrdersQuery
        {
            Status = status
        };

        // If client, only show their orders
        if (userRole == "Client" && Guid.TryParse(userId, out var userGuid))
        {
            query.UserId = userGuid;
        }

        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    // Obtiene una orden por ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetOrderByIdQuery { Id = id };
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(new { error = result.ErrorMessage });
        }

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userRole == "Client" && result.Data!.UserId.ToString() != userId)
        {
            return Forbid();
        }

        return Ok(result.Data);
    }

    // Crea una nueva orden
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderCommand command)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized();
        }

        command.UserId = userGuid;
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.ErrorMessage });
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    // Actualiza el estado de una orden (solo administradores)
    [Authorize(Roles = "Administrator")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        var command = new UpdateOrderStatusCommand
        {
            Id = id,
            Status = request.Status
        };

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    // Elimina una orden (solo administradores)
    [Authorize(Roles = "Administrator")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeleteOrderCommand { Id = id };
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return NotFound(new { error = result.ErrorMessage });
        }

        return NoContent();
    }
}

public class UpdateOrderStatusRequest
{
    public OrderStatus Status { get; set; }
}

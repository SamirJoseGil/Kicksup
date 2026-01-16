using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Products.Queries;

// Query para obtener un producto por su ID
public class GetProductByIdQuery : IRequest<Result<ProductDto>>
{
    public Guid Id { get; set; }
}

// Manejador del query para obtener un producto por su ID
public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, Result<ProductDto>>
{
    private readonly IApplicationDbContext _context;

    public GetProductByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    // Manejador del query para obtener un producto por su ID
    public async Task<Result<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Where(p => p.Id == request.Id)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Code = p.Code,
                ImageUrl = p.ImageUrl,
                Name = p.Name,
                Description = p.Description,
                Size = p.Size,
                Color = p.Color,
                Price = p.Price,
                Stock = p.Stock
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (product == null)
        {
            return Result<ProductDto>.Failure("Producto no encontrado");
        }

        return Result<ProductDto>.Success(product);
    }
}

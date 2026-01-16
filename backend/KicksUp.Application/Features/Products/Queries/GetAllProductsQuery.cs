using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Products.Queries;


// Query para obtener todos los productos con filtros opcionales
public class GetAllProductsQuery : IRequest<Result<List<ProductDto>>>
{
    public string? SearchTerm { get; set; }
    public ProductSize? Size { get; set; }
    public ProductColor? Color { get; set; }
}


// Manejador del query para obtener productos
public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, Result<List<ProductDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAllProductsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<ProductDto>>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Products.AsQueryable();

        // Aplicar filtros
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(p => 
                p.Name.ToLower().Contains(searchTerm) ||
                p.Description.ToLower().Contains(searchTerm) ||
                p.Code.ToLower().Contains(searchTerm));
        }

        if (request.Size.HasValue)
        {
            query = query.Where(p => p.Size == request.Size.Value);
        }

        if (request.Color.HasValue)
        {
            query = query.Where(p => p.Color == request.Color.Value);
        }

        var products = await query
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
            .ToListAsync(cancellationToken);

        return Result<List<ProductDto>>.Success(products);
    }
}

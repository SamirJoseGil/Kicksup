using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Domain.Entities;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Products.Commands;


// Comando para crear un nuevo producto
public class CreateProductCommand : IRequest<Result<ProductDto>>
{
    public string Code { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ProductSize Size { get; set; }
    public ProductColor Color { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}


// Manejador del comando de crear producto
public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Result<ProductDto>>
{
    private readonly IApplicationDbContext _context;

    public CreateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ProductDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // Verificar si el código ya existe
        var existingProduct = await _context.Products
            .FirstOrDefaultAsync(p => p.Code == request.Code, cancellationToken);

        if (existingProduct != null)
        {
            return Result<ProductDto>.Failure("Ya existe un producto con este código");
        }

        var product = new Product
        {
            Code = request.Code,
            ImageUrl = request.ImageUrl,
            Name = request.Name,
            Description = request.Description,
            Size = request.Size,
            Color = request.Color,
            Price = request.Price,
            Stock = request.Stock
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<ProductDto>.Success(new ProductDto
        {
            Id = product.Id,
            Code = product.Code,
            ImageUrl = product.ImageUrl,
            Name = product.Name,
            Description = product.Description,
            Size = product.Size,
            Color = product.Color,
            Price = product.Price,
            Stock = product.Stock
        });
    }
}

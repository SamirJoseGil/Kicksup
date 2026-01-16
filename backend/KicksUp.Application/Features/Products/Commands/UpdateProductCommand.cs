using KicksUp.Application.Common.Interfaces;
using KicksUp.Application.Common.Models;
using KicksUp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KicksUp.Application.Features.Products.Commands;

public class UpdateProductCommand : IRequest<Result<ProductDto>>
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ProductSize Size { get; set; }
    public ProductColor Color { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, Result<ProductDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ProductDto>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (product == null)
        {
            return Result<ProductDto>.Failure("Producto no encontrado");
        }

        // Check if code already exists on another product
        var existingProduct = await _context.Products
            .FirstOrDefaultAsync(p => p.Code == request.Code && p.Id != request.Id, cancellationToken);

        if (existingProduct != null)
        {
            return Result<ProductDto>.Failure("Ya existe otro producto con este código");
        }

        product.Code = request.Code;
        product.ImageUrl = request.ImageUrl;
        product.Name = request.Name;
        product.Description = request.Description;
        product.Size = request.Size;
        product.Color = request.Color;
        product.Price = request.Price;
        product.Stock = request.Stock;

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

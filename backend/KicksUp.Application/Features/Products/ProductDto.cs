using KicksUp.Domain.Enums;

namespace KicksUp.Application.Features.Products;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ProductSize Size { get; set; }
    public string SizeDisplay => Size.ToString().Replace("Size", "");
    public ProductColor Color { get; set; }
    public string ColorDisplay => Color.ToString();
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public bool IsAvailable => Stock > 0;
}

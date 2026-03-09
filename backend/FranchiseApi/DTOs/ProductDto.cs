namespace FranchiseApi.DTOs;

public class CreateProductDto
{
    public int BranchId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Stock { get; set; }
    public int MinStock { get; set; } = 0;
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public int Stock { get; set; }
    public int MinStock { get; set; } = 0;
}

public class UpdateStockDto
{
    public int Stock { get; set; }
}

public class ProductDto
{
    public int Id { get; set; }
    public int BranchId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Stock { get; set; }
    public int MinStock { get; set; }
    public bool IsLowStock => Stock <= MinStock && MinStock > 0;
}
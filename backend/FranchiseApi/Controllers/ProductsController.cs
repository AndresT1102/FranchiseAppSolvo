using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FranchiseApi.Data;
using FranchiseApi.Models;
using FranchiseApi.DTOs;

namespace FranchiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(ApplicationDbContext context, ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts([FromQuery] int? branchId = null)
    {
        try
        {
            var query = _context.Products
                .AsNoTracking() 
                .AsQueryable();

            if (branchId.HasValue)
            {
                query = query.Where(p => p.BranchId == branchId.Value);
            }

            var products = await query
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    BranchId = p.BranchId,
                    Name = p.Name,
                    Stock = p.Stock,
                    MinStock = p.MinStock
                })
                .ToListAsync();

            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products");
            return StatusCode(500, "An error occurred while retrieving products");
        }
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            var product = await _context.Products
                .AsNoTracking() 
                .Where(p => p.Id == id)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    BranchId = p.BranchId,
                    Name = p.Name,
                    Stock = p.Stock,
                    MinStock = p.MinStock
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound($"Product with ID {id} not found");
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the product");
        }
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Product name is required");
            }

            if (dto.Stock < 0)
            {
                return BadRequest("Stock cannot be negative");
            }

            if (dto.MinStock < 0)
            {
                return BadRequest("Minimum stock cannot be negative");
            }

            var branchExists = await _context.Branches
                .AsNoTracking()
                .AnyAsync(b => b.Id == dto.BranchId);
            
            if (!branchExists)
            {
                return BadRequest($"Branch with ID {dto.BranchId} does not exist");
            }

            var duplicateExists = await _context.Products
                .AsNoTracking()
                .AnyAsync(p => p.BranchId == dto.BranchId && 
                              EF.Functions.Like(p.Name, dto.Name));

            if (duplicateExists)
            {
                return Conflict($"A product with the name '{dto.Name}' already exists in this branch");
            }

            var product = new Product
            {
                BranchId = dto.BranchId,
                Name = dto.Name,
                Stock = dto.Stock,
                MinStock = dto.MinStock
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var productDto = new ProductDto
            {
                Id = product.Id,
                BranchId = product.BranchId,
                Name = product.Name,
                Stock = product.Stock,
                MinStock = product.MinStock
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, "An error occurred while creating the product");
        }
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Product name is required");
            }

            if (dto.Stock < 0)
            {
                return BadRequest("Stock cannot be negative");
            }

            if (dto.MinStock < 0)
            {
                return BadRequest("Minimum stock cannot be negative");
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound($"Product with ID {id} not found");
            }

            var duplicateExists = await _context.Products
                .AsNoTracking()
                .AnyAsync(p => p.Id != id && 
                              p.BranchId == product.BranchId && 
                              EF.Functions.Like(p.Name, dto.Name));

            if (duplicateExists)
            {
                return Conflict($"A product with the name '{dto.Name}' already exists in this branch");
            }

            product.Name = dto.Name;
            product.Stock = dto.Stock;
            product.MinStock = dto.MinStock;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {Id}", id);
            return StatusCode(500, "An error occurred while updating the product");
        }
    }

    // PATCH: api/products/5/stock
    [HttpPatch("{id}/stock")]
    public async Task<IActionResult> UpdateStock(int id, UpdateStockDto dto)
    {
        try
        {
            if (dto.Stock < 0)
            {
                return BadRequest("Stock cannot be negative");
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound($"Product with ID {id} not found");
            }

            product.Stock = dto.Stock;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating stock for product {Id}", id);
            return StatusCode(500, "An error occurred while updating the stock");
        }
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound($"Product with ID {id} not found");
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {Id}", id);
            return StatusCode(500, "An error occurred while deleting the product");
        }
    }
}
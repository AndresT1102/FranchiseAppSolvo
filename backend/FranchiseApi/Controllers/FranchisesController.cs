using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FranchiseApi.Data;
using FranchiseApi.Models;
using FranchiseApi.DTOs;

namespace FranchiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FranchisesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FranchisesController> _logger;

    public FranchisesController(ApplicationDbContext context, ILogger<FranchisesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/franchises
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FranchiseDto>>> GetFranchises()
    {
        try
        {
            var franchises = await _context.Franchises
                .AsNoTracking() 
                .Select(f => new FranchiseDto
                {
                    Id = f.Id,
                    Name = f.Name
                })
                .ToListAsync();

            return Ok(franchises);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting franchises");
            return StatusCode(500, "An error occurred while retrieving franchises");
        }
    }

    // GET: api/franchises/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FranchiseDto>> GetFranchise(int id)
    {
        try
        {
            var franchise = await _context.Franchises
                .AsNoTracking()
                .Where(f => f.Id == id)
                .Select(f => new FranchiseDto
                {
                    Id = f.Id,
                    Name = f.Name
                })
                .FirstOrDefaultAsync();

            if (franchise == null)
            {
                return NotFound($"Franchise with ID {id} not found");
            }

            return Ok(franchise);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting franchise {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the franchise");
        }
    }

    // POST: api/franchises
    [HttpPost]
    public async Task<ActionResult<FranchiseDto>> CreateFranchise(CreateFranchiseDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Franchise name is required");
            }

            var duplicateExists = await _context.Franchises
                .AsNoTracking()
                .AnyAsync(f => EF.Functions.Like(f.Name, dto.Name));

            if (duplicateExists)
            {
                return Conflict($"A franchise with the name '{dto.Name}' already exists");
            }

            var franchise = new Franchise
            {
                Name = dto.Name
            };

            _context.Franchises.Add(franchise);
            await _context.SaveChangesAsync();

            var franchiseDto = new FranchiseDto
            {
                Id = franchise.Id,
                Name = franchise.Name
            };

            return CreatedAtAction(nameof(GetFranchise), new { id = franchise.Id }, franchiseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating franchise");
            return StatusCode(500, "An error occurred while creating the franchise");
        }
    }

    // PUT: api/franchises/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFranchise(int id, UpdateFranchiseDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Franchise name is required");
            }

            var franchise = await _context.Franchises.FindAsync(id);
            if (franchise == null)
            {
                return NotFound($"Franchise with ID {id} not found");
            }

            var duplicateExists = await _context.Franchises
                .AsNoTracking()
                .AnyAsync(f => f.Id != id && EF.Functions.Like(f.Name, dto.Name));

            if (duplicateExists)
            {
                return Conflict($"A franchise with the name '{dto.Name}' already exists");
            }

            franchise.Name = dto.Name;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating franchise {Id}", id);
            return StatusCode(500, "An error occurred while updating the franchise");
        }
    }

    // DELETE: api/franchises/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFranchise(int id)
    {
        try
        {
            var franchise = await _context.Franchises.FindAsync(id);
            if (franchise == null)
            {
                return NotFound($"Franchise with ID {id} not found");
            }

            _context.Franchises.Remove(franchise);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting franchise {Id}", id);
            return StatusCode(500, "An error occurred while deleting the franchise");
        }
    }
}
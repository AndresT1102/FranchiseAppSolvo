using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FranchiseApi.Data;
using FranchiseApi.Models;
using FranchiseApi.DTOs;

namespace FranchiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BranchesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<BranchesController> _logger;

    public BranchesController(ApplicationDbContext context, ILogger<BranchesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/branches
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BranchDto>>> GetBranches([FromQuery] int? franchiseId = null)
    {
        try
        {
            var query = _context.Branches.AsQueryable();

            if (franchiseId.HasValue)
            {
                query = query.Where(b => b.FranchiseId == franchiseId.Value);
            }

            var branches = await query
                .Select(b => new BranchDto
                {
                    Id = b.Id,
                    FranchiseId = b.FranchiseId,
                    Name = b.Name
                })
                .ToListAsync();

            return Ok(branches);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting branches");
            return StatusCode(500, "An error occurred while retrieving branches");
        }
    }

    // GET: api/branches/5
    [HttpGet("{id}")]
    public async Task<ActionResult<BranchDto>> GetBranch(int id)
    {
        try
        {
            var branch = await _context.Branches
                .Where(b => b.Id == id)
                .Select(b => new BranchDto
                {
                    Id = b.Id,
                    FranchiseId = b.FranchiseId,
                    Name = b.Name
                })
                .FirstOrDefaultAsync();

            if (branch == null)
            {
                return NotFound($"Branch with ID {id} not found");
            }

            return Ok(branch);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting branch {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the branch");
        }
    }

    // POST: api/branches
    [HttpPost]
    public async Task<ActionResult<BranchDto>> CreateBranch(CreateBranchDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Branch name is required");
            }

            var franchiseExists = await _context.Franchises.AnyAsync(f => f.Id == dto.FranchiseId);
            if (!franchiseExists)
            {
                return BadRequest($"Franchise with ID {dto.FranchiseId} does not exist");
            }

            var branch = new Branch
            {
                FranchiseId = dto.FranchiseId,
                Name = dto.Name
            };

            _context.Branches.Add(branch);
            await _context.SaveChangesAsync();

            var branchDto = new BranchDto
            {
                Id = branch.Id,
                FranchiseId = branch.FranchiseId,
                Name = branch.Name
            };

            return CreatedAtAction(nameof(GetBranch), new { id = branch.Id }, branchDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating branch");
            return StatusCode(500, "An error occurred while creating the branch");
        }
    }

    // PUT: api/branches/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBranch(int id, UpdateBranchDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Branch name is required");
            }

            var branch = await _context.Branches.FindAsync(id);
            if (branch == null)
            {
                return NotFound($"Branch with ID {id} not found");
            }

            branch.Name = dto.Name;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating branch {Id}", id);
            return StatusCode(500, "An error occurred while updating the branch");
        }
    }

    // DELETE: api/branches/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBranch(int id)
    {
        try
        {
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null)
            {
                return NotFound($"Branch with ID {id} not found");
            }

            _context.Branches.Remove(branch);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting branch {Id}", id);
            return StatusCode(500, "An error occurred while deleting the branch");
        }
    }
}
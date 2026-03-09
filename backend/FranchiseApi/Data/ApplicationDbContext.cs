using Microsoft.EntityFrameworkCore;
using FranchiseApi.Models;

namespace FranchiseApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Franchise> Franchises { get; set; }
    public DbSet<Branch> Branches { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Las configuraciones ya están en las anotaciones de los modelos
        // Aquí puedes agregar configuraciones adicionales si las necesitas
    }
}
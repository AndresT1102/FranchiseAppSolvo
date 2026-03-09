using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FranchiseApi.Models;

[Table("TBL_BRANCHES")]
public class Branch
{
    [Key]
    [Column("Branch_Id")]
    public int Id { get; set; }
    
    [Column("Franchise_Id")]
    public int FranchiseId { get; set; }
    
    [Required]
    [MaxLength(150)]
    [Column("Branch_Name")]
    public string Name { get; set; } = string.Empty;
    
    // Navigation properties
    [ForeignKey("FranchiseId")]
    public Franchise Franchise { get; set; } = null!;
    
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
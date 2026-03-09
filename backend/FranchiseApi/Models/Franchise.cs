using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FranchiseApi.Models;

[Table("TBL_FRANCHISES")]
public class Franchise
{
    [Key]
    [Column("Franchise_Id")]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(150)]
    [Column("Franchise_Name")]
    public string Name { get; set; } = string.Empty;
    
    // Navigation property
    public ICollection<Branch> Branches { get; set; } = new List<Branch>();
}
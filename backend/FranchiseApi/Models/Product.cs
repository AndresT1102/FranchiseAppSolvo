using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FranchiseApi.Models;

[Table("TBL_PRODUCTS")]
public class Product
{
    [Key]
    [Column("Product_Id")]
    public int Id { get; set; }
    
    [Column("Branch_Id")]
    public int BranchId { get; set; }
    
    [Required]
    [MaxLength(150)]
    [Column("Product_Name")]
    public string Name { get; set; } = string.Empty;
    
    [Column("Stock")]
    public int Stock { get; set; }

    [Column("Min_Stock")]
    public int MinStock { get; set; } = 0;
    
    // Navigation property
    [ForeignKey("BranchId")]
    public Branch Branch { get; set; } = null!;
}
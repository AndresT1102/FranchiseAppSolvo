namespace FranchiseApi.DTOs;

public class CreateBranchDto
{
    public int FranchiseId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class UpdateBranchDto
{
    public string Name { get; set; } = string.Empty;
}

public class BranchDto
{
    public int Id { get; set; }
    public int FranchiseId { get; set; }
    public string Name { get; set; } = string.Empty;
}
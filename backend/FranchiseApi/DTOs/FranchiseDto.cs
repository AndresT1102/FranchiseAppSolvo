namespace FranchiseApi.DTOs;

public class CreateFranchiseDto
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateFranchiseDto
{
    public string Name { get; set; } = string.Empty;
}

public class FranchiseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
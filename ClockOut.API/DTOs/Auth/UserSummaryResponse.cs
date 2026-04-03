namespace ClockOut.API.DTOs.Auth;

public sealed class UserSummaryResponse
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int RequiredHours { get; set; }
    public DateTime CreatedAt { get; set; }
}

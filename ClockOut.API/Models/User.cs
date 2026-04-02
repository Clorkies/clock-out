namespace ClockOut.API.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int RequiredHours { get; set; } = 300;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<LogEntry> LogEntries { get; set; } = new List<LogEntry>();
}
